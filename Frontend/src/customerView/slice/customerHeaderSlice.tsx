import apiWithOutCredentials from "@/apiWithOutCred";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { clearCart } from "./cartSlice";
import { clearWishlist } from "./wishlistSlice";

const API_BASE_URL = "http://localhost:8080";

// Types
export interface CustomerUser {
  id: string;
  email: string;
  verified: boolean;
  role: string;
}

export interface CustomerHeaderState {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  signupStatus: "idle" | "email_sent" | "completed";
  signupLoading: boolean;
  signupError: string | null;
  logoutLoading: boolean;
  logoutError: string | null;
  currentEmail: string | null;
  cartItemsCount: number;
  wishlistItemsCount: number;
  authToken: string | null;
  followedShops: string[]; // Changed from Set<string> to string[]
  followLoading: boolean;
  followError: string | null;
  followedShopsLoading: boolean;
}

// API Types
export interface InitiateSignupRequest {
  email: string;
}

export interface VerifySignupRequest {
  email: string;
  otp: string;
  role: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ApiResponse<T = any> {
  status: string;
  message?: string;
  user?: T;
  customer?: T;
  token?: string;
}

// Add these types after the existing types
export interface FollowShopRequest {
  customerId: string;
  shopId: string;
}

export interface FollowShopResponse {
  id: string;
  customerId: string;
  shopId: string;
  followedAt: string;
}

// Async Thunks
export const initiateSignup = createAsyncThunk(
  "customerHeader/initiateSignup",
  async (data: InitiateSignupRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse>(
        `${API_BASE_URL}/customer/signup`,
        {
          email: data.email,
        }
      );
      if (response.data.status === "success") {
        return {
          email: data.email,
          message: response.data.message || "OTP sent to email",
        };
      } else {
        return rejectWithValue(response.data.message || "Failed to send OTP");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to send OTP";
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifySignup = createAsyncThunk(
  "customerHeader/verifySignup",
  async (data: VerifySignupRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post<ApiResponse<CustomerUser>>(
        `${API_BASE_URL}/customer/signup/verify`,
        {
          email: data.email,
          otp: data.otp,
          role: data.role,
        }
      );

      // Check if the HTTP status is successful (200-299)
      if (response.status >= 200 && response.status < 300) {
        // Check if the response data indicates success
        if (response.data.status === "success") {
          // Extract user data - your backend returns 'customer' not 'user'
          const userData = response.data.customer || response.data.user;
          const token = response.data.token;

          if (userData && (userData.id || userData.email)) {
            // Store user data and auth token in localStorage for persistence
            localStorage.setItem("customerUser", JSON.stringify(userData));
            localStorage.setItem("customerAuth", "true");

            // Store the JWT token
            if (token) {
              localStorage.setItem("authToken", token);
            }

            // Load user's followed shops after successful signup
            if (userData.id) {
              dispatch(loadUserFollowedShops({ customerId: userData.id }));
            }

            return {
              user: userData,
              token: token,
            };
          } else {
            return rejectWithValue("No user data received from server");
          }
        } else {
          return rejectWithValue(
            response.data.message || "Verification failed"
          );
        }
      } else {
        return rejectWithValue("Server error occurred");
      }
    } catch (error: any) {
      // Check if it's actually a successful response that axios is treating as an error
      if (error.response?.status >= 200 && error.response?.status < 300) {
        const responseData = error.response.data;

        if (responseData.status === "success") {
          const userData = responseData.customer || responseData.user;
          const token = responseData.token;

          if (userData) {
            localStorage.setItem("customerUser", JSON.stringify(userData));
            localStorage.setItem("customerAuth", "true");

            if (token) {
              localStorage.setItem("authToken", token);
            }

            // Load user's followed shops after successful signup
            if (userData.id) {
              dispatch(loadUserFollowedShops({ customerId: userData.id }));
            }

            return {
              user: userData,
              token: token,
            };
          }
        }
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to verify OTP";
      return rejectWithValue(errorMessage);
    }
  }
);

export const resendOtp = createAsyncThunk(
  "customerHeader/resendOtp",
  async (data: ResendOtpRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse>(
        `${API_BASE_URL}/customer/signup/resend-otp`,
        {
          email: data.email,
        }
      );
      if (response.data.status === "success") {
        return {
          message: response.data.message || "New OTP sent",
        };
      } else {
        return rejectWithValue(response.data.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend OTP";
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutCustomer = createAsyncThunk(
  "customerHeader/logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        clearUserSession();
        return { message: "Logged out successfully" };
      }
      const response = await axios.post<ApiResponse>(
        `${API_BASE_URL}/customer/logout`,
        {}, // Empty body as your controller expects Map<String, String> but doesn't use it
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === "success") {
        clearUserSession();
        dispatch(clearCart());
        dispatch(clearWishlist());
        return {
          message: response.data.message || "Logged out successfully",
        };
      } else {
        return rejectWithValue(response.data.message || "Failed to logout");
      }
    } catch (error: any) {
      // Even if API call fails, we should still clear local storage
      clearUserSession();

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Logout failed, but clearing local session";
      return rejectWithValue(errorMessage);
    }
  }
);

export const followShop = createAsyncThunk(
  "customerHeader/followShop",
  async (data: { shopId: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const { user, authToken } = state.customerHeader;

      if (!user || !authToken) {
        return rejectWithValue("Please sign in to follow shops");
      }

      const response = await axios.post<FollowShopResponse>(
        `${API_BASE_URL}/follower/follow`,
        {
          customerId: user.id,
          shopId: data.shopId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return {
        shopId: data.shopId,
        followData: response.data,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to follow shop";
      return rejectWithValue(errorMessage);
    }
  }
);

export const unfollowShop = createAsyncThunk(
  "customerHeader/unfollowShop",
  async (data: { shopId: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const { user, authToken } = state.customerHeader;

      if (!user || !authToken) {
        return rejectWithValue("Please sign in to unfollow shops");
      }

      await axios.post(
        `${API_BASE_URL}/follower/unfollow`,
        {
          customerId: user.id,
          shopId: data.shopId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return {
        shopId: data.shopId,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to unfollow shop";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getFollowerCount = createAsyncThunk(
  "customerHeader/getFollowerCount",
  async (data: { shopId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get<number>(
        `${API_BASE_URL}/follower/count?shopId=${data.shopId}`
      );

      return {
        shopId: data.shopId,
        count: response.data,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to get follower count";
      return rejectWithValue(errorMessage);
    }
  }
);

// New thunk to load user's followed shops
export const loadUserFollowedShops = createAsyncThunk(
  "customerHeader/loadUserFollowedShops",
  async (data: { customerId: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const { authToken } = state.customerHeader;

      if (!authToken) {
        return rejectWithValue("Authentication required");
      }

      // You'll need to create this endpoint in your backend
      const response = await axios.get<string[]>(
        `${API_BASE_URL}/follower/customer/${data.customerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load followed shops";
      return rejectWithValue(errorMessage);
    }
  }
);

// New thunk to load cart and wishlist counts
export const loadCartAndWishlistCounts = createAsyncThunk(
  "customerHeader/loadCartAndWishlistCounts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const { authToken } = state.customerHeader;

      if (!authToken) {
        return rejectWithValue("Authentication required");
      }

      const [cartResponse, wishlistResponse] = await Promise.all([
        apiWithOutCredentials.get("/cart/count", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }),
        apiWithOutCredentials.get("/wishlist/count", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }),
      ]);

      // Type assertion for response data
      const cartData = cartResponse.data as { status: string; count: number };
      const wishlistData = wishlistResponse.data as {
        status: string;
        count: number;
      };

      return {
        cartCount: cartData.status === "success" ? cartData.count : 0,
        wishlistCount:
          wishlistData.status === "success" ? wishlistData.count : 0,
      };
    } catch (error: any) {
      // Don't reject, just return zero counts
      return {
        cartCount: 0,
        wishlistCount: 0,
      };
    }
  }
);

// Helper function to clear user session
const clearUserSession = () => {
  localStorage.removeItem("customerUser");
  localStorage.removeItem("customerAuth");
  localStorage.removeItem("authToken");
  localStorage.removeItem("customerCart");
  localStorage.removeItem("customerWishlist");
  // Also clear any other auth-related items
  localStorage.removeItem("refreshToken");
  
  // Clear session storage as well if you use it
  sessionStorage.clear();
};

// Initial State
const initialState: CustomerHeaderState = {
  user: null,
  isAuthenticated: false,
  signupStatus: "idle",
  signupLoading: false,
  signupError: null,
  logoutLoading: false,
  logoutError: null,
  currentEmail: null,
  cartItemsCount: 0,
  wishlistItemsCount: 0,
  authToken: null,
  followedShops: [], // Changed from new Set<string>() to []
  followLoading: false,
  followError: null,
  followedShopsLoading: false,
};

// Load persisted state
const loadPersistedState = (): Partial<CustomerHeaderState> => {
  try {
    const customerAuth = localStorage.getItem("customerAuth");
    const customerUser = localStorage.getItem("customerUser");
    const authToken = localStorage.getItem("authToken");

    if (customerAuth === "true" && customerUser) {
      return {
        isAuthenticated: true,
        user: JSON.parse(customerUser),
        authToken: authToken,
      };
    }
  } catch (error) {}
  return {};
};

// Slice
const customerHeaderSlice = createSlice({
  name: "customerHeader",
  initialState: {
    ...initialState,
    ...loadPersistedState(),
  },
  reducers: {
    resetSignupState: (state) => {
      state.signupStatus = "idle";
      state.signupLoading = false;
      state.signupError = null;
      state.currentEmail = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.signupStatus = "idle";
      state.signupError = null;
      state.logoutError = null;
      state.currentEmail = null;
      state.cartItemsCount = 0;
      state.wishlistItemsCount = 0;
      state.authToken = null;
      state.followedShops = []; // Clear followed shops on logout

      // Clear localStorage
      clearUserSession();
    },
    updateCartCount: (state, action: PayloadAction<number>) => {
      state.cartItemsCount = action.payload;
    },
    updateWishlistCount: (state, action: PayloadAction<number>) => {
      state.wishlistItemsCount = action.payload;
    },
    clearError: (state) => {
      state.signupError = null;
      state.logoutError = null;
    },
    clearFollowError: (state) => {
      state.followError = null;
    },
    setFollowedShops: (state, action: PayloadAction<string[]>) => {
      state.followedShops = action.payload; // No need to convert to Set
    },
    // Action to trigger loading followed shops when user is already authenticated
    initializeUserData: () => {
      // This will be handled by the component
    },
  },
  extraReducers: (builder) => {
    // Initiate Signup
    builder
      .addCase(initiateSignup.pending, (state) => {
        state.signupLoading = true;
        state.signupError = null;
      })
      .addCase(initiateSignup.fulfilled, (state, action) => {
        state.signupLoading = false;
        state.signupStatus = "email_sent";
        state.currentEmail = action.payload.email;
        state.signupError = null;
      })
      .addCase(initiateSignup.rejected, (state, action) => {
        state.signupLoading = false;
        state.signupError = action.payload as string;
      });

    // Verify Signup
    builder
      .addCase(verifySignup.pending, (state) => {
        state.signupLoading = true;
        state.signupError = null;
      })
      .addCase(verifySignup.fulfilled, (state, action) => {
        state.signupLoading = false;
        state.signupStatus = "completed";
        state.user = action.payload.user;
        state.authToken = action.payload.token;
        state.isAuthenticated = true;
        state.signupError = null;
      })
      .addCase(verifySignup.rejected, (state, action) => {
        state.signupLoading = false;
        state.signupError = action.payload as string;
      });

    // Resend OTP
    builder
      .addCase(resendOtp.pending, (state) => {
        state.signupLoading = true;
        state.signupError = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.signupLoading = false;
        state.signupError = null;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.signupLoading = false;
        state.signupError = action.payload as string;
      });

    // Logout Customer
    builder
      .addCase(logoutCustomer.pending, (state) => {
        state.logoutLoading = true;
        state.logoutError = null;
      })
      .addCase(logoutCustomer.fulfilled, (state) => {
        state.logoutLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.signupStatus = "idle";
        state.signupError = null;
        state.logoutError = null;
        state.currentEmail = null;
        state.cartItemsCount = 0;
        state.wishlistItemsCount = 0;
        state.authToken = null;
        state.followedShops = []; // Clear followed shops

        // Clear localStorage
        clearUserSession();
      })
      .addCase(logoutCustomer.rejected, (state, action) => {
        state.logoutLoading = false;
        state.logoutError = action.payload as string;
        // Even if logout API fails, clear local state
        state.user = null;
        state.isAuthenticated = false;
        state.signupStatus = "idle";
        state.signupError = null;
        state.currentEmail = null;
        state.cartItemsCount = 0;
        state.wishlistItemsCount = 0;
        state.authToken = null;
        state.followedShops = []; // Clear followed shops

        // Clear localStorage anyway
        clearUserSession();
      });

    // Follow Shop
    builder
      .addCase(followShop.pending, (state) => {
        state.followLoading = true;
        state.followError = null;
      })
      .addCase(followShop.fulfilled, (state, action) => {
        state.followLoading = false;
        if (!state.followedShops.includes(action.payload.shopId)) {
          state.followedShops.push(action.payload.shopId);
        }
        state.followError = null;
      })
      .addCase(followShop.rejected, (state, action) => {
        state.followLoading = false;
        state.followError = action.payload as string;
      });

    // Unfollow Shop
    builder
      .addCase(unfollowShop.pending, (state) => {
        state.followLoading = true;
        state.followError = null;
      })
      .addCase(unfollowShop.fulfilled, (state, action) => {
        state.followLoading = false;
        state.followedShops = state.followedShops.filter(
          (id) => id !== action.payload.shopId
        );
        state.followError = null;
      })
      .addCase(unfollowShop.rejected, (state, action) => {
        state.followLoading = false;
        state.followError = action.payload as string;
      });

    // Load User Followed Shops
    builder
      .addCase(loadUserFollowedShops.pending, (state) => {
        state.followedShopsLoading = true;
        state.followError = null;
      })
      .addCase(loadUserFollowedShops.fulfilled, (state, action) => {
        state.followedShopsLoading = false;
        state.followedShops = action.payload;
        state.followError = null;
      })
      .addCase(loadUserFollowedShops.rejected, (state, action) => {
        state.followedShopsLoading = false;
        state.followError = action.payload as string;
      });

    // Load Cart and Wishlist Counts
    builder.addCase(loadCartAndWishlistCounts.fulfilled, (state, action) => {
      state.cartItemsCount = action.payload.cartCount;
      state.wishlistItemsCount = action.payload.wishlistCount;
    });
  },
});

export const {
  resetSignupState,
  logout,
  updateCartCount,
  updateWishlistCount,
  clearError,
  clearFollowError,
  setFollowedShops,
  initializeUserData,
} = customerHeaderSlice.actions;

export default customerHeaderSlice.reducer;
