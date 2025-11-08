"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/product/types/product";

interface InventoryProps {
  data: Partial<Product>;
  onValueChange: (values: Partial<Product>) => void;
}

export function Inventory({ data, onValueChange }: InventoryProps) {
  const handleStockChange = useCallback(
    (value: string) => {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onValueChange({ stock: numValue });
      } else if (value === "") {
        onValueChange({ stock: undefined });
      }
    },
    [onValueChange]
  );

  const getStockStatus = () => {
    const stock = data.stock || 0;

    if (stock === 0)
      return {
        status: "out-of-stock",
        color: "text-red-600",
        message: "Out of stock",
      };
    if (stock <= 10)
      return {
        status: "low-stock",
        color: "text-orange-600",
        message: "Low stock",
      };
    return { status: "in-stock", color: "text-green-600", message: "In stock" };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Inventory Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage your stock levels seamlessly to keep up with customer demand.
        </p>
      </div>

      <div className="space-y-6 max-w-md">
        {/* Stock Quantity */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stock">
              Stock Quantity <span className="text-red-500">*</span>
            </Label>
            <Input
              id="stock"
              type="number"
              min="0"
              placeholder="Enter quantity"
              value={data.stock || ""}
              onChange={(e) => handleStockChange(e.target.value)}
            />
          </div>

          {/* Stock Status Indicator */}
          {data.stock !== undefined && (
            <div className="p-3 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Stock Status:</span>
                <span className={`text-sm font-semibold ${stockStatus.color}`}>
                  {stockStatus.message}
                </span>
              </div>
              {data.stock <= 10 && data.stock > 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  Consider restocking soon to avoid running out
                </p>
              )}
              {data.stock === 0 && (
                <p className="text-xs text-red-600 mt-1">
                  Product will be hidden from customers until stock is updated
                </p>
              )}
            </div>
          )}
        </div>

        {/* Inventory Tips */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Inventory Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Set stock to 0 to temporarily hide the product</li>
            <li>• Update stock regularly to avoid overselling</li>
            <li>• Consider setting up low stock alerts</li>
            <li>• Track best-selling products to optimize inventory</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
