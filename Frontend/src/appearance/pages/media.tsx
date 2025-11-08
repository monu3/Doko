"use client"

import { useState } from "react"
import { MediaTable } from "../components/media/mediaTable"
import { MediaActions } from "../components/media/mediaAction"
import { toast } from "sonner"

// Dummy data - replace with your API/Redux integration
const dummyMedia = [
  {
    id: "1",
    filename: "wallpaperflare.com_wallpaper-4.jpg",
    url: "https://example.com/wallpaperflare.com_wallpaper-4.jpg",
    thumbnailUrl: "/placeholder.svg",
    createdAt: "2025-01-21T22:49:00Z",
    updatedAt: "2025-01-21T22:49:00Z",
  },
]

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [media] = useState(dummyMedia)

  // Filter media based on search query and date filter
  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("URL copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy URL")
    }
  }

  const handleDelete = () => {
    // Add your delete logic here
    toast.success("Media deleted successfully")
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <MediaActions
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />
      <MediaTable media={filteredMedia} onCopyUrl={handleCopyUrl} onDelete={handleDelete} />
    </div>
  )
}

