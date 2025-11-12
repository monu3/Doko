"use client";

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryTable } from "../components/table";
import { CategoryActions } from "../components/action";
import { CategorySelection } from "../components/selection";
import { toast } from "react-toastify";
import { useCategory } from "@/hooks/useCategory";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { categories, status, error, removeCategory, changeCategoryStatus } =
    useCategory();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string | null>(null); // NEW: State for sorting
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // NEW: State for sorting direction
  const [startDate, setStartDate] = useState<Date | null>(null); // NEW: Start date for filtering
  const [endDate, setEndDate] = useState<Date | null>(null); // NEW: End date for filtering

  // Function to check if category is within selected date range
  const isWithinDateRange = (date: Date) => {
    if (!startDate || !endDate) return true; // If no range is set, return true
    return date >= startDate && date <= endDate;
  };

  // UPDATED: Added filtering by date range
  const filteredCategories = useMemo(() => {
    return categories
      .filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          isWithinDateRange(new Date(category.createdAt)) // Ensure createdAt is used for date filtering
      )
      .sort((a, b) => {
        if (!sortField) return 0; // No sorting applied if sortField is null
        const aValue = a[sortField as keyof typeof a];
        const bValue = b[sortField as keyof typeof b];
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [categories, searchQuery, startDate, endDate, sortField, sortDirection]);

  // Memoized event handlers
  const handleSelectCategory = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedCategories((prev) =>
      prev.length === filteredCategories.length
        ? []
        : filteredCategories.map((c) => c.id)
    );
  }, [filteredCategories]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleDeleteCategories = useCallback(async () => {
    try {
      // Use Promise.allSettled to handle partial successes
      const results = await Promise.allSettled(
        selectedCategories.map((id) => removeCategory(id))
      );

      const successfulDeletes = results.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failedDeletes = results.filter(
        (r) => r.status === "rejected"
      ).length;

      if (successfulDeletes > 0) {
        toast.success(`Successfully deleted ${successfulDeletes} categories`, {
          autoClose: 2000,
        });
      }
      if (failedDeletes > 0) {
        toast.error(`Failed to delete ${failedDeletes} categories`, {
          autoClose: 2000,
        });
      }

      setSelectedCategories([]);
    } catch (error) {
      toast.error("Failed to delete categories", { autoClose: 2000 });
    }
  }, [selectedCategories, removeCategory]);

  const handleDeleteCategory = useCallback(
    async (id: string) => {
      try {
        await removeCategory(id);
        toast.success("Category deleted successfully", { autoClose: 2000 });
      } catch (error) {
        toast.error("Failed to delete category", { autoClose: 2000 });
      }
    },
    [removeCategory]
  );

  const handleSort = useCallback((field: string) => {
    setSortField((current) => {
      if (current === field) {
        setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"));
        return field;
      }
      setSortDirection("asc");
      return field;
    });
  }, []);

  const handleDateRangeChange = useCallback(
    (start: Date | null, end: Date | null) => {
      setStartDate(start);
      setEndDate(end);
    },
    []
  );

  const handleUpdateCategoryStatus = useCallback(
    async (id: string, active: boolean) => {
      try {
        await changeCategoryStatus(id, active);
        // Toast is handled in the changeCategoryStatus function
      } catch (error) {
        // Error is handled in the changeCategoryStatus function
      }
    },
    [changeCategoryStatus]
  );

  return (
    <div className="p-4 max-w-[1400px] mx-auto space-y-4">
      <CategoryActions
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddCategory={() => navigate("/products/categories/add")}
      />
      <CategorySelection
        selectedCount={selectedCategories.length}
        onDelete={handleDeleteCategories}
        onDateRangeChange={handleDateRangeChange}
        onSort={handleSort}
      />
      <CategoryTable
        categories={filteredCategories}
        selectedCategories={selectedCategories}
        onSelectCategory={handleSelectCategory}
        onSelectAll={handleSelectAll}
        isLoading={status === "loading"}
        // Pass the single category deletion handler as a prop
        onDeleteCategory={handleDeleteCategory}
        onUpdateCategoryStatus={handleUpdateCategoryStatus}
      />
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
