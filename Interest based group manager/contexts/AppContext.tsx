"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiService } from "@/lib/api"

export interface User {
  _id: string
  email: string
  name: string
  createdAt: Date
}

export interface Group {
  _id: string
  title: string
  description: string
  category: string
  visibility: "public" | "private"
  adminId: string
  adminName: string
  memberCount: number
  createdAt: Date
  // Optional properties that may be present depending on the API endpoint
  members?: any[]
  pendingMembers?: string[]
  isMember?: boolean
  isAdmin?: boolean
  membershipStatus?: "approved" | "pending"
}

export interface GroupWithMembers extends Group {
  members: any[]
  isAdmin: boolean
  isMember: boolean
  membershipStatus?: "approved" | "pending"
}

export interface Notification {
  _id: string
  type: "join_request" | "join_approved" | "member_joined" | "group_update"
  message: string
  groupId: string
  groupTitle: string
  createdAt: string
  read: boolean
}

interface AppContextType {
  // User state
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void

  // Groups state
  groups: Group[]
  createGroup: (
    groupData: Omit<Group, "_id" | "adminId" | "adminName" | "memberCount" | "createdAt">,
  ) => Promise<boolean>
  updateGroup: (groupId: string, updates: Partial<Group>) => Promise<boolean>
  deleteGroup: (groupId: string) => Promise<boolean>
  joinGroup: (groupId: string) => Promise<boolean>
  leaveGroup: (groupId: string) => Promise<boolean>
  refreshGroups: () => Promise<void>
  getGroupById: (groupId: string) => Promise<GroupWithMembers | null>

  // Dashboard data
  dashboardData: {
    createdGroups: Group[]
    joinedGroups: Group[]
  } | null
  refreshDashboard: () => Promise<void>

  // Notifications
  notifications: Notification[]
  markNotificationAsRead: (notificationId: string) => Promise<void>
  refreshNotifications: () => Promise<void>

  // Loading states
  loading: boolean
  error: string | null
  setError: (error: string | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [dashboardData, setDashboardData] = useState<{
    createdGroups: Group[]
    joinedGroups: Group[]
  } | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load user and token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedToken = localStorage.getItem("token")
        const savedUser = localStorage.getItem("user")

        if (savedToken && savedUser) {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Error loading saved user:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
  }, [])

  // Load initial data when user is authenticated
  useEffect(() => {
    if (user && token) {
      refreshGroups()
      refreshNotifications()
      refreshDashboard()
    }
  }, [user, token])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiService.login(email, password)

      if (response.error) {
        setError(response.error)
        return false
      }

      if (response.data) {
        setUser(response.data.user)
        setToken(response.data.token)
        if (typeof window !== 'undefined') {
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("user", JSON.stringify(response.data.user))
        }
        return true
      }

