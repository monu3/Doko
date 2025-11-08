import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/api";

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productImages: string[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  description?: string;
  shopId: string;
  shopName: string;
  stockQuantity: number;
  category?: string;
  brandName?: string;
  createdAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  addToWishlistLoading: Record<string, boolean>; // Track loading per product
  removeFromWishlistLoading: Record<string, boolean>; // Track loading per product
  wishlistStatus: Record<string, boolean>; // Track wishlist status per product
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Async Thunks
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/wishlist/add",
        {
          productId: productId,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      const data = response.data as {
        status: string;
        wishlistItem?: WishlistItem;
        message?: string;
      };
      if (data.status === "success") {
        return {
          wishlistItem: data.wishlistItem,
          productId: productId,
        };
      } else {
        return rejectWithValue(
          data.message || "Failed to add to wishlist"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add to wishlist";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchWishlistItems = createAsyncThunk(
  "wishlist/fetchWishlistItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/wishlist", {
        headers: getAuthHeaders(),
      });

      const data = response.data as {
        status: string;
        wishlistItems?: WishlistItem[];
        message?: string;
      };
      if (data.status === "success") {
        return data.wishlistItems;
      } else {
        return rejectWithValue(
          data.message || "Failed to fetch wishlist items"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch wishlist items";
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/wishlist/remove/${productId}`, {
        headers: getAuthHeaders(),
      });

      const data = response.data as { status: string; message?: string };
      if (data.status === "success") {
        return productId;
      } else {
        return rejectWithValue(
          data.message || "Failed to remove from wishlist"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove from wishlist";
      return rejectWithValue(errorMessage);
    }
  }
);

export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/wishlist/clear", {
        headers: getAuthHeaders(),
      });

      const data = response.data as { status: string; message?: string };
      if (data.status === "success") {
        return true;
      } else {
        return rejectWithValue(
          data.message || "Failed to clear wishlist"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to clear wishlist";
      return rejectWithValue(errorMessage);
    }
  }
);

export const checkWishlistStatus = createAsyncThunk(
  "wishlist/checkWishlistStatus",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/wishlist/check/${productId}`, {
        headers: getAuthHeaders(),
      });

      const data = response.data as {
        status: string;
        isInWishlist?: boolean;
        message?: string;
      };

      if (data.status === "success") {
        return {
          productId: productId,
          isInWishlist: data.isInWishlist,
        };
      } else {
        return rejectWithValue(
          data.message || "Failed to check wishlist status"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to check wishlist status";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchWishlistCount = createAsyncThunk(
  "wishlist/fetchWishlistCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/wishlist/count", {
        headers: getAuthHeaders(),
      });

      const data = response.data as { status: string; count?: number; message?: string };

      if (data.status === "success") {
        return data.count;
      } else {
        return rejectWithValue(
          data.message || "Failed to fetch wishlist count"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch wishlist count";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  addToWishlistLoading: {},
  removeFromWishlistLoading: {},
  wishlistStatus: {},
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetWishlist: (state) => {
      state.items = [];
      state.wishlistStatus = {};
      state.error = null;
    },
    optimisticAddToWishlist: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      state.addToWishlistLoading[action.payload.productId] = true;
      state.wishlistStatus[action.payload.productId] = true;
    },
    optimisticRemoveFromWishlist: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      state.removeFromWishlistLoading[action.payload.productId] = true;
      state.wishlistStatus[action.payload.productId] = false;
    },
    setWishlistStatus: (
      state,
      action: PayloadAction<Record<string, boolean>>
    ) => {
      state.wishlistStatus = { ...state.wishlistStatus, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.pending, (state, action) => {
        state.addToWishlistLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.addToWishlistLoading[action.payload.productId] = false;
        state.wishlistStatus[action.payload.productId] = true;
        const existingItem = state.items.find(
          (item) => item.productId === action.payload.productId
        );
        if (!existingItem) {
          state.items.push();
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.addToWishlistLoading[action.meta.arg] = false;
        state.wishlistStatus[action.meta.arg] = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchWishlistItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload ?? [];
        const statusMap: Record<string, boolean> = {};
        (action.payload ?? []).forEach((item: WishlistItem) => {
          statusMap[item.productId] = true;
        });
        state.wishlistStatus = { ...state.wishlistStatus, ...statusMap };
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(removeFromWishlist.pending, (state, action) => {
        state.removeFromWishlistLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.removeFromWishlistLoading[action.payload] = false;
        state.wishlistStatus[action.payload] = false;
        state.items = state.items.filter(
          (item) => item.productId !== action.payload
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.removeFromWishlistLoading[action.meta.arg] = false;
        state.wishlistStatus[action.meta.arg] = true;
        state.error = action.payload as string;
      });

    builder
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.wishlistStatus = {};
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder.addCase(checkWishlistStatus.fulfilled, (state, action) => {
      state.wishlistStatus[action.payload.productId] =
        action.payload.isInWishlist ?? false;
    });
  },
});

export const {
  clearError,
  resetWishlist,
  optimisticAddToWishlist,
  optimisticRemoveFromWishlist,
  setWishlistStatus,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
