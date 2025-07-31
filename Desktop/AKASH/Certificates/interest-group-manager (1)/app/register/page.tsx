"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useApp, AppProvider } from "@/contexts/AppContext"
import Header from "@/components/Header"

function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const { register, error, setError } = useApp()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const success = await register(name, email, password)
      if (success) {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: "2rem" }}>
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <div className="card">
            <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Sign Up</h1>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              Already have an account? <Link href="/login">Login</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <RegisterPage />
    </AppProvider>
  )
}
