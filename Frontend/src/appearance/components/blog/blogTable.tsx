"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"
import type { Blog } from "./blog"
import { Card } from "@/components/ui/card"

interface BlogTableProps {
  blogs: Blog[]
  onView: (slug: string) => void
  onDelete: (id: string) => void
}

export function BlogTable({ blogs, onView, onDelete }: BlogTableProps) {
  if (blogs.length === 0) {
    return <div className="text-center text-muted-foreground py-10">No blogs found.</div>
  }

  return (
      <div className="rounded-2xl border p-1">
        <Card className="p-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60%]">Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-md overflow-hidden">
                    <img
                      src={blog.featuredImage || "/placeholder.svg"}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-blue-600">{blog.title}</div>
                    <div className="text-sm text-muted-foreground">{blog.authorName}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{format(new Date(blog.updatedAt), "dd MMM yyyy, h:mm a")}</TableCell>
              <TableCell>
                <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => onView(blog.slug)}>
                  View
                </Button>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(blog.slug)}>View</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(blog.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Card>
    </div>
  )
}

