"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks";
import { uploadImage } from "@/images/slice/imageSlice";
import { Category } from "@/category/types/category";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface CategoryInformationProps {
  data: Partial<Category>;
  onValueChange: (values: Partial<Category>) => void;
}

export function CategoryInformation({
  data,
  onValueChange,
}: CategoryInformationProps) {
  const dispatch = useAppDispatch();

  const [isUploading, setIsUploading] = useState(false);

  // UPDATED: Instead of creating a URL using URL.createObjectURL,
  // we now dispatch the uploadImage thunk which returns the Cloudinary URL.
  // Optimized image upload handler
  const handleImageUpload = useCallback(
    async (file: File) => {
      // Validation
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      try {
        setIsUploading(true);
        const result = await dispatch(uploadImage({file})).unwrap();
        onValueChange({ categoryUrl: result });
        toast.success("Category image uploaded successfully");
      } catch (error: any) {
        console.error("Image upload failed:", error);
        toast.error(error.message || "Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    },
    [dispatch, onValueChange]
  );

  // File selection handler
  const handleFileSelect = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload(file);
      }
      input.remove();
    };

    input.click();
  }, [handleImageUpload]);

  // Remove image handler
  const handleRemoveImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange({ categoryUrl: undefined });
    },
    [onValueChange]
  );

  // Debounced name change handler
  const handleNameChange = useCallback(
    (value: string) => {
      onValueChange({ name: value });
    },
    [onValueChange]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Category Information</h2>
        <p className="text-sm text-muted-foreground">
          Add your category details and necessary information from here
        </p>
      </div>

      <div className="space-y-4">
        {/* Category Image Upload */}
        <div className="space-y-2">
          <Label>Category Image</Label>
          <div
            className={`
              border-2 border-dashed rounded-lg p-4 transition-colors
              ${
                isUploading
                  ? "border-blue-300 bg-blue-50 cursor-wait"
                  : "border-gray-300 hover:bg-muted/50 cursor-pointer"
              }
            `}
            onClick={isUploading ? undefined : handleFileSelect}
          >
            {data.categoryUrl ? (
              <div className="relative aspect-square w-40 mx-auto">
                <img
                  src={data.categoryUrl}
                  alt="Category preview"
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4">
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-blue-600">
                      Uploading...
                    </span>
                  </>
                ) : (
                  <>
                    <Camera className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Upload category image
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Category Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Category Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Enter category name"
            value={data.name || ""}
            onChange={(e) => handleNameChange(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>
    </div>
  );
}
