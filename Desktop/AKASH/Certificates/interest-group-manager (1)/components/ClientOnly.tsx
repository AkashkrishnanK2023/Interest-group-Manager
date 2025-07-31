"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ClientOnly({ children, fallback = <span>Loading...</span> }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering children on server
  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
