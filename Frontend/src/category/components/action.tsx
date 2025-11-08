"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

interface CategoryActionsProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onAddCategory: () => void
}

export function CategoryActions({ searchQuery, onSearchChange, onAddCategory }: CategoryActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button className="sm:w-auto" onClick={onAddCategory}>
        <Plus className="h-4 w-4 mr-2" />
        Add new category
      </Button>
    </div>
  )
}

