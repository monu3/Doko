// src/product/slice/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";
import { RootState } from "@/store";
import { Product, ProductState } from "../types/product";

// Initialize the product slice state
const initialState: ProductState = {
  products: [],
  product: undefined,
  productsByCategory: {}, // Initialize as empty object
  status: "idle",
  error: null,
  updateStatusLoading: {}, // Initialize as empty object
  lastFetched: null,
};

// Helper to handle error messages
const parseError = (error: any): string => {
  return error.response?.data?.message || "An error occurred";
};

// Thunks

/**
 * Fetch products by shopId
 */
export const fetchProductsByShopId = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string; state: RootState }
>(
  "product/fetchProductsByShopId",
  async (_, { getState, rejectWithValue }) => {
    // Extract shopId from the shop slice of state
    const shopId = getState().shop.shop?.id;
    if (!shopId) {
      // If shopId is undefined, reject the thunk
      return rejectWithValue("Shop ID is undefined");
    }
    try {
      const response = await api.get<Product[]>(`/products/shop/${shopId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseError(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().product;
      if (status === "loading" || status === "succeeded") {
        return false;
      }
    },
  }
);

/**
 * Fetch products by category ID.
 *
 * This thunk takes a category ID as an argument and returns an object
 * containing the categoryId and the list of products for that category.
 */
export const fetchProductsByCategoryId = createAsyncThunk<
  { categoryId: string; products: Product[] },
  string, // categoryId
  { rejectValue: string }
>(
  "product/fetchProductsByCategoryId",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>(
        `/products/category/${categoryId}`,
        {
          withCredentials: true,
        }
      );
      return { categoryId, products: response.data };
    } catch (error: any) {
      return rejectWithValue(parseError(error));
    }
  }
);

/**
 * Create a new product
 */
export const createProduct = createAsyncThunk<
  Product,
  Omit<Product, "id" | "shopId">,
  { rejectValue: string; state: RootState }
>(
  "product/createProduct",
  async (productData, { getState, rejectWithValue }) => {
    const shopId = getState().shop.shop?.id;
    if (!shopId) {
      return rejectWithValue("Shop ID is undefined");
    }
    try {
      // Combine form data with shopId
      const payload = {
        ...productData,
        shopId, // Ensure variant data is properly formatted
        images: productData.images || [], // Ensure images is always an array
        imageUrl: productData.imageUrl || productData.images?.[0] || null, // Set primary image
        variantData: productData.variantData || null,
        hasVariants: productData.hasVariants || false,
      };
      const response = await api.post<Product>("/products", payload, {
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
 * Update an existing product
 */
export const updateProduct = createAsyncThunk<
  Product,
  { id: string; productData: Partial<Product> },
  { rejectValue: string }
>("product/updateProduct", async ({ id, productData }, { rejectWithValue }) => {
  try {
    // Ensure variant data is properly handled
    const payload = {
      ...productData,
      images: productData.images || [],
      imageUrl: productData.imageUrl || productData.images?.[0] || null,
      variantData: productData.variantData || null,
      hasVariants: productData.hasVariants || false,
    };
    const response = await api.put<Product>(`/products/${id}`, payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(parseError(error));
  }
});

/**
 * NEW: Thunk for updating product status specifically.
 * - Endpoint: PUT /products/:id/status
 */
export const updateProductStatus = createAsyncThunk<
  { id: string; active: boolean },
  { id: string; active: boolean },
  { rejectValue: string }
>(
  "products/updateProductStatus",
  async ({ id, active }, { rejectWithValue }) => {
    try {
      const response = await api.patch<Product>(
        `/products/${id}/status`,
        { active },
        { withCredentials: true }
      );
      return { id, active: response.data.active };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product status"
      );
    }
  }
);

/**
 * Delete a product
 */
export const deleteProduct = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("product/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`, {
      withCredentials: true,
    });
  } catch (error: any) {
    return rejectWithValue(parseError(error));
  }
});

/**
 * Fetch a single product by ID
 */
