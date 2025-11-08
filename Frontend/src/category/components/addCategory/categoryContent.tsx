"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Category } from "@/category/types/category"

interface CategoryContentProps {
  data: Partial<Category>
  onValueChange: (values: Partial<Category>) => void
}

export function CategoryContent({ data, onValueChange }: CategoryContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Content</h2>
        <p className="text-sm text-muted-foreground">
          Add category heading and description that will be shown on the category page.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Category Description</Label>
        <Textarea
          id="description"
          placeholder="Write your category description here..."
          className="min-h-[200px]"
          value={data.description || ""}
          onChange={(e) => onValueChange({ description: e.target.value })}
        />
      </div>
    </div>
  )
}

