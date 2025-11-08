"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BlogTable } from "../components/blog/blogTable"
import { BlogActions } from "../components/blog/blogAction"
import { toast } from "sonner"

// Dummy data - replace with your API/Redux integration
const dummyBlogs = [
  {
    id: "1",
    title: "Laptop",
    content: "Blog content here",
    status: "published" as "published" | "draft",
    authorName: "monu",
    slug: "v-monu",
    createdAt: "2025-01-21T22:48:00Z",
    updatedAt: "2025-01-21T22:48:00Z",
  },
  {
    id: "2",
    title: "maptop",
    content: "Blog content here",
    status: "published" as "published" | "draft",
    authorName: "monu",
    slug: "v-monu",
    createdAt: "2025-01-21T22:48:00Z",
    updatedAt: "2025-01-21T22:48:00Z",
  },
]

export default function BlogsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [blogs] = useState(dummyBlogs)

  // Filter blogs based on active tab and search query
  const filteredBlogs = blogs.filter((blog) => {
    const matchesTab = activeTab === "all" || blog.status === activeTab
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Calculate counts
  const counts = {
    all: blogs.length,
    published: blogs.filter((blog) => blog.status === "published").length,
    draft: blogs.filter((blog) => blog.status === "draft").length,
  }

  const handleView = (slug: string) => {
    window.open(`/blog/${slug}`, "_blank")
  }

  const handleDelete = () => {
    // Add your delete logic here
    toast.success("Blog deleted successfully")
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <BlogActions
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddBlog={() => navigate("/blogs/add")}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />
      <BlogTable blogs={filteredBlogs} onView={handleView} onDelete={handleDelete} />
    </div>
  )
}

