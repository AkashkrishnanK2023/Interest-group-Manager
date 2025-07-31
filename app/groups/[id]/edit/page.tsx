"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth, AuthProvider } from "@/contexts/AuthContext"
import Header from "@/components/Header"
import { CATEGORIES, type Group } from "@/types"

function EditGroupPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const [group, setGroup] = useState<Group | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private">("public")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchGroup()
  }, [user, params.id])

  const fetchGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.adminId !== user?.id) {
          router.push(`/groups/${params.id}`)
          return
        }
        setGroup(data)
        setTitle(data.title)
        setDescription(data.description)
        setCategory(data.category)
        setVisibility(data.visibility)
      }
    } catch (error) {
      console.error("Error fetching group:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)

    try {
      const response = await fetch(`/api/groups/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, category, visibility }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      router.push(`/groups/${params.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/groups/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error deleting group:", error)
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: "2rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="card">
            <h1 style={{ marginBottom: "2rem" }}>Edit Group</h1>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Group Title *</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
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
                  required
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
                >
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
                      onChange={(e) => setVisibility(e.target.value as "public" | "private")}
                    />
                    Public (Anyone can join)
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={visibility === "private"}
                      onChange={(e) => setVisibility(e.target.value as "public" | "private")}
                    />
                    Private (Admin approval required)
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
                    Cancel
                  </button>
                </div>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Delete Group
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <EditGroupPage />
    </AuthProvider>
  )
}
