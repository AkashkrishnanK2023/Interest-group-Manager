"use client"
import Link from "next/link"

// Mock data
const mockCreatedGroups = [
  {
    _id: "1",
    title: "React Developers",
    description: "A community for React developers to share knowledge and collaborate.",
    category: "Technology",
    visibility: "public" as const,
    memberCount: 45,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    _id: "2",
    title: "Local Hiking Group",
    description: "Weekend hikes and outdoor adventures in the local area.",
    category: "Sports",
    visibility: "private" as const,
    memberCount: 18,
    createdAt: "2024-01-25T09:15:00Z",
  },
]

const mockJoinedGroups = [
  {
    _id: "3",
    title: "Photography Enthusiasts",
    description: "Share photos, get feedback, and learn new techniques.",
    category: "Art",
    visibility: "public" as const,
    memberCount: 32,
    createdAt: "2024-01-20T14:30:00Z",
  },
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

function GroupCard({ group, showEditButton = false }: { group: any; showEditButton?: boolean }) {
  return (
    <div className="card group-card">
      <div className="group-header">
        <div>
          <h3 className="group-title">{group.title}</h3>
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

      <p style={{ marginBottom: "1rem", color: "#4b5563", lineHeight: "1.5" }}>{group.description}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          📅 Created {new Date(group.createdAt).toLocaleDateString()}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className="btn btn-outline"
            style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
            onClick={() => alert(`Viewing ${group.title}`)}
          >
            👁️ View
          </button>
          {showEditButton && (
            <button
              className="btn btn-secondary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
              onClick={() => alert(`Editing ${group.title}`)}
            >
              ✏️ Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: "2rem" }}>
        {/* Welcome Section */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#2563eb" }}>Welcome back, Demo User! 👋</h1>
          <p style={{ fontSize: "1.2rem", color: "#666" }}>Manage your groups and discover new communities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-3" style={{ marginBottom: "3rem" }}>
          <div
            className="card"
            style={{
              textAlign: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              {mockCreatedGroups.length}
            </div>
            <div>Groups Created</div>
          </div>
          <div
            className="card"
            style={{
              textAlign: "center",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              {mockJoinedGroups.length}
            </div>
            <div>Groups Joined</div>
          </div>
          <div
            className="card"
            style={{
              textAlign: "center",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              {mockCreatedGroups.reduce((sum, group) => sum + group.memberCount, 0)}
            </div>
            <div>Total Members</div>
          </div>
        </div>

        {/* Your Groups Section */}
        <div style={{ marginBottom: "3rem" }}>
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}
          >
            <h2 style={{ color: "#374151", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              🏗️ Your Groups ({mockCreatedGroups.length})
            </h2>
            <button className="btn btn-primary" onClick={() => alert("Create new group")}>
              ➕ Create New Group
            </button>
          </div>

          {mockCreatedGroups.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>📝</span>
              <h3>No groups created yet</h3>
              <p>Start building your community by creating your first group!</p>
              <button className="btn btn-primary" style={{ marginTop: "1rem" }}>
                ➕ Create Your First Group
              </button>
            </div>
          ) : (
            <div className="grid grid-2">
              {mockCreatedGroups.map((group) => (
                <GroupCard key={group._id} group={group} showEditButton={true} />
              ))}
            </div>
          )}
        </div>

        {/* Joined Groups Section */}
        <div style={{ marginBottom: "3rem" }}>
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}
          >
            <h2 style={{ color: "#374151", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              🤝 Joined Groups ({mockJoinedGroups.length})
            </h2>
            <button className="btn btn-outline" onClick={() => alert("Browse more groups")}>
              🔍 Browse More Groups
            </button>
          </div>

          {mockJoinedGroups.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>🔍</span>
              <h3>No groups joined yet</h3>
              <p>Explore groups that match your interests and start connecting!</p>
              <button className="btn btn-primary" style={{ marginTop: "1rem" }}>
                🔍 Browse Groups
              </button>
            </div>
          ) : (
            <div className="grid grid-2">
              {mockJoinedGroups.map((group) => (
                <GroupCard key={group._id} group={group} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }}>
          <h3 style={{ marginBottom: "1.5rem", color: "#374151" }}>⚡ Quick Actions</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => alert("Create group")}>
              ➕ Create Group
            </button>
            <button className="btn btn-outline" onClick={() => alert("Browse groups")}>
              🔍 Browse Groups
            </button>
            <button className="btn btn-secondary" onClick={() => alert("View notifications")}>
              🔔 View Notifications
            </button>
            <button className="btn btn-outline" onClick={() => alert("Account settings")}>
              ⚙️ Settings
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
