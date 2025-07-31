import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "newest"

    const db = await getDatabase()
    const groups = db.collection("groups")

    const query: any = {}

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    let sortQuery: any = {}
    switch (sort) {
      case "popular":
        sortQuery = { memberCount: -1 }
        break
      case "oldest":
        sortQuery = { createdAt: 1 }
        break
      default:
        sortQuery = { createdAt: -1 }
    }

    const groupsList = await groups.find(query).sort(sortQuery).toArray()

    const formattedGroups = groupsList.map((group) => ({
      ...group,
      _id: group._id.toString(),
    }))

    return NextResponse.json(formattedGroups)
  } catch (error) {
    console.error("Get groups error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { title, description, category, visibility } = await request.json()

    if (!title || !description || !category || !visibility) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const groups = db.collection("groups")

    const result = await groups.insertOne({
      title,
      description,
      category,
      visibility,
      adminId: decoded.userId,
      adminName: decoded.name,
      memberCount: 1,
      createdAt: new Date(),
    })

    // Add admin as first member
    const memberships = db.collection("memberships")
    await memberships.insertOne({
      userId: decoded.userId,
      userName: decoded.name,
      groupId: result.insertedId.toString(),
      status: "approved",
      joinedAt: new Date(),
    })

    const newGroup = {
      _id: result.insertedId.toString(),
      title,
      description,
      category,
      visibility,
      adminId: decoded.userId,
      adminName: decoded.name,
      memberCount: 1,
      createdAt: new Date(),
    }

    return NextResponse.json(newGroup)
  } catch (error) {
    console.error("Create group error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
