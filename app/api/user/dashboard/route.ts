import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const db = await getDatabase()
    const groups = db.collection("groups")
    const memberships = db.collection("memberships")

    // Get groups created by user
    const createdGroups = await groups.find({ adminId: decoded.userId }).toArray()

    // Get groups joined by user (where user is a member but not admin)
    const joinedMemberships = await memberships
      .find({
        userId: decoded.userId,
        status: "approved",
      })
      .toArray()

    // Get the actual group documents for joined groups (excluding created groups)
    const joinedGroupIds = joinedMemberships
      .map((m) => m.groupId)
      .filter((id) => !createdGroups.some((g) => g._id.toString() === id))

    let joinedGroups = []
    if (joinedGroupIds.length > 0) {
      // Convert string IDs to ObjectIds for the query
      const objectIds = joinedGroupIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id))

      if (objectIds.length > 0) {
        joinedGroups = await groups
          .find({
            _id: { $in: objectIds },
          })
          .toArray()
      }
    }

    return NextResponse.json({
      createdGroups: createdGroups.map((g) => ({ ...g, _id: g._id.toString() })),
      joinedGroups: joinedGroups.map((g) => ({ ...g, _id: g._id.toString() })),
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
