"use client"

import { useState } from "react"
import { PageActions } from "@/appearance/components/page/pageAction"
import { PageTable } from "@/appearance/components/page/pageTable"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import type { Page } from "@/appearance/components/page/types/page"

// Dummy data
const dummyPages: Page[] = [
  {
    id: "1",
    title: "Homepage",
    status: "published",
    createdAt: "2025-01-21T22:45:00Z",
    updatedAt: "2025-01-21T22:45:00Z",
    slug: "home",
  },
  {
    id: "2",
    title: "About Us",
    status: "published",
    createdAt: "2025-01-20T10:30:00Z",
    updatedAt: "2025-01-21T15:20:00Z",
    slug: "about",
  },
  {
    id: "3",
    title: "New Features (Draft)",
    status: "draft",
    createdAt: "2025-01-19T08:15:00Z",
    updatedAt: "2025-01-19T08:15:00Z",
    slug: "new-features",
  },
]

export default function PagesPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [pages, setPages] = useState<Page[]>(dummyPages)

  // Filter pages based on active tab and search query
  const filteredPages = pages.filter((page) => {
    const matchesTab = activeTab === "all" || page.status === activeTab
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Calculate counts
  const counts = {
    all: pages.length,
    published: pages.filter((page) => page.status === "published").length,
    draft: pages.filter((page) => page.status === "draft").length,
  }

  const handleEdit = (id: string) => {
    navigate(`/pages/edit/${id}`)
  }

  const handleDelete = (id: string) => {
    setPages((prev) => prev.filter((page) => page.id !== id))
    toast.success("Page deleted successfully")
  }

  const handleStatusChange = (id: string, newStatus: "published" | "draft") => {
    setPages((prev) => prev.map((page) => (page.id === id ? { ...page, status: newStatus } : page)))
    toast.success(`Page ${newStatus === "published" ? "published" : "moved to draft"}`)
  }

  const handleView = (slug: string) => {
    window.open(`/preview/${slug}`, "_blank")
  }

  return (
    <div className="p-6 space-y-6">
      <PageActions
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddPage={() => navigate("/pages/add")}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />
      <PageTable
        pages={filteredPages}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onView={handleView}
      />
    </div>
  )
}

