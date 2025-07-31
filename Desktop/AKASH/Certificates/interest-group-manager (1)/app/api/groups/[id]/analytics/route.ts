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

    // Check if user is admin
    const group = await groups.findOne({ _id: new ObjectId(params.id) })
    if (!group || group.adminId !== decoded.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Get analytics data
    const totalMembers = await memberships.countDocuments({
      groupId: params.id,
      status: "approved",
    })

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const newMembersThisWeek = await memberships.countDocuments({
      groupId: params.id,
      status: "approved",
      joinedAt: { $gte: oneWeekAgo },
    })

    const pendingRequests = await memberships.countDocuments({
      groupId: params.id,
      status: "pending",
    })

    // Generate mock member growth data (in a real app, you'd track this over time)
    const memberGrowth = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      count: Math.max(1, totalMembers - Math.floor(Math.random() * 5)),
    }))

    return NextResponse.json({
      totalMembers,
      newMembersThisWeek,
      pendingRequests,
      memberGrowth,
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
