"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

// Define categories directly to avoid import issues
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
] as const

interface GroupCreateFormProps {
  onSuccess?: (groupId: string) => void
  onError?: (error: string) => void
}

export default function GroupCreateForm({ onSuccess, onError }: GroupCreateFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    visibility: "public" as "public" | "private"
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Safely get auth context
  let user = null
  let token = null
  
  try {
    const authContext = useAuth()
    user = authContext?.user || null
    token = authContext?.token || null
  } catch (authError) {
    console.error("Auth context error:", authError)
  }
  
  const router = useRouter()

  useEffect(() => {
    try {
      setMounted(true)
    } catch (error) {
      console.error("Mount error:", error)
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      throw new Error("Group title is required")
    }
    if (!formData.description.trim()) {
      throw new Error("Group description is required")
    }
    if (!formData.category) {
      throw new Error("Please select a category")
    }
    if (!token) {
      throw new Error("You must be logged in to create a group")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      
      if (!mounted) {
        console.log("Form not mounted yet")
        return
      }
      
      setError("")
      setLoading(true)

      // Validate form
      validateForm()

      console.log("Submitting group creation:", formData)

      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          visibility: formData.visibility
        }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const group = await response.json()
      console.log("Group created successfully:", group)
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(group._id)
      } else {
        // Default behavior: navigate to the group
        try {
          router.push(`/groups/${group._id}`)
        } catch (navError) {
          console.error("Navigation error:", navError)
          // Fallback: reload the page to show success
          window.location.href = `/groups/${group._id}`
        }
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        visibility: "public"
      })

    } catch (err: any) {
      console.error("Form submission error:", err)
      const errorMessage = err.message || "An unexpected error occurred"
      setError(errorMessage)
      
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  // Safety checks with error handling
  if (!mounted) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>⏳</div>
        <div>Loading form...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
        <p>You must be logged in to create a group.</p>
        <button 
          onClick={() => {
            try {
              router.push("/login")
            } catch (error) {
              window.location.href = "/login"
            }
          }}
          className="btn btn-primary"
        >
          Go to Login
        </button>
      </div>
    )
  }

  // Additional safety check
  if (!CATEGORIES || CATEGORIES.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
        <p>Categories not loaded. Please refresh the page.</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  // Render form with error handling
  try {
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
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
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
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
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
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
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
                  checked={formData.visibility === "public"}
                  onChange={(e) => handleInputChange("visibility", e.target.value)}
                  disabled={loading}
                />
                Public (Anyone can join)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={formData.visibility === "private"}
                  onChange={(e) => handleInputChange("visibility", e.target.value)}
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
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
  } catch (renderError) {
    console.error("Form render error:", renderError)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
        <h3>Form Error</h3>
        <p>There was an error loading the form. Please refresh the page.</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Refresh Page
        </button>
      </div>
    )
  }
}