"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface Member {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  status: "approved" | "pending"
  joinedAt: string
  role?: "member" | "moderator"
}

interface MemberManagementProps {
  groupId: string
  isAdmin: boolean
  onMemberUpdate: () => void
}

export default function MemberManagement({ groupId, isAdmin, onMemberUpdate }: MemberManagementProps) {
  const { token } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [pendingMembers, setPendingMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchMembers()
  }, [groupId])

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setMembers(data.filter((m: Member) => m.status === "approved"))
        setPendingMembers(data.filter((m: Member) => m.status === "pending"))
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const approveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members/${memberId}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        fetchMembers()
        onMemberUpdate()
      }
    } catch (error) {
      console.error("Error approving member:", error)
    }
  }

  const removeMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return

    try {
      const response = await fetch(`/api/groups/${groupId}/members/${memberId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        fetchMembers()
        onMemberUpdate()
      }
    } catch (error) {
      console.error("Error removing member:", error)
    }
  }

  const promoteToModerator = async (memberId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members/${memberId}/promote`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        fetchMembers()
      }
    } catch (error) {
      console.error("Error promoting member:", error)
    }
  }

  const filteredMembers = members.filter((member) =>
    member.userId.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) return <div>Loading members...</div>

  return (
    <div className="card" style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ margin: 0, color: "#374151" }}>👥 Members ({members.length})</h3>
        <input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.5rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            width: "200px",
          }}
        />
      </div>

      {/* Pending Requests */}
      {isAdmin && pendingMembers.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h4 style={{ color: "#d97706", marginBottom: "1rem" }}>⏳ Pending Requests ({pendingMembers.length})</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {pendingMembers.map((member) => (
              <div
                key={member._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  background: "#fef3c7",
                  borderRadius: "8px",
                  border: "1px solid #fbbf24",
                }}
              >
                <div>
                  <div style={{ fontWeight: "500" }}>{member.userId.name}</div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Requested {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => approveMember(member._id)}
                    className="btn btn-primary"
                    style={{ padding: "0.5rem 1rem" }}
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => removeMember(member._id)}
                    className="btn btn-danger"
                    style={{ padding: "0.5rem 1rem" }}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Members */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {filteredMembers.map((member) => (
          <div
            key={member._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {member.userId.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: "500", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {member.userId.name}
                  {member.role === "moderator" && (
                    <span
                      style={{
                        background: "#10b981",
                        color: "white",
                        padding: "0.125rem 0.5rem",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                      }}
                    >
                      Moderator
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {isAdmin && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {member.role !== "moderator" && (
                  <button
                    onClick={() => promoteToModerator(member._id)}
                    className="btn btn-outline"
                    style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem" }}
                  >
                    🔝 Promote
                  </button>
                )}
                <button
                  onClick={() => removeMember(member._id)}
                  className="btn btn-danger"
                  style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem" }}
                >
                  🗑️ Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>👥</span>
          {searchTerm ? "No members found matching your search" : "No members yet"}
        </div>
      )}
    </div>
  )
}
