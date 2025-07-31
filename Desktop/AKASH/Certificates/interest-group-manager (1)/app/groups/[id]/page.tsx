"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth, AuthProvider } from "@/contexts/AuthContext"
import Header from "@/components/Header"
import MemberManagement from "@/components/MemberManagement"
import GroupAnalytics from "@/components/GroupAnalytics"
import GroupActivityFeed from "@/components/GroupActivityFeed"
import type { GroupWithMembers } from "@/types"

function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const [group, setGroup] = useState<GroupWithMembers | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "analytics" | "activity">("overview")

  const fetchGroup = async () => {
    try {
      const headers: any = { "Content-Type": "application/json" }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(`/api/groups/${params.id}`, { headers })
      if (response.ok) {
        const data = await response.json()
        setGroup(data)
      }
    } catch (error) {
      console.error("Error fetching group:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchGroup()
    }
  }, [params.id, token])

  const handleJoinGroup = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch(`/api/groups/${params.id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchGroup()
      }
    } catch (error) {
      console.error("Error joining group:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleLeaveGroup = async () => {
    if (!confirm("Are you sure you want to leave this group?")) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/groups/${params.id}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchGroup()
      }
    } catch (error) {
      console.error("Error leaving group:", error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <div>Loading group details...</div>
        </div>
      </>
    )
  }

  if (!group) {
    return (
      <>
        <Header />
        <div className="container" style={{ paddingTop: "2rem" }}>
          <div className="empty-state">
            <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>🔍</span>
            <h3>Group not found</h3>
            <p>The group you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => router.push("/groups")} className="btn btn-primary">
              🔙 Browse Groups
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: "2rem" }}>
        {/* Group Header */}
        <div
          className="card"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}
        >
          <div className="group-header">
            <div>
              <h1 className="group-title" style={{ fontSize: "2.5rem", color: "white", marginBottom: "1rem" }}>
                {group.title}
              </h1>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                <span
                  style={{
                    background: group.visibility === "public" ? "rgba(34, 197, 94, 0.2)" : "rgba(251, 191, 36, 0.2)",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {group.visibility === "public" ? "🌍 Public Group" : "🔒 Private Group"}
                </span>
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  📂 {group.category}
                </span>
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  👥 {group.memberCount} members
                </span>
              </div>
              <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                👤 Created by <strong>{group.adminName}</strong> • 📅 {new Date(group.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              {group.isAdmin ? (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => router.push(`/groups/${group._id}/edit`)}
                    className="btn"
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    ✏️ Edit Group
                  </button>
                </div>
              ) : group.isMember ? (
                <button
                  onClick={handleLeaveGroup}
                  disabled={actionLoading}
                  className="btn"
                  style={{ background: "rgba(220, 38, 38, 0.8)", color: "white" }}
                >
                  {actionLoading ? "⏳ Leaving..." : "🚪 Leave Group"}
                </button>
              ) : group.membershipStatus === "pending" ? (
                <button disabled className="btn" style={{ background: "rgba(251, 191, 36, 0.8)", color: "white" }}>
                  ⏳ Request Pending
                </button>
              ) : (
                <button
                  onClick={handleJoinGroup}
                  disabled={actionLoading}
                  className="btn"
                  style={{ background: "rgba(34, 197, 94, 0.8)", color: "white" }}
                >
                  {actionLoading ? "⏳ Joining..." : "🚀 Join Group"}
                </button>
              )}
            </div>
          </div>

          <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginTop: "1.5rem", opacity: 0.95 }}>
            {group.description}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "2rem", marginBottom: "1rem" }}>
          {[
            { key: "overview", label: "📋 Overview", icon: "📋" },
            { key: "members", label: "👥 Members", icon: "👥" },
            ...(group.isAdmin ? [{ key: "analytics", label: "📊 Analytics", icon: "📊" }] : []),
            { key: "activity", label: "📈 Activity", icon: "📈" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className="btn"
              style={{
                background: activeTab === tab.key ? "#2563eb" : "white",
                color: activeTab === tab.key ? "white" : "#6b7280",
                border: "1px solid #e5e7eb",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div>
            <div className="card">
              <h3 style={{ marginBottom: "1rem", color: "#374151" }}>📝 About This Group</h3>
              <p style={{ lineHeight: "1.6", color: "#4b5563" }}>{group.description}</p>

              <div
                style={{
                  marginTop: "2rem",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                <div style={{ textAlign: "center", padding: "1rem", background: "#f0f9ff", borderRadius: "8px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👥</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2563eb" }}>{group.memberCount}</div>
                  <div style={{ color: "#6b7280" }}>Total Members</div>
                </div>
                <div style={{ textAlign: "center", padding: "1rem", background: "#f0fdf4", borderRadius: "8px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📅</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#16a34a" }}>
                    {Math.ceil((Date.now() - new Date(group.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div style={{ color: "#6b7280" }}>Days Active</div>
                </div>
                <div style={{ textAlign: "center", padding: "1rem", background: "#fef3c7", borderRadius: "8px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏷️</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#d97706" }}>{group.category}</div>
                  <div style={{ color: "#6b7280" }}>Category</div>
                </div>
                <div style={{ textAlign: "center", padding: "1rem", background: "#fef7ff", borderRadius: "8px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    {group.visibility === "public" ? "🌍" : "🔒"}
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#7c3aed" }}>
                    {group.visibility === "public" ? "Public" : "Private"}
                  </div>
                  <div style={{ color: "#6b7280" }}>Visibility</div>
                </div>
              </div>
            </div>

            {/* Recent Members Preview */}
            <div className="card" style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: "#374151" }}>👥 Recent Members</h3>
                <button
                  onClick={() => setActiveTab("members")}
                  className="btn btn-outline"
                  style={{ fontSize: "0.875rem" }}
                >
                  View All Members →
                </button>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {group.members && group.members.slice(0, 8).map((member: any, index: number) => (
                  <div
                    key={member._id || index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      background: "#f9fafb",
                      borderRadius: "20px",
                      border: "1px solid #e5e7eb",
                      fontSize: "0.875rem"
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "#2563eb",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      {(member.userName || "U").charAt(0).toUpperCase()}
                    </div>
                    <span>{member.userName || "Unknown"}</span>
                  </div>
                ))}
                {(!group.members || group.members.length === 0) && (
                  <div style={{ color: "#6b7280", fontStyle: "italic" }}>
                    No members to display
                  </div>
                )}
                {group.members && group.members.length > 8 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.5rem 1rem",
                      background: "#f3f4f6",
                      borderRadius: "20px",
                      fontSize: "0.875rem",
                      color: "#6b7280"
                    }}
                  >
                    +{group.members.length - 8} more
                  </div>
                )}
              </div>
            </div>

            {/* Group Details */}
            <div className="card" style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginBottom: "1rem", color: "#374151" }}>ℹ️ Group Information</h3>
              <div style={{ display: "grid", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid #e5e7eb" }}>
                  <span style={{ color: "#6b7280" }}>👤 Created by:</span>
                  <span style={{ fontWeight: "500" }}>{group.adminName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid #e5e7eb" }}>
                  <span style={{ color: "#6b7280" }}>📅 Created on:</span>
                  <span style={{ fontWeight: "500" }}>{new Date(group.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid #e5e7eb" }}>
                  <span style={{ color: "#6b7280" }}>🏷️ Category:</span>
                  <span style={{ fontWeight: "500" }}>{group.category}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid #e5e7eb" }}>
                  <span style={{ color: "#6b7280" }}>🔒 Privacy:</span>
                  <span style={{ fontWeight: "500" }}>
                    {group.visibility === "public" ? "🌍 Public Group" : "🔒 Private Group"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0" }}>
                  <span style={{ color: "#6b7280" }}>👥 Total Members:</span>
                  <span style={{ fontWeight: "500" }}>{group.memberCount} members</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <MemberManagement groupId={group._id} isAdmin={group.isAdmin} onMemberUpdate={fetchGroup} />
        )}

        {activeTab === "analytics" && group.isAdmin && <GroupAnalytics groupId={group._id} isAdmin={group.isAdmin} />}

        {activeTab === "activity" && <GroupActivityFeed groupId={group._id} />}
      </main>
    </>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <GroupDetailPage />
    </AuthProvider>
  )
}
