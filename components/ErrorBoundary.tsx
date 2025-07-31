"use client"

import React from "react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="empty-state">
            <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>⚠️</span>
            <h3>Something went wrong</h3>
            <p>We're sorry, but something unexpected happened. Please refresh the page to try again.</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              🔄 Refresh Page
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
