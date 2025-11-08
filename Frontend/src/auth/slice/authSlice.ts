// src/auth/slice/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";
import { RootState } from "@/store";
import { AuthState } from "../types";

// Initialize the state
const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  ownerId: null, // Initialize ownerId as null
  status: "idle",
  error: null,
  fieldErrors: null,
};

/**
 * Helper to parse backend validation errors.
 */
const parseValidationErrors = (errorData: any): string => {
  if (errorData?.errors) {
    return Object.entries(errorData.errors)
      .map(([field, message]) => `${field}: ${message}`)
      .join(", ");
  }
  return errorData?.message || "An error occurred";
};

/**
 * Thunk for registering a new shop user.
 * Assumes the backend returns a success message.
 */
export const registerUser = createAsyncThunk<
  string, // Returned data: a success message from the backend.
  { email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async (payload, { rejectWithValue }) => {
  try {
    // Call the /auth/register endpoint with email and password.
    const response = await api.post<{ message: string }>(
      "/auth/register",
      payload
    );
    return response.data.message;
  } catch (error: any) {
    // const message = error.response?.data?.message || "Registration failed";
    // return rejectWithValue(message);
    // Check if backend returned validation errors
    if (error.response?.data) {
      const errorMessage = parseValidationErrors(error.response.data);
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue("Registration failed");
  }
});

export const verifyOtp = createAsyncThunk<
  { token: string; ownerId: string }, // Return both token and ownerId
  { email: string; otp: string },
  { rejectValue: string }
>("auth/verifyOtp", async (payload, { rejectWithValue, dispatch }) => {
  try {
    // 1. Verify OTP and get token
    const otpResponse = await api.post<{ token: string }>(
      "/auth/verify-otp",
      payload
    );

    if (!otpResponse.data?.token) {
      return rejectWithValue("Invalid token received");
    }

    // 2. Immediately fetch ownerId using the new token
    const ownerResponse = await dispatch(fetchOwnerId()).unwrap();

    return {
      token: otpResponse.data.token,
      ownerId: ownerResponse,
    };
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "OTP Verification Failed");
  }
});

export const fetchOwnerId = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("auth/fetchOwnerId", async (_, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState() as RootState;
    if (auth.ownerId) return auth.ownerId; // Skip if already exists

    const response = await api.get<string>("/auth/getOwnerId", {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch Owner ID");
  }
});

// Thunk for logging in (subsequent login)
export const loginUser = createAsyncThunk<
  string,
  { email: string; password: string },
  {
    rejectValue: any;
  }
>("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<{ token: string }>("/auth/login", payload);
    // In your current implementation, the token is set as a cookie.
    // Optionally, you can also return the token in the response body.
    return response.data.token;
  } catch (error: any) {
    //     return rejectWithValue(error.response.data);
    if (error.response?.data) {
      // const errorMessage = parseValidationErrors(error.response.data);
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Login failed" });
  }
  //   }
});

// **Thunk for logging out (async)**
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

// Check authentication status
export const checkAuth = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>("auth/checkAuth", async (_, { rejectWithValue }) => {
  console.log("Dispatching checkAuth()..."); // ✅ Debug log
  try {
    await api.get("/auth/check-auth"); // Calls backend API
    return true;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Authentication failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // For logging out, clear the token
    resetAuthState(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.ownerId = null;
      state.status = "idle";
      state.error = null;
      state.fieldErrors = null;
    },
    setAuthCredentials: (
      state,
      action: PayloadAction<{ token: string; ownerId: string }>
    ) => {
      state.token = action.payload.token;
      state.ownerId = action.payload.ownerId;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // registerUser cases
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        // Registration doesn't return a token, so we don't update `token` here.
        // You might store the registration success message if needed.
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      })

      // OTP Verification cases
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(
        verifyOtp.fulfilled,
        (state, action: PayloadAction<{ token: string; ownerId: string }>) => {
          state.token = action.payload.token;
          state.ownerId = action.payload.ownerId;
          state.isAuthenticated = true;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
          ? action.payload
          : "OTP Verification failed";
      })

      //to fetch the ownerID
      .addCase(fetchOwnerId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchOwnerId.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.ownerId = action.payload; // Store the ownerId
        }
      )
      .addCase(fetchOwnerId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch Owner ID";
      })

      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.token = action.payload;
        state.isAuthenticated = true;
        state.fieldErrors = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        // state.error = action.payload ? action.payload : "Login failed";
        if (action.payload && typeof action.payload === "object") {
          state.error = action.payload.message || "Login failed";
          state.fieldErrors = action.payload.errors || null;
        } else {
          state.error = action.payload || "Login failed";
          state.fieldErrors = null;
        }
      })

      // Check authentication
      .addCase(checkAuth.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
      })

      // **Logout cases**
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.ownerId = null; // Clear ownerId on logout
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
