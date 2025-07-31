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

    // Check if already a member
    const existingMembership = await memberships.findOne({
      userId: decoded.userId,
      groupId: params.id,
    })

    if (existingMembership) {
      return NextResponse.json({ error: "Already a member or request pending" }, { status: 400 })
    }

    const status = group.visibility === "public" ? "approved" : "pending"

    await memberships.insertOne({
      userId: decoded.userId,
      userName: decoded.name,
      groupId: params.id,
      status,
      joinedAt: new Date(),
    })

    // Update member count if approved
    if (status === "approved") {
      await groups.updateOne({ _id: new ObjectId(params.id) }, { $inc: { memberCount: 1 } })
    }

    return NextResponse.json({
      message: status === "approved" ? "Joined group successfully" : "Join request sent",
      status,
    })
  } catch (error) {
    console.error("Join group error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
