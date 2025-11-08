// src/shop/slice/shopGallerySlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiWithOutCredentials from "@/apiWithOutCred";
import { RootState } from "@/store";

export interface ShopGalleryItem {
  shopId: string;
  shopUrl: string;
  businessName: string;
  themeName: string;
  logoUrl: string;
  previewImage?: string;
  description?: string;
  followerCount: number;
}

export interface ShopGalleryState {
  shops: ShopGalleryItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  followerCounts: Record<string, number>; // Store follower counts by shopId
  followerCountsLoading: Record<string, boolean>; // Track loading state for each shop
}

export const initialState: ShopGalleryState = {
  shops: [],
  status: "idle",
  error: null,
  followerCounts: {},
  followerCountsLoading: {},
};

export const fetchShopGallery = createAsyncThunk<
  ShopGalleryItem[],
  void,
  { rejectValue: string }
>("shopGallery/fetchShopGallery", async (_, { rejectWithValue }) => {
  try {
    const response = await apiWithOutCredentials.get<ShopGalleryItem[]>(
      "/shops/gallery"
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch shop gallery"
    );
  }
});

// New thunk to fetch follower count for a specific shop
export const fetchFollowerCount = createAsyncThunk<
  { shopId: string; count: number },
  { shopId: string },
  { rejectValue: string }
>("shopGallery/fetchFollowerCount", async ({ shopId }, { rejectWithValue }) => {
  try {
    const response = await apiWithOutCredentials.get<number>(
      `/follower/count?shopId=${shopId}`
    );
    return {
      shopId,
      count: response.data,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch follower count"
    );
  }
});
// New thunk to fetch follower counts for all shops
export const fetchAllFollowerCounts = createAsyncThunk<
  Record<string, number>,
  { shopIds: string[] },
  { rejectValue: string }
>(
  "shopGallery/fetchAllFollowerCounts",
  async ({ shopIds }, { rejectWithValue, dispatch }) => {
    try {
      const followerCounts: Record<string, number> = {};

      // Fetch follower counts for all shops in parallel
      const promises = shopIds.map(async (shopId) => {
        try {
          const result = await dispatch(
            fetchFollowerCount({ shopId })
          ).unwrap();
          return result;
        } catch (error) {
          console.error(
            `Failed to fetch follower count for shop ${shopId}:`,
            error
          );
          return { shopId, count: 0 };
        }
      });

      const results = await Promise.all(promises);
      results.forEach(({ shopId, count }) => {
        followerCounts[shopId] = count;
      });

      return followerCounts;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch follower counts");
    }
  }
);

const shopGallerySlice = createSlice({
  name: "shopGallery",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetStatus(state) {
      state.status = "idle";
    },
    // Action to update follower count when user follows/unfollows
    updateFollowerCount(
      state,
      action: { payload: { shopId: string; increment: boolean } }
    ) {
      const { shopId, increment } = action.payload;
      if (state.followerCounts[shopId] !== undefined) {
        state.followerCounts[shopId] += increment ? 1 : -1;
        // Ensure count doesn't go below 0
        if (state.followerCounts[shopId] < 0) {
          state.followerCounts[shopId] = 0;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopGallery.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchShopGallery.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shops = action.payload;
      })
      .addCase(fetchShopGallery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch shop gallery";
      });
    // Handle individual follower count fetching
    builder
      .addCase(fetchFollowerCount.pending, (state, action) => {
        const shopId = action.meta.arg.shopId;
        state.followerCountsLoading[shopId] = true;
      })
      .addCase(fetchFollowerCount.fulfilled, (state, action) => {
        const { shopId, count } = action.payload;
        state.followerCounts[shopId] = count;
        state.followerCountsLoading[shopId] = false;
      })
      .addCase(fetchFollowerCount.rejected, (state, action) => {
        const shopId = action.meta.arg.shopId;
        state.followerCountsLoading[shopId] = false;
      });

    // Handle bulk follower counts fetching
    builder
      .addCase(fetchAllFollowerCounts.pending, (state) => {
        // Set loading state for all shops
        state.shops.forEach((shop) => {
          state.followerCountsLoading[shop.shopId] = true;
        });
      })
      .addCase(fetchAllFollowerCounts.fulfilled, (state, action) => {
        state.followerCounts = { ...state.followerCounts, ...action.payload };
        // Clear loading state for all shops
        Object.keys(action.payload).forEach((shopId) => {
          state.followerCountsLoading[shopId] = false;
        });
      })
      .addCase(fetchAllFollowerCounts.rejected, (state) => {
        // Clear loading state for all shops
        state.shops.forEach((shop) => {
          state.followerCountsLoading[shop.shopId] = false;
        });
      });
  },
});

export const { clearError, resetStatus, updateFollowerCount } =
  shopGallerySlice.actions;

// Selectors
export const selectShopGallery = (state: RootState) => state.shopGallery.shops;
export const selectShopGalleryStatus = (state: RootState) =>
  state.shopGallery.status;
export const selectShopGalleryError = (state: RootState) =>
  state.shopGallery.error;
export const selectFollowerCounts = (state: RootState) =>
  state.shopGallery.followerCounts;
export const selectFollowerCountsLoading = (state: RootState) =>
  state.shopGallery.followerCountsLoading;
export const selectFollowerCountForShop =
  (shopId: string) => (state: RootState) =>
    state.shopGallery.followerCounts[shopId] || 0;

export default shopGallerySlice.reducer;
