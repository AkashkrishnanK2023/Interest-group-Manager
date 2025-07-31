"use client"

import { useState } from "react"
import Link from "next/link"

// Mock data
const mockGroups = [
  {
    _id: "1",
    title: "React Developers",
    description:
      "A community for React developers to share knowledge, discuss best practices, and collaborate on projects. We welcome developers of all skill levels!",
    category: "Technology",
    visibility: "public" as const,
    adminName: "John Doe",
    memberCount: 45,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    _id: "2",
    title: "Photography Enthusiasts",
    description:
      "Share your photos, get feedback, and learn new techniques from fellow photography lovers. Monthly photo challenges and workshops included.",
    category: "Art",
    visibility: "public" as const,
    adminName: "Jane Smith",
    memberCount: 32,
    createdAt: "2024-01-20T14:30:00Z",
  },
  {
    _id: "3",
    title: "Local Hiking Group",
    description:
      "Join us for weekend hikes and outdoor adventures in the local area. All skill levels welcome! Safety first, fun always.",
    category: "Sports",
    visibility: "private" as const,
    adminName: "Mike Johnson",
    memberCount: 18,
    createdAt: "2024-01-25T09:15:00Z",
  },
  {
    _id: "4",
    title: "Book Club",
    description:
      "Monthly book discussions, author interviews, and literary events for book lovers. Currently reading contemporary fiction.",
    category: "Education",
    visibility: "public" as const,
    adminName: "Sarah Wilson",
    memberCount: 28,
    createdAt: "2024-02-01T16:45:00Z",
  },
  {
    _id: "5",
    title: "Startup Founders",
    description:
      "Network with fellow entrepreneurs, share experiences, and get advice on building successful startups.",
    category: "Business",
    visibility: "private" as const,
    adminName: "Alex Chen",
    memberCount: 15,
    createdAt: "2024-02-05T11:20:00Z",
  },
  {
    _id: "6",
    title: "Gaming Community",
    description:
      "Discuss the latest games, organize multiplayer sessions, and share gaming tips and tricks with fellow gamers.",
    category: "Gaming",
    visibility: "public" as const,
    adminName: "Chris Taylor",
    memberCount: 67,
    createdAt: "2024-02-10T19:30:00Z",
  },
]

const categories = [
  "All",
  "Technology",
  "Sports",
  "Music",
  "Art",
  "Education",
  "Gaming",
  "Business",
  "Health",
  "Travel",
  "Food",
  "Books",
  "Movies",
  "Photography",
]

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">
            🌟 Interest Groups
          </Link>
          <nav className="nav">
            <Link href="/dashboard">📊 Dashboard</Link>
            <Link href="/groups">🔍 Browse Groups</Link>
            <Link href="/groups/create" className="btn btn-primary">
              ➕ Create Group
            </Link>
            <span style={{ color: "#6b7280" }}>Welcome, Demo User</span>
            <button className="btn btn-secondary">🚪 Logout</button>
          </nav>
        </div>
      </div>
    </header>
  )
}

function GroupCard({ group }: { group: (typeof mockGroups)[0] }) {
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)

  const handleQuickJoin = async () => {
    setIsJoining(true)
    setTimeout(() => {
      setHasJoined(true)
      setIsJoining(false)
    }, 1000)
  }

  const getActivityLevel = () => {
    if (group.memberCount >= 50) return { level: "High", color: "#16a34a", icon: "🔥" }
    if (group.memberCount >= 20) return { level: "Medium", color: "#d97706", icon: "⚡" }
    return { level: "Growing", color: "#6b7280", icon: "🌱" }
  }

  const activity = getActivityLevel()

  return (
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          <div>👤 Created by {group.adminName}</div>
          <div>📅 {new Date(group.createdAt).toLocaleDateString()}</div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {!hasJoined && (
            <button
              onClick={handleQuickJoin}
              disabled={isJoining}
              className="btn btn-primary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
            >
              {isJoining ? "⏳ Joining..." : "🚀 Quick Join"}
            </button>
          )}
          {hasJoined && (
            <span
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              ✅ Joined!
            </span>
          )}
          <button
            className="btn btn-outline"
            style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
            onClick={() => alert(`Viewing details for ${group.title}`)}
          >
            👁️ View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GroupsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const filteredGroups = mockGroups
    .filter((group) => selectedCategory === "All" || group.category === selectedCategory)
    .filter(
      (group) =>
        group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.memberCount - a.memberCount
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: "#374151", display: "flex", alignItems: "center", gap: "0.5rem" }}>🔍 Browse Groups</h1>
          <button className="btn btn-primary" onClick={() => alert("Create new group")}>
            ➕ Create Group
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
            <div className="form-group" style={{ margin: 0, minWidth: "200px", flex: 1 }}>
              <label htmlFor="search">🔍 Search Groups</label>
              <input
                type="text"
                id="search"
                className="form-control"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0, minWidth: "150px" }}>
              <label htmlFor="category">📂 Category</label>
              <select
                id="category"
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0, minWidth: "120px" }}>
              <label htmlFor="sort">📊 Sort by</label>
              <select id="sort" className="form-control" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
          Showing {filteredGroups.length} of {mockGroups.length} groups
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>🔍</span>
            <h3>No groups found</h3>
            <p>Try adjusting your search criteria or create a new group!</p>
            <button className="btn btn-primary" style={{ marginTop: "1rem" }}>
              ➕ Create New Group
            </button>
          </div>
        ) : (
          <div className="grid grid-2">
            {filteredGroups.map((group) => (
              <GroupCard key={group._id} group={group} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredGroups.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button className="btn btn-outline" onClick={() => alert("Load more groups")}>
              📄 Load More Groups
            </button>
          </div>
        )}
      </main>
    </>
  )
}
