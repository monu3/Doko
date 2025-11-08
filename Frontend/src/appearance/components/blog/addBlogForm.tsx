"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import type { Blog } from "./blog";
import { Card } from "@/components/ui/card";

export default function AddBlogPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: "",
    content: "",
    authorName: "",
  });

  const baseUrl = "https://meroPasal.io/blog/";
  const slug = formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "";

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, featuredImage: imageUrl }));
  };

  const handleSubmit = async (status: "draft" | "published") => {
    try {
      setIsSubmitting(true);

      if (!formData.title) {
        toast.error("Please enter a blog title");
        return;
      }

      if (!formData.content) {
        toast.error("Please enter blog content");
        return;
      }

      // Add your API call here
      console.log("Submitting blog with status:", status, formData);

      toast.success(
        `Blog ${
          status === "published" ? "published" : "saved as draft"
        } successfully`
      );
      navigate("/appearance/blog");
    } catch (error) {
      toast.error("Failed to save blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="font-semibold">Add new blog</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting}
            >
              Save as draft
            </Button>
            <Button
              onClick={() => handleSubmit("published")}
              disabled={isSubmitting}
            >
              Publish blog
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
          <div className="space-y-6">
            <div className="space-y-4">
              <Card className="p-4">
                <h2 className="text-lg font-medium mb-1">Blog Post</h2>
                <hr/>
                <div className="space-y-2 mt-3">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Add a title to your blog"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Blog link</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex p-2 bg-muted rounded-md text-sm text-muted-foreground">
                      {baseUrl}
                      {slug || "blog-url"}
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="space-y-2">
                  <Label htmlFor="content">
                    Content <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog content here..."
                    className="min-h-[400px]"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                  />
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-4">
              <div>
                <h2 className="text-lg font-medium mb-1">Blog information</h2>
                <hr/>
                <div className="space-y-4 mt-3">
                  <div className="space-y-2">
                    <Label>Featured Image</Label>
                    <div
                      className="border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) handleImageUpload(file);
                        };
                        input.click();
                      }}
                    >
                      {formData.featuredImage ? (
                        <div className="relative aspect-[2/1] w-full">
                          <img
                            src={formData.featuredImage || "/placeholder.svg"}
                            alt="Featured"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 py-4">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm font-medium">Add Image</span>
                          <span className="text-xs text-muted-foreground">
                            Recommended size (918px×483px)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author Name</Label>
                    <Input
                      id="author"
                      placeholder="Add author name"
                      value={formData.authorName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          authorName: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
