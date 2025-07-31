"use client"

import React from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import Header from "@/components/Header"
import ErrorBoundary from "@/components/ErrorBoundary"
import ClientOnly from "@/components/ClientOnly"
import SimpleGroupForm from "@/components/SimpleGroupForm"

function CreateGroupPage() {
  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: "2rem" }}>
        <ClientOnly fallback={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '2rem' }}>⏳</div>
            <div>Loading group creation form...</div>
          </div>
        }>
          <SimpleGroupForm />
        </ClientOnly>
      </main>
    </>
  )
}

export default function Page() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CreateGroupPage />
      </AuthProvider>
    </ErrorBoundary>
  )
}
