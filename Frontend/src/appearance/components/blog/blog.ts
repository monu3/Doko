export interface Blog {
    id: string
    title: string
    content: string
    status: "draft" | "published"
    authorName: string
    featuredImage?: string
    slug: string
    createdAt: string
    updatedAt: string
  }
  
  