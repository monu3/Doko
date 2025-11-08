"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Clock } from "lucide-react"
import { UploadDialog } from "./addMediaForm"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MediaActionsProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  dateFilter: string
  onDateFilterChange: (value: string) => void
}

export function MediaActions({ searchQuery, onSearchChange, onDateFilterChange }: MediaActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search media..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Lifetime
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDateFilterChange("today")}>Today</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDateFilterChange("yesterday")}>Yesterday</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDateFilterChange("last7days")}>Last 7 days</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDateFilterChange("last30days")}>Last 30 days</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDateFilterChange("all")}>All time</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UploadDialog />
      </div>
    </div>
  )
}

