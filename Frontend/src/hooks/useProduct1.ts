// hooks/useProduct.ts
import { useCallback, useEffect, useMemo } from "react";
import { RootState } from "@/store";
import {
  fetchProductsByShopId,
  fetchProductsByCategoryId,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  fetchProductById,
  resetProductState,
  clearCurrentProduct,
} from "@/product/slice/productSlice";
import { Product } from "@/product/types/product";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useShop } from "@/hooks/useShop";

export const useProduct1 = () => {
  const dispatch = useAppDispatch();
  const { shop } = useShop(); // Get current shop
  const productState = useAppSelector((state: RootState) => state.product);

  // Memoized selectors for better performance
  const {
    products,
    product,
    productsByCategory,
    status,
    error,
    updateStatusLoading,
  } = productState;

  useEffect(() => {
    if (shop?.id) {
      dispatch(fetchProductsByShopId()); // Fetch for current shop
    } else {
      dispatch(resetProductState()); // Clear products if no shop
    }
  }, [shop?.id, dispatch]);

  /** ─── Actions (useCallback for stable references) ─── */

  const getProductsByCategoryId = useCallback(
    (categoryId: string) => dispatch(fetchProductsByCategoryId(categoryId)),
    [dispatch]
  );

  const addProduct = useCallback(
    (productData: Omit<Product, "id" | "shopId">) =>
      dispatch(createProduct(productData)),
    [dispatch]
  );

  const modifyProduct = useCallback(
    (id: string, productData: Partial<Product>) =>
      dispatch(updateProduct({ id, productData })),
    [dispatch]
  );

  const changeProductStatus = useCallback(
    async (id: string, active: boolean) => {
      try {
        await dispatch(updateProductStatus({ id, active })).unwrap();
      } catch (error) {
        console.error("Failed to update product status:", error);
        throw error; // Re-throw to handle in component
      }
    },
    [dispatch]
  );

  const removeProduct = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteProduct(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete product:", error);
        throw error;
      }
    },
    [dispatch]
  );

  const getProductById = useCallback(
    (id: string) => dispatch(fetchProductById(id)),
    [dispatch]
  );

  const resetState = useCallback(() => {
    dispatch(resetProductState());
  }, [dispatch]);

  const clearProduct = useCallback(
    () => dispatch(clearCurrentProduct()),
    [dispatch]
  );

  /** ─── Helpers (no need for useCallback) ─── */
  // Memoized helpers
  const getProductsByCategory = useCallback(
    (categoryId: string) => productsByCategory[categoryId] || [],
    [productsByCategory]
  );

  const isStatusUpdateLoading = useCallback(
    (id: string) => updateStatusLoading[id] || false,
    [updateStatusLoading]
  );

  // Memoized derived state
  const isLoading = useMemo(() => status === "loading", [status]);
  const hasError = useMemo(() => error !== null, [error]);
  const isEmpty = useMemo(() => products.length === 0, [products]);

  // Helper to parse variant data
  const parseVariantData = useCallback((variantData?: string) => {
    if (!variantData) return { variants: [] };
    try {
      return JSON.parse(variantData);
    } catch (error) {
      console.error("Error parsing variant data:", error);
      return { variants: [] };
    }
  }, []);

  // Helper to stringify variant data
  const stringifyVariantData = useCallback((variantData: any) => {
    try {
      return JSON.stringify(variantData);
    } catch (error) {
      console.error("Error stringifying variant data:", error);
      return '{"variants":[]}';
    }
  }, []);

  /** ─── Return API ─── */
  return {
    // State
    products,
    product,
    productsByCategory,
    status,
    error,
    updateStatusLoading,

    // Actions
    getProductsByCategoryId,
    addProduct,
    modifyProduct,
    changeProductStatus,
    removeProduct,
    getProductById,
    resetState,
    clearProduct,

    // Helpers
    getProductsByCategory,
    isStatusUpdateLoading,
    parseVariantData,
    stringifyVariantData,

    // Derived state
    isLoading,
    hasError,
    isEmpty,
  };
};

export type UseProductReturn = ReturnType<typeof useProduct1>;
