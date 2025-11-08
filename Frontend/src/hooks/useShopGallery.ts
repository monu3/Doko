// src/shop/hooks/useShopGallery.ts
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import type { RootState } from "@/store";
import {
  fetchShopGallery,
  fetchFollowerCount,
  fetchAllFollowerCounts,
  clearError,
  resetStatus,
  updateFollowerCount,
  type ShopGalleryItem,
} from "@/customerView/slice/shopGallerySlice";

// 🔹 Core Hook: gives raw access to state + actions
export const useShopGalleryCore = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s: RootState) => s.shopGallery);

  // --- Actions (memoized for stability) ---
  const fetchGallery = useCallback(
    () => dispatch(fetchShopGallery()),
    [dispatch]
  );

  const fetchShopFollowerCount = useCallback(
    (shopId: string) => dispatch(fetchFollowerCount({ shopId })),
    [dispatch]
  );

  const fetchAllFollowerCountsAction = useCallback(
    (shopIds: string[]) => dispatch(fetchAllFollowerCounts({ shopIds })),
    [dispatch]
  );

  const clearGalleryError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  const resetGalleryStatus = useCallback(
    () => dispatch(resetStatus()),
    [dispatch]
  );

  const updateFollowerCountAction = useCallback(
    (shopId: string, increment: boolean) => {
      dispatch(updateFollowerCount({ shopId, increment }));
    },
    [dispatch]
  );

  return {
    ...state,
    fetchGallery,
    fetchShopFollowerCount,
    fetchAllFollowerCounts: fetchAllFollowerCountsAction,
    clearGalleryError,
    resetGalleryStatus,
    updateFollowerCount: updateFollowerCountAction,
  };
};

// 🔹 Full Hook: adds helpers + derived state
export const useShopGallery = () => {
  const {
    shops,
    status,
    error,
    followerCounts,
    followerCountsLoading,
    fetchGallery,
    fetchShopFollowerCount,
    fetchAllFollowerCounts,
    clearGalleryError,
    resetGalleryStatus,
    updateFollowerCount,
  } = useShopGalleryCore();

  // --- Helpers (no need for useCallback) ---
  const getShopById = (shopId: string): ShopGalleryItem | undefined =>
    shops.find((s) => s.shopId === shopId);

  const getShopByUrl = (shopUrl: string): ShopGalleryItem | undefined =>
    shops.find((s) => s.shopUrl === shopUrl);

  const getShopsByTheme = (themeName: string): ShopGalleryItem[] =>
    shops.filter((s) => s.themeName === themeName);

  const getFollowerCount = (shopId: string): number =>
    followerCounts[shopId] || 0;

  const isFollowerCountLoading = (shopId: string): boolean =>
    followerCountsLoading[shopId] || false;

  // --- Combined workflow ---
  const loadGalleryWithCounts = useCallback(async () => {
    try {
      const result = await fetchGallery().unwrap();
      if (result?.length) {
        const shopIds = result.map((s) => s.shopId);
        await fetchAllFollowerCounts(shopIds);
      }
      return result;
    } catch (err) {
      throw err;
    }
  }, [fetchGallery, fetchAllFollowerCounts]);

  return {
    shops,
    status,
    error,
    followerCounts,
    followerCountsLoading,

    fetchGallery,
    fetchShopFollowerCount,
    fetchAllFollowerCounts,
    clearGalleryError,
    resetGalleryStatus,
    updateFollowerCount,

    getShopById,
    getShopByUrl,
    getShopsByTheme,
    getFollowerCount,
    isFollowerCountLoading,
    loadGalleryWithCounts,

    // Derived state
    isLoading: status === "loading",
    isSuccess: status === "succeeded",
    isError: status === "failed",
    isEmpty: shops.length === 0,
    count: shops.length,
  };
};

// 🔹 Specialized hooks (thin wrappers around main hook)
export const useShopGalleryList = () => {
  const {
    shops,
    status,
    error,
    fetchGallery,
    clearGalleryError,
    isLoading,
    isSuccess,
    isError,
  } = useShopGallery();

  return {
    shops,
    status,
    error,
    fetchGallery,
    clearError: clearGalleryError,
    loading: isLoading,
    success: isSuccess,
    errorState: isError,
  };
};

export const useShopFollowerCounts = () => {
  const {
    followerCounts,
    followerCountsLoading,
    fetchShopFollowerCount,
    fetchAllFollowerCounts,
    getFollowerCount,
    isFollowerCountLoading,
    updateFollowerCount,
  } = useShopGallery();

  return {
    followerCounts,
    followerCountsLoading,
    fetchFollowerCount: fetchShopFollowerCount,
    fetchAllFollowerCounts,
    getFollowerCount,
    isFollowerCountLoading,
    updateFollowerCount,
  };
};

export const useShopSearch = () => {
  const { shops, getShopById, getShopByUrl, getShopsByTheme } =
    useShopGallery();

  const searchShops = (query: string): ShopGalleryItem[] => {
    if (!query.trim()) return shops;

    const q = query.toLowerCase();
    return shops.filter(
      (shop) =>
        shop.businessName.toLowerCase().includes(q) ||
        shop.description?.toLowerCase().includes(q) ||
        shop.themeName.toLowerCase().includes(q)
    );
  };

  return { searchShops, getShopById, getShopByUrl, getShopsByTheme };
};

export default useShopGallery;
