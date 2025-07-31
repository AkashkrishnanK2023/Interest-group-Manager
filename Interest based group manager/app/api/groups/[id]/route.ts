import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    let currentUserId = null

    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        currentUserId = decoded.userId
      }
    }

    const db = await getDatabase()
    const groups = db.collection("groups")
    const memberships = db.collection("memberships")

    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 })
    }

    const group = await groups.findOne({ _id: new ObjectId(params.id) })
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    const members = await memberships
      .find({
        groupId: params.id,
        status: "approved",
      })
      .toArray()

    let membershipStatus = null
    let isMember = false

    if (currentUserId) {
      const membership = await memberships.findOne({
        userId: currentUserId,
        groupId: params.id,
      })
      if (membership) {
        membershipStatus = membership.status
        isMember = membership.status === "approved"
      }
    }

    const groupWithMembers = {
      ...group,
      _id: group._id.toString(),
      members: members.map((m) => ({
        ...m,
        _id: m._id.toString(),
      })),
      isAdmin: currentUserId === group.adminId,
      isMember,
      membershipStatus,
    }

    return NextResponse.json(groupWithMembers)
  } catch (error) {
    console.error("Get group error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 })
    }

    const { title, description, category, visibility } = await request.json()

    if (!title || !description || !category || !visibility) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const groups = db.collection("groups")

    const group = await groups.findOne({ _id: new ObjectId(params.id) })
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    if (group.adminId !== decoded.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    await groups.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          title,
          description,
          category,
          visibility,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Group updated successfully" })
  } catch (error) {
    console.error("Update group error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const groups = db.collection("groups")
    const memberships = db.collection("memberships")

    const group = await groups.findOne({ _id: new ObjectId(params.id) })
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    if (group.adminId !== decoded.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Delete group and all memberships
    await groups.deleteOne({ _id: new ObjectId(params.id) })
    await memberships.deleteMany({ groupId: params.id })

    return NextResponse.json({ message: "Group deleted successfully" })
  } catch (error) {
    console.error("Delete group error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
