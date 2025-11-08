import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchCategoriesByShopId,
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  updateCategoryStatusOptimistic,
  deleteCategory,
  resetCategoryState,
} from "@/category/slice/categorySlice";
import { RootState } from "@/store";
import { useEffect, useCallback, useMemo } from "react";
import { useShop } from "@/hooks/useShop";
import { Category } from "@/category/types/category";

export const useCategory = () => {
  const dispatch = useAppDispatch();
  const { shop } = useShop(); // Get current shop

  // Selectors with memoization
  const categoryState = useAppSelector((state: RootState) => state.category);
  const {
    categories,
    selectedCategory,
    status,
    error,
    updateStatusLoading,
    lastFetched,
  } = categoryState;

  // Memoized selectors for better performance
  const memoizedCategories = useMemo(() => categories, [categories]);
  const memoizedSelectedCategory = useMemo(
    () => selectedCategory,
    [selectedCategory]
  );

  /**
   * Auto-fetch categories whenever shop.id changes
   */
  useEffect(() => {
    if (shop?.id) {
      // Only fetch if data is stale (older than 30 seconds) or doesn't exist
      const isStale = !lastFetched || Date.now() - lastFetched > 30000;

      if (isStale && status !== "loading") {
        console.log("Fetching categories for shop:", shop.id);
        dispatch(fetchCategoriesByShopId());
      }
    } else {
      // Clear categories if no shop is selected
      if (categories.length > 0) {
        dispatch(resetCategoryState());
      }
    }
  }, [shop?.id, dispatch, lastFetched, status, categories.length]);

  const loadCategories = useCallback(() => {
    return dispatch(fetchCategories());
  }, [dispatch]);

  const loadCategoryById = useCallback(
    (id: string) => {
      // Check if we already have the category in cache
      const existingCategory = categories.find((cat) => cat.id === id);
      if (existingCategory && selectedCategory?.id === id) {
        return Promise.resolve(); // Already loaded
      }
      return dispatch(fetchCategoryById(id));
    },
    [dispatch, categories, selectedCategory]
  );

  const addCategory = useCallback(
    (data: Omit<Category, "id" | "shopId">) => {
      return dispatch(createCategory(data));
    },
    [dispatch]
  );

  const editCategory = useCallback(
    (id: string, data: Partial<Category>) => {
      return dispatch(updateCategory({ id, data }));
    },
    [dispatch]
  );

  const changeCategoryStatus = useCallback(
    (id: string, active: boolean) => {
      // Optimistic update first for better UX
      dispatch(updateCategoryStatusOptimistic({ id, active }));

      return dispatch(updateCategoryStatus({ id, active }))
        .unwrap()
        .catch((error) => {
          // Revert optimistic update on error
          dispatch(updateCategoryStatusOptimistic({ id, active: !active }));
          throw error;
        });
    },
    [dispatch]
  );

  const removeCategory = useCallback(
    (id: string) => {
      // Optimistic delete for better UX
      const categoryToDelete = categories.find((cat) => cat.id === id);
      if (categoryToDelete) {
        dispatch(deleteCategory(id));

        // Return a promise that handles the actual API call
        return dispatch(deleteCategory(id))
          .unwrap()
          .catch((error) => {
            // Revert optimistic delete on error
            if (categoryToDelete) {
              // You might need to add a "revertDelete" action to your slice
              // For now, we'll refetch the categories
              dispatch(fetchCategoriesByShopId());
            }
            throw error;
          });
      }
      return Promise.reject("Category not found");
    },
    [dispatch, categories]
  );

  // Local reducers
  const reset = useCallback(() => {
    return dispatch(resetCategoryState());
  }, [dispatch]);

  const optimisticStatusUpdate = useCallback(
    (id: string, active: boolean) => {
      return dispatch(updateCategoryStatusOptimistic({ id, active }));
    },
    [dispatch]
  );

  return {
    categories: memoizedCategories,
    selectedCategory: memoizedSelectedCategory,
    status,
    error,
    updateStatusLoading,

    // Actions
    loadCategories,
    loadCategoryById,
    addCategory,
    editCategory,
    changeCategoryStatus,
    removeCategory,
    reset,
    optimisticStatusUpdate,
  };
};
