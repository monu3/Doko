// src/shop/slice/shopSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";
import { RootState } from "@/store";
import { Shop, AudienceData, ShopState } from "../types";

// Initialize the shop slice state.
const initialState: ShopState = {
  shop: undefined,
  shops: [],
  audience: [],
  audienceStatus: "idle",
  audienceError: null,
  status: "idle",
  error: null,
  lastFetched: null,
};

export const fetchAudience = createAsyncThunk<
  AudienceData[],
  string, // shopId
  { rejectValue: string }
>("shop/fetchAudience", async (shopId, { rejectWithValue }) => {
  try {
    const response = await api.get<AudienceData[]>(
      `/shops/${shopId}/audience`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch audience data"
    );
  }
});

/**
 * Thunk for creating a new shop.
 * - Endpoint: POST /shops?ownerId=...
 * - Payload: an object containing shopDTO and ownerId.
 */
export const createShop = createAsyncThunk<
  Shop, // Returned shop object
  {
    shopDTO: {
      shopUrl: string;
      businessName: string;
      district: string;
      province: string;
      // Include any other shop fields needed on create.
    };
    ownerId: string;
  },
  { rejectValue: string }
>("shop/createShop", async ({ shopDTO, ownerId }, { rejectWithValue }) => {
  try {
    // Note: Ensure that you pass credentials so that cookies (JWT) are sent.
    const response = await api.post<Shop>(
      `/shops?ownerId=${ownerId}`,
      shopDTO,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create shop"
    );
  }
});

/**
 * Thunk for fetching a shop by ownerId.
 * - Endpoint: GET /shops?ownerId=...
 * - Parameter: ownerId (as string)
 */
// src/shop/slice/shopSlice.ts
export const getShopByOwnerId = createAsyncThunk<
  Shop,
  string,
  {
    rejectValue: string;
    condition: (
      ownerId: string,
      { getState }: { getState: () => RootState }
    ) => boolean;
  }
>(
  "shop/getShopByOwnerId",
  async (ownerId, { rejectWithValue }) => {
    try {
      const response = await api.get<Shop>(`/shops?ownerId=${ownerId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch shop details"
      );
    }
  },
  {
    condition: (ownerId, { getState }) => {
      const { shop } = getState() as { shop: ShopState };
      const existingShop = shop.shop;

      // Don't fetch if:
      // 1. Already loading
      // 2. Already have shop data for this owner
      return !(
        shop.status === "loading" ||
        (existingShop && existingShop.owner.id === ownerId) ||
        (shop.lastFetched && Date.now() - shop.lastFetched < 30000)
      );
    },
  }
);
/**
 * Thunk for fetching all shops.
 * - Endpoint: GET /shops
 */
export const getAllShops = createAsyncThunk<
  Shop[],
  void,
  { rejectValue: string }
>("shop/getAllShops", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Shop[]>(`/shops`, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch shops"
    );
  }
});

// for the theme management
export const getShopByUrl = createAsyncThunk<
  Shop,
  string,
  { rejectValue: string }
>("shop/getShopByUrl", async (shopUrl, { rejectWithValue }) => {
  try {
    const response = await api.get<Shop>(`/shops/by-url/${shopUrl}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Shop not found");
  }
});

export const updateShopTheme = createAsyncThunk<
  Shop,
  { shopId: string; theme: string },
  { rejectValue: string }
>("shop/updateShopTheme", async ({ shopId, theme }, { rejectWithValue }) => {
  try {
    const response = await api.patch<Shop>(`/shops/${shopId}/theme`, { theme });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update theme"
    );
  }
});

/**
 * Thunk for updating store details.
 * - Endpoint: PATCH /shops/{shopId}
 * - Payload: shopId and store details
 */
export const updateStoreDetails = createAsyncThunk<
  Shop,
  {
    shopId: string;
    storeDetails: {
      shopUrl?: string;
      businessName?: string;
      district?: string;
      province?: string;
      logoUrl?: string;
    };
  },
  { rejectValue: string }
