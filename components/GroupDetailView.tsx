"use client"
import { useState, useEffect } from "react"
import { useApp } from "@/contexts/AppContext"
import DateDisplay from "@/components/DateDisplay"
import ClientOnly from "@/components/ClientOnly"
import EnrollmentModal from "@/components/EnrollmentModal"
import { getDaysActive } from "@/utils/dateUtils"

interface GroupDetailViewProps {
  groupId: string
  onBack: () => void
}

export default function GroupDetailView({ groupId, onBack }: GroupDetailViewProps) {
  const { user, joinGroup, leaveGroup } = useApp()
  const [group, setGroup] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)
  const [showEnrollment, setShowEnrollment] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "activity">("overview")

  useEffect(() => {
    fetchGroup()
  }, [groupId])

  const fetchGroup = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/groups/${groupId}`, {
        headers: user ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {},
      })

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

  const handleJoin = () => {
    if (!user) return
    setShowEnrollment(true)
  }

  const handleLeave = async () => {
    if (!user || !confirm("Are you sure you want to leave this group?")) return

    setIsLeaving(true)
    const success = await leaveGroup(group._id)
    if (success) {
      await fetchGroup() // Refresh group data
    }
    setIsLeaving(false)
  }

  const handleJoinSuccess = async () => {
    await fetchGroup() // Refresh group data after joining
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
        <div>Loading group details...</div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="empty-state">
        <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>🔍</span>
        <h3>Group not found</h3>
        <p>The group you're looking for doesn't exist or has been removed.</p>
        <button onClick={onBack} className="btn btn-primary">
          🔙 Go Back
        </button>
      </div>
    )
  }

  const getActivityLevel = () => {
    if (group.memberCount >= 50) return { level: "High Activity", color: "#16a34a", icon: "🔥" }
    if (group.memberCount >= 20) return { level: "Medium Activity", color: "#d97706", icon: "⚡" }
    return { level: "Growing Community", color: "#6b7280", icon: "🌱" }
  }

  const activity = getActivityLevel()

  return (
    <>
      <div>
        {/* Back Button */}
        <button
          onClick={onBack}
          className="btn btn-outline"
          style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          ← Back to Groups
        </button>

        {/* Group Header */}
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "white" }}>{group.title}</h1>

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
                    background: activity.color,
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {activity.icon} {activity.level}
                </span>
              </div>

              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "1rem" }}>
                👤 Created by <strong>{group.adminName}</strong> • 👥 {group.memberCount} members • 📅{" "}
                <DateDisplay date={group.createdAt} format="date" />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {user && !group.isAdmin && (
                <>
                  {group.membershipStatus === "pending" ? (
                    <button disabled className="btn" style={{ background: "rgba(251, 191, 36, 0.8)", color: "white" }}>
                      ⏳ Request Pending
                    </button>
                  ) : group.isMember ? (
                    <button
                      onClick={handleLeave}
                      disabled={isLeaving}
                      className="btn"
                      style={{ background: "rgba(220, 38, 38, 0.8)", color: "white" }}
                    >
                      {isLeaving ? "⏳ Leaving..." : "🚪 Leave Group"}
                    </button>
                  ) : (
                    <button
                      onClick={handleJoin}
                      className="btn"
                      style={{ background: "rgba(34, 197, 94, 0.8)", color: "white" }}
                    >
                      📝 Join Group
                    </button>
                  )}
                </>
              )}
              {group.isAdmin && (
                <button
                  className="btn"
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  ✏️ Edit Group
                </button>
              )}
            </div>
          </div>

          <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginTop: "1.5rem", opacity: 0.95 }}>
            {group.description}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs" style={{ marginBottom: "2rem" }}>
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📋 Overview
          </button>
          <button className={`tab ${activeTab === "members" ? "active" : ""}`} onClick={() => setActiveTab("members")}>
            👥 Members ({group.memberCount})
          </button>
          <button
            className={`tab ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            📈 Activity
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div>
            <div className="card" style={{ marginBottom: "2rem" }}>
              <h3 style={{ marginBottom: "1rem", color: "#374151" }}>📊 Group Statistics</h3>
              <div
                style={{
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
                    <ClientOnly fallback="...">{getDaysActive(group.createdAt)}</ClientOnly>
                  </div>
                  <div style={{ color: "#6b7280" }}>Days Active</div>
                </div>
                <div style={{ textAlign: "center", padding: "1rem", background: "#fef3c7", borderRadius: "8px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏷️</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#d97706" }}>{group.category}</div>
                  <div style={{ color: "#6b7280" }}>Category</div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: "1rem", color: "#374151" }}>ℹ️ About This Group</h3>
              <p style={{ lineHeight: "1.6", color: "#4b5563", marginBottom: "1.5rem" }}>{group.description}</p>

              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                <div>
                  <h4 style={{ color: "#374151", marginBottom: "0.5rem" }}>👤 Group Admin</h4>
                  <p style={{ color: "#6b7280" }}>{group.adminName}</p>
                </div>
                <div>
                  <h4 style={{ color: "#374151", marginBottom: "0.5rem" }}>🔓 Access Level</h4>
                  <p style={{ color: "#6b7280" }}>
                    {group.visibility === "public" ? "Public - Anyone can join" : "Private - Admin approval required"}
                  </p>
                </div>
                <div>
                  <h4 style={{ color: "#374151", marginBottom: "0.5rem" }}>📂 Category</h4>
                  <p style={{ color: "#6b7280" }}>{group.category}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="card">
            <h3 style={{ marginBottom: "1.5rem", color: "#374151" }}>👥 Group Members</h3>
            <div className="member-list">
              {group.members?.slice(0, 5).map((member: any, index: number) => (
                <div key={member._id || index} className="member-item">
                  <div className="member-avatar">{member.userName?.charAt(0).toUpperCase() || "?"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "500", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {member.userName || "Unknown User"}
                      {member.userId === group.adminId && (
                        <span
                          style={{
                            background: "#dc2626",
                            color: "white",
                            padding: "0.125rem 0.5rem",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                          }}
                        >
                          Admin
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      Joined <DateDisplay date={member.joinedAt} format="date" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {group.memberCount > 5 && (
              <div style={{ textAlign: "center", marginTop: "1rem", color: "#6b7280" }}>
                And {group.memberCount - 5} more members...
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="card">
            <h3 style={{ marginBottom: "1.5rem", color: "#374151" }}>📈 Recent Activity</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>🎉</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>{group.adminName} created the group</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    <DateDisplay date={group.createdAt} format="relative" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <EnrollmentModal
        isOpen={showEnrollment}
        onClose={() => setShowEnrollment(false)}
        group={group}
        onSuccess={handleJoinSuccess}
      />
    </>
  )
}
