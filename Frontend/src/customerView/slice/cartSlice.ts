import api from "@/api";
import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  AddToCartRequest,
  CartItem,
  CartState,
  CartSummary,
  OrderRequest,
  OrderResponse,
  PaymentInitRequest,
  UpdateCartItemRequest,
} from "@/customerView/types";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// In your cartSlice.ts - update the initiatePayment thunk
export const initiatePayment = createAsyncThunk(
  "cart/initiatePayment",
  async (data: PaymentInitRequest, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return rejectWithValue(
          "No authentication token found. Please sign in again."
        );
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `http://localhost:8080/api/payments/${data.shopId}/${data.paymentMethod}/init`,
        {
          orderId: data.orderId,
          amountMinor: data.amountMinor,
          returnUrl: data.returnUrl,
          failureUrl: data.failureUrl,
        },
        { headers }
      );

      // The backend returns HTML as a string
      const htmlResponse = response.data;

      return {
        redirectHtml: htmlResponse,
        paymentMethod: data.paymentMethod,
        orderId: data.orderId,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to initiate payment";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async Thunks
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (data: AddToCartRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/cart/add",
        {
          productId: data.productId,
          quantity: data.quantity || 1,
          selectedVariant: data.selectedVariant,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      const resData = response.data as {
        status: string;
        cartItem?: CartItem;
        message?: string;
      };
      if (resData.status === "success") {
        return {
          cartItem: resData.cartItem,
          productId: data.productId,
        };
      } else {
        return rejectWithValue(resData.message || "Failed to add to cart");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add to cart";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart", {
        headers: getAuthHeaders(),
      });

      const data = response.data as {
        status: string;
        cartItems?: CartItem[];
        message?: string;
      };
      if (data.status === "success") {
        return data.cartItems;
      } else {
        return rejectWithValue(data.message || "Failed to fetch cart items");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch cart items";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCartItemsGrouped = createAsyncThunk(
  "cart/fetchCartItemsGrouped",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart/grouped", {
        headers: getAuthHeaders(),
      });

      const data = response.data as {
        status: string;
        cartItemsByShop?: Record<string, CartItem[]>;
        message?: string;
      };
      if (data.status === "success") {
        return data.cartItemsByShop;
      } else {
        return rejectWithValue(data.message || "Failed to fetch cart items");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch cart items";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (data: UpdateCartItemRequest, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/cart/update/${data.cartItemId}`,
        {
          quantity: data.quantity,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      const resData = response.data as {
        status: string;
        cartItem?: CartItem;
        message?: string;
      };
      if (resData.status === "success") {
        return {
          cartItem: resData.cartItem,
          cartItemId: data.cartItemId,
        };
      } else {
        return rejectWithValue(resData.message || "Failed to update cart item");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update cart item";
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/remove/${cartItemId}`, {
        headers: getAuthHeaders(),
      });

      const data = response.data as { status: string; message?: string };
      if (data.status === "success") {
        return cartItemId;
      } else {
        return rejectWithValue(data.message || "Failed to remove from cart");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove from cart";
      return rejectWithValue(errorMessage);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/cart/clear", {
        headers: getAuthHeaders(),
      });

      const resData = response.data as { status: string; message?: string };
      if (resData.status === "success") {
        return true;
      } else {
        return rejectWithValue(resData.message || "Failed to clear cart");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to clear cart";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCartSummary = createAsyncThunk(
  "cart/fetchCartSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart/summary", {
        headers: getAuthHeaders(),
      });

      const resData = response.data as {
        status: string;
        summary?: CartSummary;
        message?: string;
      };
      if (resData.status === "success") {
        return resData.summary;
      } else {
        return rejectWithValue(
          resData.message || "Failed to fetch cart summary"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch cart summary";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCartCount = createAsyncThunk(
  "cart/fetchCartCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart/count", {
        headers: getAuthHeaders(),
      });

      const data = response.data as {
        status: string;
        count?: number;
        message?: string;
      };
      if (data.status === "success") {
        return data.count;
      } else {
        return rejectWithValue(data.message || "Failed to fetch cart count");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch cart count";
      return rejectWithValue(errorMessage);
    }
  }
);

export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async (orderData: OrderRequest, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue(
          "No authentication token found. Please sign in again."
        );
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Use direct axios call to ensure we hit the correct endpoint
      const response = await axios.post(
        "http://localhost:8080/orders/create",
        orderData,
        {
          headers: headers,
        }
      );

      const resData = response.data as {
        status: string;
        order?: OrderResponse;
        message?: string;
      };

      if (resData.status === "success") {
        return resData.order;
      } else {
        return rejectWithValue(resData.message || "Failed to place order");
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue("Authentication failed. Please sign in again.");
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to place order";
      return rejectWithValue(errorMessage);
    }
  }
);

// Helper function to group items by shop with proper typing
const groupItemsByShop = (items: CartItem[]): Record<string, CartItem[]> => {
  return items.reduce((groups, item) => {
    const shopId = item.shopId;
    if (!groups[shopId]) {
      groups[shopId] = [];
    }
    groups[shopId].push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);
};

// Helper function to calculate summary
const calculateSummary = (items: CartItem[]): CartSummary => {
  return {
    totalItems: items.length,
    totalAmount: items.reduce((total, item) => total + item.totalPrice, 0),
  };
};

// Initial State
const initialState: CartState = {
  totalItems: 0,
  items: [],
  itemsByShop: {},
  summary: {
    totalItems: 0,
    totalAmount: 0,
  },
  loading: false,
  error: null,
  addToCartLoading: {},
  updateLoading: {},
  removeLoading: {},
  orderLoading: false,
  orderError: null,
  lastOrder: null,
  paymentLoading: false,
  paymentError: null,
  paymentRedirectHtml: null,
};
// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearOrderError: (state) => {
      state.orderError = null;
    },
    clearPaymentError: (state) => {
      state.paymentError = null;
    },
    resetCart: (state) => {
      state.items = [];
      state.itemsByShop = {};
      state.summary = {
        totalItems: 0,
        totalAmount: 0,
      };
      state.error = null;
    },
    // Local state updates for optimistic UI
    optimisticAddToCart: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      state.addToCartLoading[action.payload.productId] = true;
    },
    optimisticUpdateCart: (
      state,
      action: PayloadAction<{ cartItemId: string }>
    ) => {
      state.updateLoading[action.payload.cartItemId] = true;
    },
    optimisticRemoveFromCart: (
      state,
      action: PayloadAction<{ cartItemId: string }>
    ) => {
      state.removeLoading[action.payload.cartItemId] = true;
    },
  },
  extraReducers: (builder) => {
    // Add to Cart
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.addToCartLoading[action.meta.arg.productId] = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addToCartLoading[action.payload.productId] = false;
        // Refresh cart items after adding
        // The actual cart refresh will be handled by the component
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addToCartLoading[action.meta.arg.productId] = false;
        state.error = action.payload as string;
      });

    // Fetch Cart Items
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        const items = action.payload ?? []; // Handle undefined case
        state.items = items;
        state.itemsByShop = groupItemsByShop(items);
        state.summary = calculateSummary(items); // Use helper function
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Cart Items Grouped
    builder
      .addCase(fetchCartItemsGrouped.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItemsGrouped.fulfilled, (state, action) => {
        state.loading = false;
        state.itemsByShop = action.payload ?? {};
        // Flatten grouped items for the main items array
        state.items = Object.values(action.payload ?? {}).flat();
        // Update summary
        state.summary.totalItems = state.items.length;
        state.summary.totalAmount = state.items.reduce(
          (total: number, item: CartItem) => total + item.totalPrice,
          0
        );
      })
      .addCase(fetchCartItemsGrouped.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Cart Item
    builder
      .addCase(updateCartItem.pending, (state, action) => {
        state.updateLoading[action.meta.arg.cartItemId] = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.updateLoading[action.payload.cartItemId] = false;
        // Update the item in the state
        const updatedItem = action.payload.cartItem;
        if (updatedItem) {
          const index = state.items.findIndex(
            (item) => item.id === updatedItem.id
          );
          if (index !== -1) {
            state.items[index] = updatedItem;
            state.itemsByShop = groupItemsByShop(state.items);
          }
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.updateLoading[action.meta.arg.cartItemId] = false;
        state.error = action.payload as string;
      });

    // Remove from Cart
    builder
      .addCase(removeFromCart.pending, (state, action) => {
        state.removeLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.removeLoading[action.payload] = false;
        // Remove the item from state
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.itemsByShop = groupItemsByShop(state.items);
        // Update summary
        state.summary.totalItems = state.items.length;
        state.summary.totalAmount = state.items.reduce(
          (total: number, item: CartItem) => total + item.totalPrice,
          0
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.removeLoading[action.meta.arg] = false;
        state.error = action.payload as string;
      });

    // Clear Cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.itemsByShop = {};
        state.summary = {
          totalItems: 0,
          totalAmount: 0,
        };
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Cart Summary
    builder.addCase(fetchCartSummary.fulfilled, (state, action) => {
      state.summary = action.payload ?? { totalItems: 0, totalAmount: 0 };
    });

    // Fetch Cart Count
    builder.addCase(fetchCartCount.fulfilled, (state, action) => {
      state.summary.totalItems = action.payload ?? 0;
    });
    builder
      .addCase(placeOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.lastOrder = action.payload ?? null;
        state.items = [];
        state.itemsByShop = {};
        state.summary = {
          totalItems: 0,
          totalAmount: 0,
        };
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.payload as string;
      });
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
        state.paymentRedirectHtml = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        if (
          typeof action.payload === "object" &&
          action.payload &&
          "redirectHtml" in action.payload
        ) {
          state.paymentRedirectHtml = action.payload.redirectHtml as string;
        }
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearOrderError,
  clearPaymentError,
  resetCart,
  optimisticAddToCart,
  optimisticUpdateCart,
  optimisticRemoveFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
