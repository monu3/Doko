"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { RichTextEditor } from "@mantine/rte";

interface PageFormData {
  title: string;
  slug: string;
  content: string;
}

export default function AddPagePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PageFormData>({
    title: "",
    slug: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseUrl = "https://meroPasal.io/";

  const handleTitleChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: slug,
    }));
  };

  const handleSubmit = async (status: "draft" | "published") => {
    try {
      setIsSubmitting(true);

      if (!formData.title) {
        toast.error("Please enter a page title");
        return;
      }

      // Add your API call here
      console.log("Submitting page with status:", status, formData);

      toast.success(
        `Page ${
          status === "published" ? "published" : "saved as draft"
        } successfully`
      );
      navigate("/pages");
    } catch (error) {
      toast.error("Failed to save page");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background ">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="font-semibold">Add new page</h1>
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
              Publish page
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="space-y-6">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Page Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter page title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Page link</Label>
                <div className="flex items-center gap-2">
                  <div className="flex p-2 bg-muted rounded-md text-sm text-muted-foreground">
                    {baseUrl}
                    {formData.slug || "page-url"}
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-2">
              <Label htmlFor="content">Page content</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
                className="min-h-[300px]"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
