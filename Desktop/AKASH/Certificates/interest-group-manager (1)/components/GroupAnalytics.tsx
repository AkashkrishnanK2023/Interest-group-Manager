"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface Analytics {
  totalMembers: number
  newMembersThisWeek: number
  pendingRequests: number
  memberGrowth: { date: string; count: number }[]
  categoryDistribution: { [key: string]: number }
}

interface GroupAnalyticsProps {
  groupId: string
  isAdmin: boolean
}

export default function GroupAnalytics({ groupId, isAdmin }: GroupAnalyticsProps) {
  const { token } = useAuth()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics()
    }
  }, [groupId, isAdmin])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin || loading) return null

  if (!analytics) return null

  return (
    <div className="card" style={{ marginTop: "2rem" }}>
      <h3 style={{ marginBottom: "1.5rem", color: "#374151" }}>📊 Group Analytics</h3>

      <div className="grid grid-3" style={{ marginBottom: "2rem" }}>
        <div style={{ textAlign: "center", padding: "1rem", background: "#f0f9ff", borderRadius: "8px" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563eb" }}>{analytics.totalMembers}</div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Total Members</div>
        </div>
        <div style={{ textAlign: "center", padding: "1rem", background: "#f0fdf4", borderRadius: "8px" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#16a34a" }}>{analytics.newMembersThisWeek}</div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>New This Week</div>
        </div>
        <div style={{ textAlign: "center", padding: "1rem", background: "#fef3c7", borderRadius: "8px" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#d97706" }}>{analytics.pendingRequests}</div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Pending Requests</div>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h4 style={{ marginBottom: "1rem", color: "#374151" }}>Member Growth Trend</h4>
        <div
          style={{
            display: "flex",
            alignItems: "end",
            gap: "4px",
            height: "100px",
            padding: "1rem",
            background: "#f9fafb",
            borderRadius: "8px",
          }}
        >
          {analytics.memberGrowth.map((point, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                background: "#2563eb",
                height: `${Math.max((point.count / Math.max(...analytics.memberGrowth.map((p) => p.count))) * 80, 5)}px`,
                borderRadius: "2px 2px 0 0",
                opacity: 0.8,
              }}
              title={`${point.date}: ${point.count} members`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
