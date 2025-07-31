"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface Activity {
  _id: string
  type: "member_joined" | "member_left" | "group_updated" | "member_promoted"
  message: string
  userName: string
  createdAt: string
}

interface GroupActivityFeedProps {
  groupId: string
}

export default function GroupActivityFeed({ groupId }: GroupActivityFeedProps) {
  const { token } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [groupId])

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error("Error fetching activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "member_joined":
        return "👋"
      case "member_left":
        return "👋"
      case "group_updated":
        return "✏️"
      case "member_promoted":
        return "⭐"
      default:
        return "📝"
    }
  }

  if (loading) return <div>Loading activity...</div>

  return (
    <div className="card" style={{ marginTop: "2rem" }}>
      <h3 style={{ marginBottom: "1.5rem", color: "#374151" }}>📈 Recent Activity</h3>

      {activities.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>📊</span>
          No recent activity
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {activities.map((activity) => (
            <div
              key={activity._id}
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
              <span style={{ fontSize: "1.5rem" }}>{getActivityIcon(activity.type)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.9rem" }}>{activity.message}</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                  {new Date(activity.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
