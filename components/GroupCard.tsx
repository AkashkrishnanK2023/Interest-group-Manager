"use client"
import { useState } from "react"
import { useApp, type Group } from "@/contexts/AppContext"
import DateDisplay from "@/components/DateDisplay"
import EnrollmentModal from "@/components/EnrollmentModal"

interface GroupCardProps {
  group: Group
  onViewDetails: (groupId: string) => void
}

export default function GroupCard({ group, onViewDetails }: GroupCardProps) {
  const { user, leaveGroup } = useApp()
  const [isLeaving, setIsLeaving] = useState(false)
  const [showEnrollment, setShowEnrollment] = useState(false)

  // Safe property access with fallbacks
  // For groups from list API, we don't have member arrays, so we use the membership status from the group object
  const isUserMember = user && (
    (group.members && Array.isArray(group.members) && group.members.some(m => m.userId === user._id)) ||
    (group.isMember === true)
  )
  const isPendingMember = user && (
    (group.pendingMembers && Array.isArray(group.pendingMembers) && group.pendingMembers.includes(user._id)) ||
    (group.membershipStatus === "pending")
  )
  const isUserAdmin = user && group.adminId === user._id

  const handleJoin = () => {
    if (!user) {
      // Could show login modal here
      return
    }
    setShowEnrollment(true)
  }

  const handleLeave = async () => {
    if (!user || !confirm("Are you sure you want to leave this group?")) return

    setIsLeaving(true)
    setTimeout(() => {
      leaveGroup(group._id)
      setIsLeaving(false)
    }, 500)
  }

  const getActivityLevel = () => {
    if (group.memberCount >= 50) return { level: "High", color: "#16a34a", icon: "🔥" }
    if (group.memberCount >= 20) return { level: "Medium", color: "#d97706", icon: "⚡" }
    return { level: "Growing", color: "#6b7280", icon: "🌱" }
  }

  const activity = getActivityLevel()

  return (
    <>
      <div className="card group-card" style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: activity.color,
            color: "white",
            padding: "0.25rem 0.75rem",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <span>{activity.icon}</span>
          {activity.level}
        </div>

        <div className="group-header">
          <div>
            <h3 className="group-title" style={{ paddingRight: "5rem" }}>
              {group.title}
            </h3>
            <div className="group-meta">
              <span className={`badge ${group.visibility === "public" ? "badge-public" : "badge-private"}`}>
                {group.visibility === "public" ? "🌍 Public" : "🔒 Private"}
              </span>
              <span
                style={{ background: "#e5e7eb", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.75rem" }}
              >
                📂 {group.category}
              </span>
              <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>👥 {group.memberCount} members</span>
            </div>
          </div>
        </div>

        <p style={{ marginBottom: "1rem", color: "#4b5563", lineHeight: "1.5" }}>
          {group.description.length > 120 ? `${group.description.substring(0, 120)}...` : group.description}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.5rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            <div>👤 Created by {group.adminName}</div>
            <div>
              📅 <DateDisplay date={group.createdAt} format="date" />
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {user && !isUserAdmin && (
              <>
                {isPendingMember ? (
                  <span
                    style={{
                      background: "#fef3c7",
                      color: "#92400e",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    ⏳ Pending
                  </span>
                ) : isUserMember ? (
                  <button onClick={handleLeave} disabled={isLeaving} className="btn btn-danger btn-small">
                    {isLeaving ? "⏳ Leaving..." : "🚪 Leave"}
                  </button>
                ) : (
                  <button onClick={handleJoin} className="btn btn-primary btn-small">
                    📝 Join Group
                  </button>
                )}
              </>
            )}
            <button className="btn btn-outline btn-small" onClick={() => onViewDetails(group._id)}>
              👁️ View Details
            </button>
          </div>
        </div>
      </div>

      <EnrollmentModal isOpen={showEnrollment} onClose={() => setShowEnrollment(false)} group={group} />
    </>
  )
}
