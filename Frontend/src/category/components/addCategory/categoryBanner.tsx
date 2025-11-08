"use client";

import { Camera, Loader2 } from "lucide-react";
import { Category } from "@/category/types/category";
import { useAppDispatch } from "@/hooks";
import { uploadImage } from "@/images/slice/imageSlice";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface CategoryBannerProps {
  data: Partial<Category>;
  onValueChange: (values: Partial<Category>) => void;
}

export function CategoryBanner({ data, onValueChange }: CategoryBannerProps) {
  const dispatch = useAppDispatch();

  const [isUploading, setIsUploading] = useState(false);

  // UPDATED: Instead of creating a URL using URL.createObjectURL,
  // we now dispatch the uploadImage thunk which returns the Cloudinary URL.
  // Optimized image upload with progress tracking
  const handleBannerUpload = useCallback(
    async (file: File) => {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      try {
        setIsUploading(true);

        const result = await dispatch(uploadImage({ file })).unwrap();

        onValueChange({ bannerUrl: result });
        toast.success("Banner uploaded successfully");
      } catch (error: any) {
        console.error("Banner upload failed:", error);
        toast.error(error.message || "Failed to upload banner image");
      } finally {
        setIsUploading(false);
      }
    },
    [dispatch, onValueChange]
  );

  // Handle file input with proper cleanup
  const handleFileSelect = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleBannerUpload(file);
      }
      // Clean up the input element
      input.remove();
    };

    input.click();
  }, [handleBannerUpload]);

  // Remove banner handler
  const handleRemoveBanner = useCallback(() => {
    onValueChange({ bannerUrl: undefined });
  }, [onValueChange]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Banner</h2>
        <p className="text-sm text-muted-foreground">
          Add a category banner at the top of product listing.
        </p>
      </div>

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
        {data.bannerUrl ? (
          <div className="relative aspect-[3/1] w-full group">
            <img
              src={data.bannerUrl}
              alt="Banner preview"
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveBanner();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Remove Banner
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <span className="text-sm font-medium text-blue-600">
                  Uploading banner...
                </span>
              </>
            ) : (
              <>
                <Camera className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">Upload banner image</span>
                <span className="text-sm text-muted-foreground">
                  Recommended size (1920x640px)
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {data.bannerUrl && (
        <div className="text-xs text-muted-foreground">
          <p>✓ Banner image uploaded successfully</p>
          <p>Click on the banner to replace it or use the remove button</p>
        </div>
      )}
    </div>
  );
}
