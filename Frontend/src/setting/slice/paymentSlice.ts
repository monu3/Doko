// src/store/slices/paymentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type {
  PaymentConfig,
  PaymentConfigSummary,
  PaymentState,
  CreateConfigRequest,
  UpdateConfigRequest,
} from "@/setting/settings";
import { paymentApi } from "../paymentApi";

const initialState: PaymentState = {
  configs: [],
  configDetails: {},
  loading: false,
  error: null,
  setupDialog: {
    open: false,
    paymentMethod: null,
  },
  currentConfig: null,
};

// Async thunks
export const createPaymentConfig = createAsyncThunk(
  "payment/createConfig",
  async (configData: CreateConfigRequest, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createConfig(configData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create configuration"
      );
    }
  }
);

export const getPaymentConfigsByShop = createAsyncThunk(
  "payment/getConfigsByShop",
  async (shopId: string, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getConfigsByShop(shopId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch configurations"
      );
    }
  }
);

export const getPaymentConfigDetail = createAsyncThunk(
  "payment/getConfigDetail",
  async (
    { shopId, paymentMethod }: { shopId: string; paymentMethod: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await paymentApi.getConfigDetail(shopId, paymentMethod);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return rejectWithValue("CONFIG_NOT_FOUND");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch configuration"
      );
    }
  }
);

export const updatePaymentConfig = createAsyncThunk(
  "payment/updateConfig",
  async (
    { configId, data }: { configId: string; data: UpdateConfigRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await paymentApi.updateConfig(configId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update configuration"
      );
    }
  }
);

export const togglePaymentConfigActive = createAsyncThunk(
  "payment/toggleActive",
  async (configId: string, { rejectWithValue }) => {
    try {
      const response = await paymentApi.toggleActive(configId);
      return { configId, active: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle configuration"
      );
    }
  }
);

export const deletePaymentConfig = createAsyncThunk(
  "payment/deleteConfig",
  async (configId: string, { rejectWithValue }) => {
    try {
      await paymentApi.deleteConfig(configId);
      return configId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete configuration"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    openSetupDialog: (state, action: PayloadAction<string>) => {
      state.setupDialog.open = true;
      state.setupDialog.paymentMethod = action.payload;
    },
    closeSetupDialog: (state) => {
      state.setupDialog.open = false;
      state.setupDialog.paymentMethod = null;
      state.error = null;
    },
    setCurrentConfig: (state, action: PayloadAction<PaymentConfig | null>) => {
      state.currentConfig = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearConfigDetails: (state) => {
      state.configDetails = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Create config
      .addCase(createPaymentConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentConfig.fulfilled, (state, action) => {
        state.loading = false;
        // Add to config details
        state.configDetails[action.payload.paymentMethod] = action.payload;
        // Update or add to configs list
        const index = state.configs.findIndex(
          (config) => config.paymentMethod === action.payload.paymentMethod
        );
        const summary: PaymentConfigSummary = {
          id: action.payload.id,
          shopId: action.payload.shopId,
          paymentMethod: action.payload.paymentMethod,
          active: action.payload.active,
          createdAt: action.payload.createdAt,
          maskedCredentials: {
            paymentMethod: action.payload.paymentMethod,
            maskedMerchantCode: "***",
            maskedPublicKey: null,
            lastFourDigits: null,
          },
        };
        if (index >= 0) {
          state.configs[index] = summary;
        } else {
          state.configs.push(summary);
        }
        state.setupDialog.open = false;
      })
      .addCase(createPaymentConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get configs by shop
      .addCase(getPaymentConfigsByShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentConfigsByShop.fulfilled, (state, action) => {
        state.loading = false;
        state.configs = action.payload;
      })
      .addCase(getPaymentConfigsByShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get config detail
      .addCase(getPaymentConfigDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentConfigDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.configDetails[action.payload.paymentMethod] = action.payload;
        state.currentConfig = action.payload;
      })
      .addCase(getPaymentConfigDetail.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== "CONFIG_NOT_FOUND") {
          state.error = action.payload as string;
        }
      })
      // Update config
      .addCase(updatePaymentConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentConfig.fulfilled, (state, action) => {
        state.loading = false;
        // Update config details
        state.configDetails[action.payload.paymentMethod] = action.payload;
        // Update configs list
        const index = state.configs.findIndex(
          (config) => config.id === action.payload.id
        );
        if (index >= 0) {
          state.configs[index] = {
            ...state.configs[index],
            active: action.payload.active,
          };
        }
        // Update current config
        if (state.currentConfig?.id === action.payload.id) {
          state.currentConfig = action.payload;
        }
      })
      .addCase(updatePaymentConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle active
      .addCase(togglePaymentConfigActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePaymentConfigActive.fulfilled, (state, action) => {
        state.loading = false;
        // Update configs list
        const index = state.configs.findIndex(
          (config) => config.id === action.payload.configId
        );
        if (index >= 0) {
          state.configs[index].active = action.payload.active;
        }
        // Update config details
        const configDetail =
          state.configDetails[state.configs[index]?.paymentMethod];
        if (configDetail) {
          state.configDetails[state.configs[index].paymentMethod] = {
            ...configDetail,
            active: action.payload.active,
          };
        }
        // Update current config
        if (state.currentConfig?.id === action.payload.configId) {
          state.currentConfig.active = action.payload.active;
        }
      })
      .addCase(togglePaymentConfigActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete config
      .addCase(deletePaymentConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePaymentConfig.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from configs list
        const deletedConfig = state.configs.find(
          (config) => config.id === action.payload
        );
        state.configs = state.configs.filter(
          (config) => config.id !== action.payload
        );
        // Remove from config details
        if (deletedConfig) {
          delete state.configDetails[deletedConfig.paymentMethod];
        }
        // Clear current config if it was the deleted one
        if (state.currentConfig?.id === action.payload) {
          state.currentConfig = null;
        }
      })
      .addCase(deletePaymentConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  openSetupDialog,
  closeSetupDialog,
  setCurrentConfig,
  clearError,
  clearConfigDetails,
} = paymentSlice.actions;

export default paymentSlice.reducer;
