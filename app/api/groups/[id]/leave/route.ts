import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

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

    const db = await getDatabase()
    const groups = db.collection("groups")
    const memberships = db.collection("memberships")

    const group = await groups.findOne({ _id: new ObjectId(params.id) })
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    if (group.adminId === decoded.userId) {
      return NextResponse.json({ error: "Admin cannot leave group" }, { status: 400 })
    }

    const membership = await memberships.findOne({
      userId: decoded.userId,
      groupId: params.id,
    })

    if (!membership) {
      return NextResponse.json({ error: "Not a member" }, { status: 400 })
    }

    await memberships.deleteOne({
      userId: decoded.userId,
      groupId: params.id,
    })

    // Update member count if was approved member
    if (membership.status === "approved") {
      await groups.updateOne({ _id: new ObjectId(params.id) }, { $inc: { memberCount: -1 } })
    }

    return NextResponse.json({ message: "Left group successfully" })
  } catch (error) {
    console.error("Leave group error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
