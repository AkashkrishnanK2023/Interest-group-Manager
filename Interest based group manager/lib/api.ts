interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

class ApiService {
  private baseUrl = process.env.NODE_ENV === 'development' 
    ? "http://localhost:3000/api" 
    : "/api"

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const config: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      }

      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || "An error occurred" }
      }

      return { data }
    } catch (error) {
      console.error("API request failed:", error)
      return { error: "Network error occurred" }
    }
  }

  private getAuthHeaders(token?: string) {
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string, name: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    })
  }

  // Groups endpoints
  async getGroups(params?: {
    category?: string
    search?: string
    sort?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set("category", params.category)
    if (params?.search) searchParams.set("search", params.search)
    if (params?.sort) searchParams.set("sort", params.sort)

    const query = searchParams.toString()
    return this.request(`/groups${query ? `?${query}` : ""}`)
  }

  async getGroup(id: string, token?: string) {
    return this.request(`/groups/${id}`, {
      headers: this.getAuthHeaders(token),
    })
  }

  async createGroup(groupData: any, token: string) {
    return this.request("/groups", {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(groupData),
    })
  }

  async updateGroup(id: string, updates: any, token: string) {
    return this.request(`/groups/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(updates),
    })
  }

  async deleteGroup(id: string, token: string) {
    return this.request(`/groups/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(token),
    })
  }

  async joinGroup(id: string, token: string) {
    return this.request(`/groups/${id}/join`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
    })
  }

  async leaveGroup(id: string, token: string) {
    return this.request(`/groups/${id}/leave`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
    })
  }

  // User dashboard
  async getUserDashboard(token: string) {
    return this.request("/user/dashboard", {
      headers: this.getAuthHeaders(token),
    })
  }

  // Notifications
  async getNotifications(token: string) {
    return this.request("/notifications", {
      headers: this.getAuthHeaders(token),
    })
  }

  async markNotificationAsRead(id: string, token: string) {
    return this.request(`/notifications/${id}/read`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
    })
  }
}

export const apiService = new ApiService()
