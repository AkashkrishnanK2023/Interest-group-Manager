// Utility function to ensure consistent date formatting
export function formatDate(dateString: string | Date): string {
  // Return a placeholder during SSR to avoid hydration mismatch
  if (typeof window === "undefined") {
    return "Loading..."
  }

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

    // Use a consistent format that works on both server and client
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    }

    // Force US locale to ensure consistency
    return date.toLocaleDateString("en-US", options)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}

export function formatDateTime(dateString: string | Date): string {
  // Return a placeholder during SSR to avoid hydration mismatch
  if (typeof window === "undefined") {
    return "Loading..."
  }

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }

    return date.toLocaleDateString("en-US", options)
  } catch (error) {
    console.error("Error formatting datetime:", error)
    return "Invalid date"
  }
}

export function formatRelativeTime(dateString: string | Date): string {
  // Return a placeholder during SSR to avoid hydration mismatch
  if (typeof window === "undefined") {
    return "Loading..."
  }

  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return "Today"
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`
    } else {
      return formatDate(dateString)
    }
  } catch (error) {
    console.error("Error formatting relative time:", error)
    return "Invalid date"
  }
}

export function getDaysActive(dateString: string | Date): number {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 0
    }
    return Math.ceil((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  } catch (error) {
    console.error("Error calculating days active:", error)
    return 0
  }
}
