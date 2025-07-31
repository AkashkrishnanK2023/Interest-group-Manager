"use client"

import type React from "react"

import { formatDate, formatDateTime, formatRelativeTime } from "@/utils/dateUtils"
import ClientOnly from "@/components/ClientOnly"

interface DateDisplayProps {
  date: string | Date
  format?: "date" | "datetime" | "relative"
  fallback?: string
  className?: string
  style?: React.CSSProperties
}

export default function DateDisplay({
  date,
  format = "date",
  fallback = "Loading...",
  className,
  style,
}: DateDisplayProps) {
  const formatFunction = {
    date: formatDate,
    datetime: formatDateTime,
    relative: formatRelativeTime,
  }[format]

  return (
    <ClientOnly
      fallback={
        <span className={className} style={style}>
          {fallback}
        </span>
      }
    >
      <span className={className} style={style}>
        {formatFunction(date)}
      </span>
    </ClientOnly>
  )
}
