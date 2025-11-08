// src/product/components/addProduct/productMedia.tsx
"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, Image as ImageIcon, Loader } from "lucide-react";
import { Product } from "@/product/types/product";
import { useAppDispatch } from "@/hooks";
import { uploadMultipleImages } from "@/images/slice/imageSlice";
import { toast } from "react-toastify";

interface ProductMediaProps {
  data: Partial<Product>;
  onValueChange: (data: Partial<Product>) => void;
}

export function ProductMedia({ data, onValueChange }: ProductMediaProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Convert FileList to Array
      const filesArray = Array.from(files);

      // Upload images to Cloudinary
      const result = await dispatch(
        uploadMultipleImages({
          files: filesArray,
          options: {
            folder: "products", // You can make this dynamic based on shop or product
          },
        })
      ).unwrap();

      // Update images array with actual Cloudinary URLs
      const currentImages = data.images || [];
      const newImages = [...currentImages, ...result];

      onValueChange({
        ...data,
        images: newImages,
        imageUrl: data.imageUrl || newImages[0], // Set primary image if not set
      });

      toast.success(`Successfully uploaded ${result.length} image(s)`);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast.error("Failed to upload images: " + error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = async (imageUrl: string) => {
    // Optional: Add Cloudinary delete functionality here
    // You might want to delete from Cloudinary when removing from UI
    // await dispatch(deleteImage({ imageUrl }));

    const currentImages = data.images || [];
    const newImages = currentImages.filter((img) => img !== imageUrl);

    onValueChange({
      ...data,
      images: newImages,
      imageUrl: data.imageUrl === imageUrl ? newImages[0] || "" : data.imageUrl,
    });

    toast.success("Image removed successfully");
  };

  const setPrimaryImage = (imageUrl: string) => {
    onValueChange({
      ...data,
      imageUrl,
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Create a fake change event to reuse the upload logic
      const event = {
        target: {
          files: files,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleImageUpload(event);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Media</CardTitle>
        <CardDescription>
          Upload product images to Cloudinary. The first image will be used as
          the primary image.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload Area */}
        <div className="space-y-4">
          <Label htmlFor="product-images">Product Images</Label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="product-images"
            />
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB each
            </p>
            {uploading && (
              <div className="mt-4">
                <div className="flex items-center justify-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">
                    Uploading... {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        {data.images && data.images.length > 0 && (
          <div className="space-y-4">
            <Label>Uploaded Images ({data.images.length})</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback for broken images
                        e.currentTarget.src =
                          "https://via.placeholder.com/150?text=Image+Error";
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimaryImage(imageUrl);
                      }}
                      className={
                        data.imageUrl === imageUrl
                          ? "bg-blue-500 text-white"
                          : ""
                      }
                    >
                      {data.imageUrl === imageUrl ? "Primary" : "Set Primary"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(imageUrl);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {data.imageUrl === imageUrl && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Primary Image Display */}
        {data.imageUrl && (
          <div className="space-y-2">
            <Label>Primary Image Preview</Label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={data.imageUrl}
                  alt="Primary product image"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/150?text=Image+Error";
                  }}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>This image will be displayed as the main product image.</p>
                <p className="text-xs text-gray-500 mt-1">
                  URL: {data.imageUrl.substring(0, 50)}...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cloudinary Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <ImageIcon className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Images are stored in Cloudinary</p>
              <p className="text-xs mt-1">
                All uploaded images are securely stored in Cloudinary cloud
                storage. You can manage them from your Cloudinary dashboard.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
