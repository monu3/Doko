import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";
import { RootState } from "@/store";
import { Category, CategoryState } from "../types/category";

// Initialize the category slice state
const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  status: "idle",
  error: null,
  updateStatusLoading: {}, // Track loading state for individual status updates
  lastFetched: null, // Timestamp of the last successful fetch
  cache: {}, // Individual category cache
};

/**
 * Fetch all categories by Shop ID.
 */
export const fetchCategoriesByShopId = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string; state: RootState }
>(
  "category/fetchCategoriesByShopId",
  async (_, { getState, rejectWithValue }) => {
    // Extract shopId from the shop slice of state
    const shopId = getState().shop.shop?.id;
    if (!shopId) {
      // If shopId is undefined, reject the thunk
      return rejectWithValue("Shop ID is undefined");
    }
    try {
      const response = await api.get<Category[]>(`/categories/shop/${shopId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().category;
      if (status === "loading" || status === "succeeded") {
        return false;
      }
    },
  }
);

/**
 * Thunk for fetching all categories.
 * - Endpoint: GET /categories
 */
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("category/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Category[]>("/categories", {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
});

/**
 * Thunk for fetching a single category by ID.
 * - Endpoint: GET /categories/:id
 */
export const fetchCategoryById = createAsyncThunk<
  Category,
  string,
  { rejectValue: string; state: RootState }
>("category/fetchCategoryById", async (id, { getState, rejectWithValue }) => {
  // Check cache first
  const state = getState();
  const cached = state.category.cache[id];

  // Return cached data if it's fresh (less than 5 minutes old)
  if (cached && Date.now() - cached.timestamp < 300000) {
    return cached.data;
  }

  try {
    const response = await api.get<Category>(`/categories/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch category"
    );
  }
});

/**
 * Thunk for creating a new category.
 * - Endpoint: POST /categories
 */
export const createCategory = createAsyncThunk<
  Category,
  // UPDATED: Exclude both "id" and "shopId" because shopId will be added automatically.
  Omit<Category, "id" | "shopId">,
  { rejectValue: string; state: RootState }
>(
  "category/createCategory",
  async (categoryData, { getState, rejectWithValue }) => {
    // ADDED: Extract shopId from shop slice and add it to the payload.
    const shopId = getState().shop.shop?.id;
    if (!shopId) {
      return rejectWithValue("Shop ID is undefined");
    }
    try {
      // Combine form data with shopId
      const payload = { ...categoryData, shopId };
      const response = await api.post<Category>("/categories", payload, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

/**
 * Thunk for updating a category.
 * - Endpoint: PUT /categories/:id
 */
export const updateCategory = createAsyncThunk<
  Category,
  { id: string; data: Partial<Category> },
  { rejectValue: string }
>("category/updateCategory", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put<Category>(`/categories/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update category"
    );
  }
});

/**
 * NEW: Thunk for updating category status specifically.
 * - Endpoint: PUT /categories/:id/status
 */
export const updateCategoryStatus = createAsyncThunk<
  { id: string; active: boolean },
  { id: string; active: boolean },
  { rejectValue: string }
>(
  "category/updateCategoryStatus",
  async ({ id, active }, { rejectWithValue }) => {
    try {
      const response = await api.put<Category>(
        `/categories/${id}/status`,
        { active },
        { withCredentials: true }
      );
      return { id, active: response.data.active };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category status"
      );
    }
  }
);

/**
 * Thunk for deleting a category (soft delete).
 * - Endpoint: DELETE /categories/:id
 */
export const deleteCategory = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("category/deleteCategory", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/categories/${id}`, { withCredentials: true });
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete category"
    );
  }
});

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetCategoryState(state) {
      state.categories = [];
      state.selectedCategory = null;
      state.status = "idle";
      state.error = null;
    },
    // Optimistic update for better UX
    updateCategoryStatusOptimistic(
      state,
      action: PayloadAction<{ id: string; active: boolean }>
    ) {
      const { id, active } = action.payload;
      const category = state.categories.find((cat) => cat.id === id);
      if (category) {
        category.active = active;
      }
    },
    clearCategoryCache(state) {
      state.cache = {};
    },
    setCategoryCache(
      state,
      action: PayloadAction<{ id: string; data: Category }>
    ) {
      state.cache[action.payload.id] = {
        data: action.payload.data,
        timestamp: Date.now(),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products by Shop ID
      .addCase(fetchCategoriesByShopId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategoriesByShopId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesByShopId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch products";
      })

      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.status = "succeeded";
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch categories";
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
        // Update cache
        state.cache[action.payload.id] = {
          data: action.payload,
          timestamp: Date.now(),
        };
      })
      .addCase(
        createCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.categories.push(action.payload);
        }
      )
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          // ✅ Update list
          state.categories = state.categories.map((category) =>
            category.id === action.payload.id ? action.payload : category
          );

          // ✅ Update selectedCategory if it’s the same one
          if (state.selectedCategory?.id === action.payload.id) {
            state.selectedCategory = action.payload;
          }

          // ✅ Refresh cache
          state.cache[action.payload.id] = {
            data: action.payload,
            timestamp: Date.now(),
          };
        }
      )
      // NEW: Handle updateCategoryStatus cases
      .addCase(updateCategoryStatus.pending, (state, action) => {
        const { id } = action.meta.arg;
        state.updateStatusLoading[id] = true;
      })
      .addCase(updateCategoryStatus.fulfilled, (state, action) => {
        const { id, active } = action.payload;
        const category = state.categories.find((cat) => cat.id === id);
        if (category) {
          category.active = active;
        }
        delete state.updateStatusLoading[id];
      })
      .addCase(updateCategoryStatus.rejected, (state, action) => {
        const { id } = action.meta.arg;
        delete state.updateStatusLoading[id];
        // Revert optimistic update if it was applied
        const originalActive = !action.meta.arg.active;
        const category = state.categories.find((cat) => cat.id === id);
        if (category) {
          category.active = originalActive;
        }
      })
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.categories = state.categories.filter(
            (category) => category.id !== action.payload
          );
        }
      );
  },
});

export const { resetCategoryState, updateCategoryStatusOptimistic } =
  categorySlice.actions;
export default categorySlice.reducer;