export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string; state: RootState }
>(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<Product>(`/products/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseError(error));
    }
  },
  {
    condition: (id, { getState }) => {
      const { product } = getState();
      // Don't fetch if already loading or if the product is already loaded
      return !(
        product.status === "loading" ||
        (product.product && product.product.id === id)
      );
    },
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProductState: () => initialState,
    resetOperationStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    // Add this new action to force navigation
    setOperationSuccess: (state) => {
      state.status = "succeeded";
    },
    // Optimistic updates for better UX
    updateProductStatusOptimistic(
      state,
      action: PayloadAction<{ id: string; active: boolean }>
    ) {
      const { id, active } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        product.active = active;
      }
      if (state.product && state.product.id === id) {
        state.product.active = active;
      }
    },
    // Add action to clear current product
    clearCurrentProduct(state) {
      state.product = undefined;
    },
    // Add image to product locally
    addProductImage(
      state,
      action: PayloadAction<{ productId: string; imageUrl: string }>
    ) {
      const { productId, imageUrl } = action.payload;
      const product = state.products.find((p) => p.id === productId);
      if (product) {
        if (!product.images) product.images = [];
        product.images.push(imageUrl);
        // Update primary image if it's the first image
        if (product.images.length === 1) {
          product.imageUrl = imageUrl;
        }
      }
      if (state.product && state.product.id === productId) {
        if (!state.product.images) state.product.images = [];
        state.product.images.push(imageUrl);
        if (state.product.images.length === 1) {
          state.product.imageUrl = imageUrl;
        }
      }
    },
    // Remove image from product locally
    removeProductImage(
      state,
      action: PayloadAction<{ productId: string; imageUrl: string }>
    ) {
      const { productId, imageUrl } = action.payload;
      const product = state.products.find((p) => p.id === productId);
      if (product && product.images) {
        product.images = product.images.filter((img) => img !== imageUrl);
        // Update primary image if needed
        if (product.imageUrl === imageUrl) {
          product.imageUrl = product.images[0] || "";
        }
      }
      if (
        state.product &&
        state.product.id === productId &&
        state.product.images
      ) {
        state.product.images = state.product.images.filter(
          (img) => img !== imageUrl
        );
        if (state.product.imageUrl === imageUrl) {
          state.product.imageUrl = state.product.images[0] || "";
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products by Shop ID
      .addCase(fetchProductsByShopId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductsByShopId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProductsByShopId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch products";
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.push(action.payload); // Add the new product to the list
        state.error = null; // Clear any previous errors
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create product";
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ); // Update the product in the list
        if (state.product && state.product.id === action.payload.id) {
          state.product = action.payload;
        }
        state.error = null; // Clear any previous errors
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update product";
      })

      // NEW: Handle updateCategoryStatus cases
      .addCase(updateProductStatus.pending, (state, action) => {
        const { id } = action.meta.arg;
        state.updateStatusLoading[id] = true;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const { id, active } = action.payload;

        // Update products array
        const productIndex = state.products.findIndex((p) => p.id === id);
        if (productIndex !== -1) {
          state.products[productIndex].active = active;
        }

        // Update current product if it's the one being updated
        if (state.product && state.product.id === id) {
          state.product.active = active;
        }

        delete state.updateStatusLoading[id];
      })
      .addCase(updateProductStatus.rejected, (state, action) => {
        const { id } = action.meta.arg;

        delete state.updateStatusLoading[id];
        state.error = action.payload || "Failed to update product status";
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.filter(
          (product) => product.id !== action.meta.arg
        ); // Remove the deleted product from the list
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete product";
      })

      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch product";
      })
      // Fetch Products by Category ID
      .addCase(fetchProductsByCategoryId.fulfilled, (state, action) => {
        // Store the fetched list of products for the given category
        state.productsByCategory[action.payload.categoryId] =
          action.payload.products;
      });
  },
});

export const {
  resetProductState,
  updateProductStatusOptimistic,
  clearCurrentProduct,
  addProductImage,
  removeProductImage,
  resetOperationStatus,
  setOperationSuccess,
} = productSlice.actions;
export default productSlice.reducer;
