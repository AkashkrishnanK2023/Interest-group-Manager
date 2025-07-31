"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import NotificationBell from "./NotificationBell"

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">
            🌟 Interest Groups
          </Link>

          <nav className="nav">
            {user ? (
              <>
                <Link href="/dashboard">📊 Dashboard</Link>
                <Link href="/groups">🔍 Browse Groups</Link>
                <Link href="/groups/create" className="btn btn-primary">
                  ➕ Create Group
                </Link>
                <NotificationBell />
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ color: "#6b7280" }}>Welcome, {user.name}</span>
                  <button onClick={logout} className="btn btn-secondary">
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/groups">🔍 Browse Groups</Link>
                <Link href="/login" className="btn btn-outline">
                  🔑 Login
                </Link>
                <Link href="/register" className="btn btn-primary">
                  🚀 Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
