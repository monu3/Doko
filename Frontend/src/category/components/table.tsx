"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Category } from "@/category/types/category";

interface CategoryTableProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectCategory: (categoryId: string) => void;
  onSelectAll: () => void;
  isLoading: boolean;
  // ADDED: New prop for handling single category deletion.
  onDeleteCategory: (categoryId: string) => void;
  onUpdateCategoryStatus: (id: string, active: boolean) => void;
}

export function CategoryTable({
  categories,
  selectedCategories,
  onSelectCategory,
  onSelectAll,
  isLoading,
  onDeleteCategory, // Destructure the new prop
  onUpdateCategoryStatus,
}: CategoryTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="border rounded-md p-4 text-center text-muted-foreground">
        No categories found matching your search criteria.
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">
              <Checkbox
                checked={selectedCategories.length === categories.length}
                onCheckedChange={onSelectAll}
              />
            </th>
            <th className="p-4 text-left font-medium">Category</th>
            <th className="p-4 text-left font-medium">Products</th>
            <th className="p-4 text-left font-medium">Status</th>
            <th className="p-4 text-left font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b last:border-b-0">
              <td className="p-4">
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => onSelectCategory(category.id)}
                />
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded overflow-hidden">
                    <img
                      src={category.categoryUrl || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{category.name}</div>
                    
                  </div>
                </div>
              </td>
              {/* Use the productsCount prop to display the count */}
              <td className="p-4">{category.productCount ?? 0}</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={category.active}
                    onCheckedChange={(checked) =>
                      onUpdateCategoryStatus(category.id, checked)
                    }
                  />
                  <span
                    className={`text-sm ${
                      category.active ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {category.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigate(`/products/categories/edit/${category.id}`)
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/products/categories/edit/${category.id}`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDeleteCategory(category.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
