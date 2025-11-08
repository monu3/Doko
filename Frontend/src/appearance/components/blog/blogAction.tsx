"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

interface BlogActionsProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onAddBlog: () => void
  activeTab: "all" | "published" | "draft"
  onTabChange: (tab: "all" | "published" | "draft") => void
  counts: {
    all: number
    published: number
    draft: number
  }
}

export function BlogActions({
  searchQuery,
  onSearchChange,
  onAddBlog,
  activeTab,
  onTabChange,
  counts,
}: BlogActionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={activeTab === "all" ? "secondary" : "ghost"}
          className="relative"
          onClick={() => onTabChange("all")}
        >
          All
          <span className="ml-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm">
            {counts.all}
          </span>
        </Button>
        <Button
          variant={activeTab === "published" ? "secondary" : "ghost"}
          className="relative"
          onClick={() => onTabChange("published")}
        >
          Published
          <span className="ml-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm">
            {counts.published}
          </span>
        </Button>
        <Button
          variant={activeTab === "draft" ? "secondary" : "ghost"}
          className="relative"
          onClick={() => onTabChange("draft")}
        >
          Draft
          <span className="ml-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm">
            {counts.draft}
          </span>
        </Button>
      </div>

      <div className="flex justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blog..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={onAddBlog}>
          <Plus className="h-4 w-4 mr-2" />
          Add new blog
        </Button>
      </div>
    </div>
  )
}

