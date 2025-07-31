"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Simple categories array to avoid import issues
const CATEGORIES = [
  "Education",
  "Entertainment", 
  "Sports",
  "Technology",
  "Music",
  "Art",
  "Business",
  "Health",
  "Travel",
  "Food",
  "Other",
]

export default function SimpleGroupForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [visibility, setVisibility] = useState("public")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState("")

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Get user and token from localStorage
    try {
      const savedUser = localStorage.getItem("user")
      const savedToken = localStorage.getItem("token")
      
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser))
        setToken(savedToken)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!mounted) return
    
    setError("")
    setLoading(true)

    try {
      // Validate
      if (!title.trim()) {
        throw new Error("Group title is required")
      }
      if (!description.trim()) {
        throw new Error("Group description is required")
      }
      if (!category) {
        throw new Error("Please select a category")
      }
      if (!token) {
        throw new Error("You must be logged in to create a group")
      }

      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          visibility
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const group = await response.json()
      
      // Navigate to the new group
      window.location.href = `/groups/${group._id}`

    } catch (err) {
      console.error("Group creation error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3>Login Required</h3>
        <p>You must be logged in to create a group.</p>
        <button 
          onClick={() => window.location.href = "/login"}
          className="btn btn-primary"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="card">
        <h1 style={{ marginBottom: "2rem" }}>Create New Group</h1>

        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            border: '1px solid #fecaca', 
            color: '#dc2626', 
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '1rem' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Group Title *</label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter group title"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              className="form-control"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your group and its purpose"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Visibility *</label>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={(e) => setVisibility(e.target.value)}
                  disabled={loading}
                />
                Public (Anyone can join)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={(e) => setVisibility(e.target.value)}
                  disabled={loading}
                />
                Private (Admin approval required)
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => window.history.back()}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}