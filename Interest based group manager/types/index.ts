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
}

export interface Membership {
  _id: string
  userId: string
  userName: string
  groupId: string
  status: "approved" | "pending"
  joinedAt: Date
}

export interface GroupWithMembers extends Group {
  members: Membership[]
  isAdmin: boolean
  isMember: boolean
  membershipStatus?: "approved" | "pending"
}

export const CATEGORIES = [
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

export type Category = (typeof CATEGORIES)[number]
