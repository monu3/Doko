"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Share2, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Product } from "../types/product";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

// Extend the Product type to include an optional categoryName
export type EnrichedProduct = Product & { categoryName?: string };

interface ProductTableProps {
  products: EnrichedProduct[];
  selectedProducts: string[];
  onSelectProduct: (productId: string) => void;
  onSelectAll: () => void;
  isLoading: boolean;
  onDeleteProduct: (productId: string) => void;
  onUpdateProductStatus: (id: string, isActive: boolean) => void;
}

export function ProductTable({
  products,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onDeleteProduct,
  isLoading,
  onUpdateProductStatus,
}: ProductTableProps) {
  const navigate = useNavigate();

  const [updatingProducts, setUpdatingProducts] = useState<Set<string>>(
    new Set()
  ); // ADDED: Track updating products

  const handleStatusChange = async (productId: string, newStatus: boolean) => {
    // ADDED: Optimistically update UI immediately
    setUpdatingProducts((prev) => new Set(prev.add(productId)));

    try {
      await onUpdateProductStatus(productId, newStatus);
    } catch (error) {
      // Revert on error - the switch will revert due to the controlled value
    } finally {
      // Remove from updating set
      setUpdatingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border rounded-md p-4 text-center text-muted-foreground">
        No products found matching your search criteria.
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <table className="w-full">
        <thead className="bg-gray-300">
          <tr className="border-b">
            <th className="p-3 text-left">
              <Checkbox
                checked={selectedProducts.length === products.length}
                onCheckedChange={onSelectAll}
              />
            </th>
            <th className="p-4 text-left font-medium">Product</th>
            <th className="p-4 text-left font-medium">Price</th>
            <th className="p-4 text-left font-medium">Stock</th>
            <th className="p-4 text-left font-medium">Status</th>
            <th className="p-4 text-left font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            // ADDED: Use the first image from the array if available, else fallback.
            const mainImage =
              product.images && product.images.length > 0
                ? product.images[0]
                : product.imageUrl || "/placeholder.svg";
            const isUpdating = updatingProducts.has(product.id); // ADDED: Check if product is updating

            return (
              <tr key={product.id} className="border-b last:border-b-0">
                <td className="p-4">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => onSelectProduct(product.id)}
                    disabled={isUpdating} // ADDED: Disable during update
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded overflow-hidden">
                      {/* CHANGED: We now use mainImage */}
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-normal text-green-600">
                        {product.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {/* Display the category name if available */}
                        {product.categoryName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium">
                    NRP {product.price.toFixed(2)}
                  </div>
                  {product.discountPercentage && (
                    <div className="text-sm text-muted-foreground line-through">
                      NRP ${product.discountPrice.toFixed(2)}
                    </div>
                  )}
                </td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={product.active}
                      onCheckedChange={(checked) =>
                        handleStatusChange(product.id, checked)
                      }
                      disabled={isUpdating} // ADDED: Disable during update
                    />
                    <span
                      className={`text-sm ${
                        product.active ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {isUpdating
                        ? "Updating..."
                        : product.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" disabled={isUpdating}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/products/edit/${product.id}`)}
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled={isUpdating}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isUpdating}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/products/edit/${product.id}`)
                          }
                          disabled={isUpdating}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={isUpdating}>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onDeleteProduct(product.id)}
                          disabled={isUpdating}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