      return false
    } catch (err) {
      setError("Login failed. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiService.register(email, password, name)

      if (response.error) {
        setError(response.error)
        return false
      }

      if (response.data) {
        setUser(response.data.user)
        setToken(response.data.token)
        if (typeof window !== 'undefined') {
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("user", JSON.stringify(response.data.user))
        }
        return true
      }

      return false
    } catch (err) {
      setError("Registration failed. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setGroups([])
    setDashboardData(null)
    setNotifications([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }

  const refreshGroups = async () => {
    try {
      const response = await apiService.getGroups()
      if (response.data) {
        setGroups(response.data)
      }
    } catch (err) {
      console.error("Failed to refresh groups:", err)
    }
  }

  const createGroup = async (
    groupData: Omit<Group, "_id" | "adminId" | "adminName" | "memberCount" | "createdAt">,
  ): Promise<boolean> => {
    if (!token) return false

    setLoading(true)
    setError(null)

    try {
      const response = await apiService.createGroup(groupData, token)

      if (response.error) {
        setError(response.error)
        return false
      }

      await refreshGroups()
      await refreshDashboard()
      return true
    } catch (err) {
      setError("Failed to create group. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateGroup = async (groupId: string, updates: Partial<Group>): Promise<boolean> => {
    if (!token) return false

    try {
      const response = await apiService.updateGroup(groupId, updates, token)

      if (response.error) {
        setError(response.error)
        return false
      }

      await refreshGroups()
      await refreshDashboard()
      return true
    } catch (err) {
      setError("Failed to update group. Please try again.")
      return false
    }
  }

  const deleteGroup = async (groupId: string): Promise<boolean> => {
    if (!token) return false

    try {
      const response = await apiService.deleteGroup(groupId, token)

      if (response.error) {
        setError(response.error)
        return false
      }

      await refreshGroups()
      await refreshDashboard()
      return true
    } catch (err) {
      setError("Failed to delete group. Please try again.")
      return false
    }
  }

  const joinGroup = async (groupId: string): Promise<boolean> => {
    if (!token) return false

    try {
      const response = await apiService.joinGroup(groupId, token)

      if (response.error) {
        setError(response.error)
        return false
      }

      await refreshGroups()
      await refreshDashboard()
      await refreshNotifications()
      return true
    } catch (err) {
      setError("Failed to join group. Please try again.")
      return false
    }
  }

  const leaveGroup = async (groupId: string): Promise<boolean> => {
    if (!token) return false

    try {
      const response = await apiService.leaveGroup(groupId, token)

      if (response.error) {
        setError(response.error)
        return false
      }

      await refreshGroups()
      await refreshDashboard()
      return true
    } catch (err) {
      setError("Failed to leave group. Please try again.")
      return false
    }
  }

  const getGroupById = async (groupId: string): Promise<GroupWithMembers | null> => {
    try {
      const response = await apiService.getGroup(groupId, token || undefined)

      if (response.error) {
        setError(response.error)
        return null
      }

      return response.data || null
    } catch (err) {
      setError("Failed to fetch group details.")
      return null
    }
  }

  const refreshDashboard = async () => {
    if (!token) return

    try {
      const response = await apiService.getUserDashboard(token)
      if (response.data) {
        setDashboardData(response.data)
      }
    } catch (err) {
      console.error("Failed to refresh dashboard:", err)
    }
  }

  const refreshNotifications = async () => {
    if (!token) return

    try {
      const response = await apiService.getNotifications(token)
      if (response.data) {
        setNotifications(response.data)
      }
    } catch (err) {
      console.error("Failed to refresh notifications:", err)
    }
  }

  const markNotificationAsRead = async (notificationId: string) => {
    if (!token) return

    try {
      const response = await apiService.markNotificationAsRead(notificationId, token)

      if (!response.error) {
        setNotifications((prev) =>
          prev.map((notif) => (notif._id === notificationId ? { ...notif, read: true } : notif)),
        )
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        groups,
        createGroup,
        updateGroup,
        deleteGroup,
        joinGroup,
        leaveGroup,
        refreshGroups,
        getGroupById,
        dashboardData,
        refreshDashboard,
        notifications,
        markNotificationAsRead,
        refreshNotifications,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    // During build time or if not wrapped in provider, return a safe default
    if (typeof window === 'undefined') {
      // Server-side rendering - return safe defaults
      return {
        user: null,
        token: null,
        login: async () => false,
        register: async () => false,
        logout: () => {},
        groups: [],
        createGroup: async () => false,
        updateGroup: async () => false,
        deleteGroup: async () => false,
        joinGroup: async () => false,
        leaveGroup: async () => false,
        refreshGroups: async () => {},
        getGroupById: async () => null,
        dashboardData: null,
        refreshDashboard: async () => {},
        notifications: [],
        markNotificationAsRead: async () => {},
        refreshNotifications: async () => {},
        loading: false,
        error: null,
        setError: () => {},
      } as AppContextType
    }
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
