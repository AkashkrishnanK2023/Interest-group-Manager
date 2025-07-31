"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AppProvider, useApp } from "@/contexts/AppContext"
import DateDisplay from "@/components/DateDisplay"
import GroupDetailView from "@/components/GroupDetailView"
import GroupCardComponent from "@/components/GroupCard"
import ErrorBoundary from "@/components/ErrorBoundary"

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
]

function NotificationBell() {
  const { notifications, markNotificationAsRead } = useApp()
  const [showDropdown, setShowDropdown] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".notification-bell") && !target.closest(".notification-dropdown")) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showDropdown])

  return (
    <div style={{ position: "relative" }}>
      <button
        className="notification-bell"
        onClick={(e) => {
          e.stopPropagation()
          setShowDropdown(!showDropdown)
        }}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <span style={{ fontSize: "1.5rem" }}>🔔</span>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Notifications</h3>
          </div>

          {notifications.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>📭</span>
              No notifications yet
            </div>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <div
                key={notification._id}
                onClick={() => {
                  markNotificationAsRead(notification._id)
                  setShowDropdown(false)
                }}
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #f3f4f6",
                  cursor: "pointer",
                  backgroundColor: notification.read ? "white" : "#f0f9ff",
                  transition: "background-color 0.2s",
                }}
              >
                <div style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>{notification.message}</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  {notification.groupTitle} • <DateDisplay date={notification.createdAt} format="date" />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function Dashboard({ onViewDetails }: { onViewDetails: (groupId: string) => void }) {
  const { user, dashboardData, error, loading, createGroup } = useApp()
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  if (!user) return null

  if (loading && !dashboardData) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
        <div>Loading your dashboard...</div>
      </div>
    )
  }

  const createdGroups = dashboardData?.createdGroups || []
  const joinedGroups = dashboardData?.joinedGroups || []

  return (
    <>
      {error && (
        <div className="alert alert-error" style={{ marginBottom: "2rem" }}>
          {error}
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#2563eb" }}>Welcome back, {user.name}! 👋</h1>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>Manage your groups and discover new communities</p>
      </div>

      <div className="grid grid-3" style={{ marginBottom: "3rem" }}>
        <div
          className="card"
          style={{
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{createdGroups.length}</div>
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
          <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{joinedGroups.length}</div>
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
            {createdGroups.reduce((sum, group) => sum + group.memberCount, 0)}
          </div>
          <div>Total Members</div>
        </div>
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h2 style={{ color: "#374151" }}>🏗️ Your Groups ({createdGroups.length})</h2>
          <button className="btn btn-primary" onClick={() => setShowCreateGroup(true)}>
            ➕ Create New Group
          </button>
        </div>

        {createdGroups.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>📝</span>
            <h3>No groups created yet</h3>
            <p>Start building your community by creating your first group!</p>
            <button className="btn btn-primary" onClick={() => setShowCreateGroup(true)}>
              ➕ Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid grid-2">
            {createdGroups.map((group) => (
              <GroupCardComponent key={group._id} group={group} onViewDetails={onViewDetails} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 style={{ color: "#374151", marginBottom: "1.5rem" }}>🤝 Joined Groups ({joinedGroups.length})</h2>
        {joinedGroups.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>🔍</span>
            <h3>No groups joined yet</h3>
            <p>Explore groups that match your interests and start connecting!</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {joinedGroups.map((group) => (
              <GroupCardComponent key={group._id} group={group} onViewDetails={onViewDetails} />
            ))}
          </div>
        )}
      </div>

      <CreateGroupModal isOpen={showCreateGroup} onClose={() => setShowCreateGroup(false)} />
    </>
  )
}

function CreateGroupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createGroup, loading, error } = useApp()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Technology")
  const [visibility, setVisibility] = useState<"public" | "private">("public")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const success = await createGroup({
      title,
      description,
      category,
      visibility,
    })

    if (success) {
      setTitle("")
      setDescription("")
      setCategory("Technology")
      setVisibility("public")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Group</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="group-title">Group Title *</label>
            <input
              id="group-title"
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter a catchy group title"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="group-description">Description *</label>
            <textarea
              id="group-description"
              className="form-control"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe what your group is about..."
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="group-category">Category *</label>
            <select
              id="group-category"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={loading}
            >
              {categories
                .filter((c) => c !== "All")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Visibility *</label>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={(e) => setVisibility(e.target.value as "public" | "private")}
                  disabled={loading}
                />
                🌍 Public (Anyone can join)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={(e) => setVisibility(e.target.value as "public" | "private")}
                  disabled={loading}
                />
                🔒 Private (Admin approval required)
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "✨ Create Group"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function BrowseGroups({ onViewDetails }: { onViewDetails: (groupId: string) => void }) {
  const { groups, error, loading, refreshGroups } = useApp()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    refreshGroups()
  }, [])

  const filteredGroups = groups
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

  if (loading && groups.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
        <div>Loading groups...</div>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="alert alert-error" style={{ marginBottom: "2rem" }}>
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h1 style={{ color: "#374151" }}>🔍 Browse Groups</h1>
        <button className="btn btn-outline" onClick={refreshGroups} disabled={loading}>
          {loading ? "🔄 Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

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

      <div style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
        Showing {filteredGroups.length} of {groups.length} groups
        {selectedCategory !== "All" && ` in ${selectedCategory}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {filteredGroups.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>🔍</span>
          <h3>No groups found</h3>
          <p>Try adjusting your search criteria or create a new group!</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredGroups.map((group) => (
            <GroupCardComponent key={group._id} group={group} onViewDetails={onViewDetails} />
          ))}
        </div>
      )}
    </>
  )
}

function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { login, loading, error } = useApp()
  const [email, setEmail] = useState("demo@example.com")
  const [password, setPassword] = useState("password")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(email, password)
    if (success) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Login to Your Account</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
          Demo credentials: demo@example.com / password
        </p>
      </div>
    </div>
  )
}

function RegisterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { register, loading, error } = useApp()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await register(name, email, password)
    if (success) {
      onClose()
      setName("")
      setEmail("")
      setPassword("")
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Your Account</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  )
}

function Header({ onNavigate }: { onNavigate: (view: string) => void }) {
  const { user, logout } = useApp()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo" onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
              🌟 Interest Groups
            </div>

            <nav className="nav">
              {user ? (
                <>
                  <button onClick={() => onNavigate("dashboard")}>📊 Dashboard</button>
                  <button onClick={() => onNavigate("groups")}>🔍 Browse Groups</button>
                  <ErrorBoundary>
                    <NotificationBell />
                  </ErrorBoundary>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ color: "#6b7280" }}>Welcome, {user.name}</span>
                    <button onClick={logout} className="btn btn-secondary btn-small">
                      🚪 Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => onNavigate("groups")}>🔍 Browse Groups</button>
                  <button className="btn btn-outline btn-small" onClick={() => setShowLogin(true)}>
                    🔑 Login
                  </button>
                  <button className="btn btn-primary btn-small" onClick={() => setShowRegister(true)}>
                    🚀 Sign Up
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <ErrorBoundary>
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
      </ErrorBoundary>
    </>
  )
}

function MainApp() {
  const { user, groups, error } = useApp()
  const [currentView, setCurrentView] = useState<"home" | "dashboard" | "groups" | "group-detail">("home")
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  const handleNavigate = (view: string) => {
    setCurrentView(view as any)
    setSelectedGroupId(null)
  }

  const handleViewGroupDetails = (groupId: string) => {
    setSelectedGroupId(groupId)
    setCurrentView("group-detail")
  }

  const handleBackFromGroupDetail = () => {
    setCurrentView("groups")
    setSelectedGroupId(null)
  }

  return (
    <>
      <ErrorBoundary>
        <Header onNavigate={handleNavigate} />
      </ErrorBoundary>

      <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <ErrorBoundary>
          {currentView === "home" && (
            <>
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#2563eb" }}>Interest Group Manager</h1>
                <p
                  style={{
                    fontSize: "1.25rem",
                    color: "#666",
                    marginBottom: "2rem",
                    maxWidth: "600px",
                    margin: "0 auto 2rem",
                  }}
                >
                  Create and join groups based on your interests. Connect with like-minded people and build communities
                  around what you love.
                </p>

                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn btn-primary" onClick={() => handleNavigate(user ? "dashboard" : "groups")}>
                    {user ? "🚀 Go to Dashboard" : "🚀 Get Started"}
                  </button>
                  <button className="btn btn-outline" onClick={() => handleNavigate("groups")}>
                    🔍 Browse Groups
                  </button>
                </div>
              </div>

              <div className="grid grid-3" style={{ marginBottom: "4rem" }}>
                <div className="card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563eb", marginBottom: "0.5rem" }}>
                    {groups.length}
                  </div>
                  <div style={{ color: "#6b7280" }}>Active Groups</div>
                </div>
                <div className="card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563eb", marginBottom: "0.5rem" }}>
                    {groups.reduce((sum, group) => sum + group.memberCount, 0)}
                  </div>
                  <div style={{ color: "#6b7280" }}>Total Members</div>
                </div>
                <div className="card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563eb", marginBottom: "0.5rem" }}>
                    {categories.length - 1}
                  </div>
                  <div style={{ color: "#6b7280" }}>Categories</div>
                </div>
              </div>

              <div>
                <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#374151" }}>🌟 Featured Groups</h2>
                <div className="grid grid-2">
                  {groups.slice(0, 4).map((group) => (
                    <GroupCardComponent key={group._id} group={group} onViewDetails={handleViewGroupDetails} />
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                  <button className="btn btn-outline" onClick={() => handleNavigate("groups")}>
                    🔍 View All Groups
                  </button>
                </div>
              </div>
            </>
          )}

          {currentView === "dashboard" && user && <Dashboard onViewDetails={handleViewGroupDetails} />}
          {currentView === "groups" && <BrowseGroups onViewDetails={handleViewGroupDetails} />}
          {currentView === "group-detail" && selectedGroupId && (
            <GroupDetailView groupId={selectedGroupId} onBack={handleBackFromGroupDetail} />
          )}

          {currentView === "dashboard" && !user && (
            <div className="empty-state">
              <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>🔑</span>
              <h3>Please login to view your dashboard</h3>
              <p>You need to be logged in to access your personal dashboard.</p>
              <button className="btn btn-primary" onClick={() => handleNavigate("home")}>
                🏠 Go Home
              </button>
            </div>
          )}
        </ErrorBoundary>
      </main>
    </>
  )
}

export default function HomePage() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ErrorBoundary>
  )
}
