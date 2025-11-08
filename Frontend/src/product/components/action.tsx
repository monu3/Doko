"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface ProductActionsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddProduct: () => void
}

export function ProductActions({
  searchQuery,
  onSearchChange,
  onAddProduct
}: ProductActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products by name....."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button className="sm:w-auto" onClick={onAddProduct}>
        <Plus className="h-4 w-4 mr-2" />
        Add new product
      </Button>
    </div>
  );
}