>(
  "shop/updateStoreDetails",
  async ({ shopId, storeDetails }, { rejectWithValue }) => {
    try {
      const response = await api.patch<Shop>(`/shops/${shopId}`, storeDetails, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update store details"
      );
    }
  }
);

/**
 * Thunk for updating store address.
 * - Endpoint: PATCH /shops/{shopId}/address
 * - Payload: shopId and address details
 */
export const updateStoreAddress = createAsyncThunk<
  Shop,
  {
    shopId: string;
    address: {
      street: string;
      city: string;
      tole: string;
      mapUrl: string;
      postalCode: string;
    };
  },
  { rejectValue: string }
>(
  "shop/updateStoreAddress",
  async ({ shopId, address }, { rejectWithValue }) => {
    try {
      const response = await api.patch<Shop>(
        `/shops/${shopId}/address`,
        address,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update store address"
      );
    }
  }
);

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    // Reducer to reset shop state (if needed)
    resetShopState(state) {
      state.shop = undefined;
      state.shops = [];
      state.audience = [];
      state.audienceStatus = "idle";
      state.audienceError = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling createShop thunk states.
      .addCase(createShop.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createShop.fulfilled, (state, action: PayloadAction<Shop>) => {
        state.status = "succeeded";
        state.shop = action.payload;
      })
      .addCase(createShop.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create shop";
      })

      // Handling getShopByOwnerId thunk states.
      .addCase(getShopByOwnerId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getShopByOwnerId.fulfilled,
        (state, action: PayloadAction<Shop>) => {
          state.status = "succeeded";
          state.shop = action.payload;
          state.lastFetched = Date.now(); // Add this
        }
      )
      .addCase(getShopByOwnerId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch shop details";
      })

      // Handling getShopByUrl thunk states.
      .addCase(getShopByUrl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getShopByUrl.fulfilled, (state, action: PayloadAction<Shop>) => {
        state.status = "succeeded";
        state.shop = action.payload;
      })
      .addCase(getShopByUrl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Shop not found";
      })

      // Handling updateShopTheme thunk states.
      .addCase(updateShopTheme.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateShopTheme.fulfilled,
        (state, action: PayloadAction<Shop>) => {
          state.status = "succeeded";
          state.shop = action.payload;
        }
      )
      .addCase(updateShopTheme.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update theme";
      })

      // Handling updateStoreDetails thunk states.
      .addCase(updateStoreDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateStoreDetails.fulfilled,
        (state, action: PayloadAction<Shop>) => {
          state.status = "succeeded";
          state.shop = action.payload;
        }
      )
      .addCase(updateStoreDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update store details";
      })

      // Handling updateStoreAddress thunk states.
      .addCase(updateStoreAddress.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateStoreAddress.fulfilled,
        (state, action: PayloadAction<Shop>) => {
          state.status = "succeeded";
          state.shop = action.payload;
        }
      )
      .addCase(updateStoreAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update store address";
      })

      // Handling getAllShops thunk states.
      .addCase(getAllShops.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getAllShops.fulfilled,
        (state, action: PayloadAction<Shop[]>) => {
          state.status = "succeeded";
          state.shops = action.payload;
        }
      )
      .addCase(getAllShops.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch shops";
      })
      .addCase(fetchAudience.pending, (state) => {
        state.audienceStatus = "loading";
        state.audienceError = null;
      })
      .addCase(
        fetchAudience.fulfilled,
        (state, action: PayloadAction<AudienceData[]>) => {
          state.audienceStatus = "succeeded";
          state.audience = action.payload;
        }
      )
      .addCase(fetchAudience.rejected, (state, action) => {
        state.audienceStatus = "failed";
        state.audienceError = action.payload || "Failed to fetch audience data";
      });
  },
});

export const { resetShopState } = shopSlice.actions;
export default shopSlice.reducer;
