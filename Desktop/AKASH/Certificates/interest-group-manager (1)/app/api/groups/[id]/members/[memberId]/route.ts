import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

// Remove member
export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string; memberId: string } }
) {
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

    // Check if user is admin of the group
    let groupQuery
    if (ObjectId.isValid(params.id)) {
      groupQuery = { _id: new ObjectId(params.id) }
    } else {
      groupQuery = { _id: params.id }
    }

    const group = await groups.findOne(groupQuery)
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    if (group.adminId !== decoded.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Remove the membership
    await memberships.deleteOne({ _id: params.memberId })

    // Update group member count
    const approvedCount = await memberships.countDocuments({
      groupId: params.id,
      status: "approved"
    })
    
    await groups.updateOne(
      groupQuery,
      { $set: { memberCount: approvedCount + 1 } } // +1 for admin
    )

    return NextResponse.json({ message: "Member removed successfully" })
  } catch (error) {
    console.error("Remove member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}