// features/orders/ordersSlice.ts
import api from "@/api";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  Order,
  OrdersState,
  OrdersApiResponse,
  OrderStatusUpdateResponse,
} from "@/orders/types";

export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: string },
  { rejectValue: string }
>(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch<OrderStatusUpdateResponse>(
        `/orders/${orderId}/status?status=${status}`
      );

      if (response.data.status === "success" && response.data.orders) {
        return response.data.orders;
      } else {
        return rejectWithValue(
          response.data.message || "Failed to update order status."
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An unknown error occurred while updating order status."
      );
    }
  }
);

export const getOrdersByShop = createAsyncThunk<
  Order[],
  string,
  { rejectValue: string }
>("orders/getOrdersByShop", async (shopId, { rejectWithValue }) => {
  try {
    const response = await api.get<OrdersApiResponse>(
      `/shops/orders/${shopId}`
    );

    if (response.data.status === "success" && response.data.orders) {
      return response.data.orders;
    } else {
      return rejectWithValue(
        response.data.message || "Invalid response from server."
      );
    }
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        "An unknown error occurred while fetching orders."
    );
  }
});

const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  updatingStatus: false,
  lastFetched: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    updateOrderStatusLocal: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      const order = state.orders.find(
        (order) => order.id === action.payload.id
      );
      if (order) {
        order.status = action.payload.status;
      }
      if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
        state.selectedOrder.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersByShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByShop.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.lastFetched = Date.now(); // Add this
      })
      .addCase(getOrdersByShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch orders";
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.updatingStatus = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updatingStatus = false;
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(
          (order) => order.id === updatedOrder.id
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        if (state.selectedOrder && state.selectedOrder.id === updatedOrder.id) {
          state.selectedOrder = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updatingStatus = false;
        state.error = action.payload || "Failed to update order status";
      });
    // In extraReducers, update lastFetched on successful fetch
  },
});

export const { addOrder, setSelectedOrder, updateOrderStatusLocal } =
  ordersSlice.actions;
export default ordersSlice.reducer;
