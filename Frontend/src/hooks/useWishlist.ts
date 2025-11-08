// src/wishlist/hooks/useWishlist.ts
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import type { RootState } from "@/store";
import {
  addToWishlist,
  fetchWishlistItems,
  removeFromWishlist,
  clearWishlist,
  checkWishlistStatus,
  fetchWishlistCount,
  clearError,
  resetWishlist,
  optimisticAddToWishlist,
  optimisticRemoveFromWishlist,
  setWishlistStatus,
  type WishlistItem,
} from "@/customerView/slice/wishlistSlice";

export const useWishlist = () => {
  const dispatch = useAppDispatch();

  // Select all wishlist state from Redux
  const wishlistState = useAppSelector((state: RootState) => state.wishlist);
  const {
    items,
    loading,
    error,
    addToWishlistLoading,
    removeFromWishlistLoading,
    wishlistStatus,
  } = wishlistState;

  // Memoized action creators
  const addItemToWishlist = useCallback(
    (productId: string) => {
      return dispatch(addToWishlist(productId));
    },
    [dispatch]
  );

  const fetchItems = useCallback(() => {
    return dispatch(fetchWishlistItems());
  }, [dispatch]);

  const removeItem = useCallback(
    (productId: string) => {
      return dispatch(removeFromWishlist(productId));
    },
    [dispatch]
  );

  const clearAllItems = useCallback(() => {
    return dispatch(clearWishlist());
  }, [dispatch]);

  const checkStatus = useCallback(
    (productId: string) => {
      return dispatch(checkWishlistStatus(productId));
    },
    [dispatch]
  );

  const fetchCount = useCallback(() => {
    return dispatch(fetchWishlistCount());
  }, [dispatch]);

  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetWishlistState = useCallback(() => {
    dispatch(resetWishlist());
  }, [dispatch]);

  const optimisticAdd = useCallback(
    (productId: string) => {
      dispatch(optimisticAddToWishlist({ productId }));
    },
    [dispatch]
  );

  const optimisticRemove = useCallback(
    (productId: string) => {
      dispatch(optimisticRemoveFromWishlist({ productId }));
    },
    [dispatch]
  );

  const setStatus = useCallback(
    (statusMap: Record<string, boolean>) => {
      dispatch(setWishlistStatus(statusMap));
    },
    [dispatch]
  );

  // Helper functions
  const getWishlistItem = useCallback(
    (productId: string): WishlistItem | undefined => {
      return items.find((item) => item.productId === productId);
    },
    [items]
  );

  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return wishlistStatus[productId] || false;
    },
    [wishlistStatus]
  );

  const isAddingToWishlist = useCallback(
    (productId: string): boolean => {
      return addToWishlistLoading[productId] || false;
    },
    [addToWishlistLoading]
  );

  const isRemovingFromWishlist = useCallback(
    (productId: string): boolean => {
      return removeFromWishlistLoading[productId] || false;
    },
    [removeFromWishlistLoading]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const currentlyInWishlist = isInWishlist(productId);

      if (currentlyInWishlist) {
        return removeItem(productId);
      } else {
        return addItemToWishlist(productId);
      }
    },
    [isInWishlist, addItemToWishlist, removeItem]
  );

  return {
    // State
    items,
    loading,
    error,
    wishlistStatus,

    // Actions
    addItemToWishlist,
    fetchItems,
    removeItem,
    clearAllItems,
    checkStatus,
    fetchCount,
    clearErrors,
    resetWishlistState,

    // Optimistic actions
    optimisticAdd,
    optimisticRemove,
    setStatus,

    // Helper functions
    getWishlistItem,
    isInWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
    toggleWishlist,

    // Derived state
    isEmpty: items.length === 0,
    hasItems: items.length > 0,
    count: items.length,
  };
};

// Additional specialized hooks for specific use cases

export const useWishlistItems = () => {
  const { items, loading, error, fetchItems } = useWishlist();

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
  };
};

export const useWishlistStatus = (productId?: string) => {
  const {
    isInWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
    checkStatus,
  } = useWishlist();

  const checkProductStatus = useCallback(() => {
    if (productId) {
      checkStatus(productId);
    }
  }, [productId, checkStatus]);

  return {
    isInWishlist: productId ? isInWishlist(productId) : false,
    isAdding: productId ? isAddingToWishlist(productId) : false,
    isRemoving: productId ? isRemovingFromWishlist(productId) : false,
    checkStatus: checkProductStatus,
  };
};

export const useWishlistOperations = () => {
  const {
    addItemToWishlist,
    removeItem,
    toggleWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
    optimisticAdd,
    optimisticRemove,
  } = useWishlist();

  return {
    addItemToWishlist,
    removeItem,
    toggleWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
    optimisticAdd,
    optimisticRemove,
  };
};

export default useWishlist;
