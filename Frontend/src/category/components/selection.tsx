"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ArrowUpNarrowWide, Trash2 } from "lucide-react";

interface CategorySelectionProps {
  selectedCount: number;
  onDelete: () => void;
  onSort: (field: string) => void;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
}

export function CategorySelection({
  selectedCount,
  onDelete,
  onSort,
  onDateRangeChange,
}: CategorySelectionProps) {
  // Helper function to get date range
  const getDateRange = (range: string) => {
    const today = new Date();
    const start = new Date();
    let end = new Date();

    switch (range) {
      case "today":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "yesterday":
        start.setDate(today.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(today.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      case "last7days":
        start.setDate(today.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        break;
      case "last30days":
        start.setDate(today.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        break;
      case "allTime":
        return onDateRangeChange(null, null);
      default:
        return;
    }
    onDateRangeChange(start, end);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
      {selectedCount > 0 && (
        <>
      <span className="text-sm font-medium">{selectedCount} Selected</span>
      <Button variant="outline" size="sm">
        Change status
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-600"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
      </>
    )}

    {/* Move this outside the conditional rendering so it's always visible */}
    <div className="ml-auto flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="font-bold">
              <ArrowUpDown className="h-4 w-4 " /> Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSort("name")}>
              CategoryName
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("productsCount")}>
              product
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("active")}>
              status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* this is for filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="font-bold">
              <ArrowUpNarrowWide className="h-4 w-4 mr-2" /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => getDateRange("today")}>
              Today
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => getDateRange("yesterday")}>
              Yesterday
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => getDateRange("last7days")}>
              Last 7 days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => getDateRange("last30days")}>
              Last 30 days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => getDateRange("allTime")}>
              All time
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
  
}
