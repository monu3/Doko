"use client";

import { useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/product/types/product";
import { useAppSelector } from "@/hooks";
import { RootState } from "@/store";

interface ProductInformationProps {
  data: Partial<Product>;
  onValueChange: (values: Partial<Product>) => void;
}

export function ProductInformation({
  data,
  onValueChange,
}: ProductInformationProps) {
  const categories = useAppSelector(
    (state: RootState) => state.category.categories
  );

  // Memoized category options for better performance
  const categoryOptions = useMemo(() => {
    if (!categories || categories.length === 0) {
      return [
        <SelectItem key="no-category" disabled value="no-category">
          No categories available
        </SelectItem>,
      ];
    }

    return categories.map((category) => (
      <SelectItem key={category.id} value={category.id}>
        {category.name}
      </SelectItem>
    ));
  }, [categories]);

  // Optimized event handlers
  const handleNameChange = useCallback(
    (value: string) => {
      onValueChange({ name: value });
    },
    [onValueChange]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      onValueChange({ categoryId: value });
    },
    [onValueChange]
  );

  const handlePriceChange = useCallback(
    (value: string) => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        onValueChange({ price: numValue });
      } else if (value === "") {
        onValueChange({ price: undefined });
      }
    },
    [onValueChange]
  );

  const handleDiscountChange = useCallback(
    (value: string) => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        onValueChange({ discountPercentage: numValue });
      } else if (value === "") {
        onValueChange({ discountPercentage: undefined });
      }
    },
    [onValueChange]
  );

  const handleDescriptionChange = useCallback(
    (value: string) => {
      onValueChange({ description: value });
    },
    [onValueChange]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Product Information</h2>
        <p className="text-sm text-muted-foreground">
          Easily input essential details like name, price, and more to showcase
          your product.
        </p>
      </div>

      <div className="space-y-4">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Enter product name"
            value={data.name || ""}
            onChange={(e) => handleNameChange(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Product Category */}
        <div className="space-y-2 max-w-md">
          <Label htmlFor="category">
            Product Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.categoryId || ""}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>{categoryOptions}</SelectContent>
          </Select>
        </div>

        {/* Price and Discount */}
        <div className="grid gap-4 sm:grid-cols-2 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="price">
              Price (NPR) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={data.price || ""}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount-percentage">Discount Percentage</Label>
            <Input
              id="discount-percentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0.00"
              value={data.discountPercentage || ""}
              onChange={(e) => handleDiscountChange(e.target.value)}
            />
          </div>
        </div>

        {/* Discount Price (Calculated) */}
        {data.price &&
          data.discountPercentage &&
          data.discountPercentage > 0 && (
            <div className="max-w-md">
              <Label>Discounted Price</Label>
              <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                <span className="font-medium text-green-700">
                  NPR{" "}
                  {(
                    (data.price * (100 - data.discountPercentage)) /
                    100
                  ).toFixed(2)}
                </span>
                <span className="text-sm text-green-600 ml-2">
                  ({data.discountPercentage}% off)
                </span>
              </div>
            </div>
          )}

        {/* Product Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Product Description</Label>
          <Textarea
            id="description"
            placeholder="Write your product description here..."
            className="min-h-[120px] max-w-2xl"
            value={data.description || ""}
            onChange={(e) => handleDescriptionChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {data.description?.length || 0}/1000 characters
          </p>
        </div>
      </div>
    </div>
  );
}
