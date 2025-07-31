import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
    const users = db.collection("users")

    // Check if group exists
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

    // Get all memberships for this group
    const memberships_list = await memberships
      .find({ groupId: params.id })
      .toArray()

    // Get user details for each membership
    const membersWithDetails = await Promise.all(
      memberships_list.map(async (membership) => {
        let userQuery
        if (ObjectId.isValid(membership.userId)) {
          userQuery = { _id: new ObjectId(membership.userId) }
        } else {
          userQuery = { _id: membership.userId }
        }

        const user = await users.findOne(userQuery)
        
        return {
          _id: membership._id.toString(),
          userId: {
            _id: user?._id?.toString() || membership.userId,
            name: user?.name || membership.userName || "Unknown User",
            email: user?.email || "unknown@example.com"
          },
          status: membership.status,
          joinedAt: membership.joinedAt,
          role: membership.role || "member"
        }
      })
    )

    // Add group admin as a member if not already in the list
    const adminUser = await users.findOne(
      ObjectId.isValid(group.adminId) 
        ? { _id: new ObjectId(group.adminId) }
        : { _id: group.adminId }
    )

    const adminAlreadyMember = membersWithDetails.some(
      member => member.userId._id === group.adminId
    )

    if (!adminAlreadyMember && adminUser) {
      membersWithDetails.unshift({
        _id: "admin_membership",
        userId: {
          _id: adminUser._id.toString(),
          name: adminUser.name,
          email: adminUser.email
        },
        status: "approved",
        joinedAt: group.createdAt,
        role: "admin"
      })
    }

    return NextResponse.json(membersWithDetails)
  } catch (error) {
    console.error("Get members error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Approve member
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { memberId, action } = await request.json()

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

    if (action === "approve") {
      await memberships.updateOne(
        { _id: memberId },
        { $set: { status: "approved" } }
      )

      // Update group member count
      const approvedCount = await memberships.countDocuments({
        groupId: params.id,
        status: "approved"
      })
      
      await groups.updateOne(
        groupQuery,
        { $set: { memberCount: approvedCount + 1 } } // +1 for admin
      )

      return NextResponse.json({ message: "Member approved successfully" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Member action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}