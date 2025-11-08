"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductTable } from "../components/table";
import { ProductActions } from "../components/action";
import { ProductSelection } from "../components/selection";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchProductsByShopId,
  deleteProduct,
  updateProductStatus,
} from "../slice/productSlice";
import { RootState } from "@/store";

export default function ProductsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products, status, error } = useAppSelector(
    (state: RootState) => state.product
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string | null>(null); // NEW: State for sorting
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // NEW: State for sorting direction
  const [startDate, setStartDate] = useState<Date | null>(null); // NEW: Start date for filtering
  const [endDate, setEndDate] = useState<Date | null>(null); // NEW: End date for filtering
  // UPDATED: Extract shop from shopSlice to access the shopId
  const { shop } = useAppSelector((state: RootState) => state.shop);

  // NEW: Get categories from the category slice
  const { categories } = useAppSelector((state: RootState) => state.category);

  useEffect(() => {
    // UPDATED: Instead of using products[0]?.shopId, use the shop id from shopSlice
    if (shop?.id) {
      dispatch(fetchProductsByShopId());
    }
  }, [dispatch, shop?.id]);

  // Function to check if product is within selected date range
  const isWithinDateRange = (date: Date) => {
    if (!startDate || !endDate) return true; // If no range is set, return true
    return date >= startDate && date <= endDate;
  };

  // UPDATED: Added filtering by date range
  const filteredProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          isWithinDateRange(new Date(product.createdAt)) // Ensure createdAt is used for date filtering
      )
      .sort((a, b) => {
        if (!sortField) return 0; // No sorting applied if sortField is null
        const aValue = a[sortField as keyof typeof a];
        const bValue = b[sortField as keyof typeof b];

        // Normalize null/undefined so we don't compare undefined values directly
        const aVal = aValue == null ? "" : aValue;
        const bVal = bValue == null ? "" : bValue;

        // If both are numbers, compare numerically
        if (typeof aVal === "number" && typeof bVal === "number") {
          if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
          if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }

        // Fallback to string comparison (case-insensitive)
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        const cmp = aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
        return sortDirection === "asc" ? cmp : -cmp;
      });
  }, [products, searchQuery, startDate, endDate, sortField, sortDirection]);

  // NEW: Enrich products with the category name by matching product.categoryId with category.id
  const enrichedProducts = useMemo(() => {
    return filteredProducts.map((product) => {
      const matchedCategory = categories.find(
        (c) => c.id === product.categoryId
      );
      return {
        ...product,
        categoryName: matchedCategory ? matchedCategory.name : "N/A",
      };
    });
  }, [filteredProducts, categories]);

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length
        ? []
        : filteredProducts.map((p) => p.id)
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleDeleteProducts = async () => {
    try {
      await Promise.all(
        selectedProducts.map((id) => dispatch(deleteProduct(id)))
      );
      toast.success("Products deleted successfully");
      setSelectedProducts([]);
    } catch (error) {
      toast.error("Failed to delete products");
    }
  };

  // ADDED: Handler for deleting a single category.
  const handleDeleteProduct = async (id: string) => {
    try {
      await dispatch(deleteProduct(id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // ADDED: Handler for sorting the products
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // ADDED: Handler for date range filtering
  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleUpdateProductStatus = async (id: string, active: boolean) => {
    try {
      await dispatch(updateProductStatus({ id, active })).unwrap();
      toast.success(
        `Product ${active ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      toast.error("Failed to update product status");
    }
  };

  return (
    <div className="p-4 max-w-[1400px] mx-auto space-y-4">
      <ProductActions
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddProduct={() => navigate("/products/add")}
      />
      <ProductSelection
        selectedCount={selectedProducts.length}
        onDelete={handleDeleteProducts}
        onDateRangeChange={handleDateRangeChange}
        onSort={handleSort}
      />
      <ProductTable
        products={enrichedProducts}
        selectedProducts={selectedProducts}
        onSelectProduct={handleSelectProduct}
        onSelectAll={handleSelectAll}
        isLoading={status === "loading"}
        onDeleteProduct={handleDeleteProduct}
        onUpdateProductStatus={handleUpdateProductStatus}
      />
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
