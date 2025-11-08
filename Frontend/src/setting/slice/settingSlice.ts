import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import api from "../../api"
import type { RootState } from "@/store"

// Define the SocialAccount interface based on your API
export interface SocialAccount {
  id?: string
  shopId: string
  supportEmail: string
  supportPhone: string
  facebookLink?: string
  tiktokLink?: string
  instagramLink?: string
  youtubeLink?: string
}

// Define the state interface for settings-related state
export interface SettingsState {
  socialAccount?: SocialAccount
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

// Initialize the settings slice state
const initialState: SettingsState = {
  socialAccount: undefined,
  status: "idle",
  error: null,
}

/**
 * Thunk for creating a social account.
 * - Endpoint: POST /socialAccount/{shopId}
 * - Payload: shopId and socialAccountDTO
 */
export const createSocialAccount = createAsyncThunk<
  SocialAccount,
  {
    shopId: string
    socialAccountData: Omit<SocialAccount, "id" | "shopId">
  },
  { rejectValue: string }
>("settings/createSocialAccount", async ({ shopId, socialAccountData }, { rejectWithValue }) => {
  try {
    const response = await api.post<SocialAccount>(`/socialAccount/${shopId}`, socialAccountData, {
      withCredentials: true,
    })
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create social account")
  }
})

/**
 * Thunk for fetching a social account by shopId.
 * - Endpoint: GET /socialAccount/{shopId}
 * - Parameter: shopId (as string)
 */
export const getSocialAccount = createAsyncThunk<
  SocialAccount,
  string,
  {
    rejectValue: string
    condition: (shopId: string, { getState }: { getState: () => RootState }) => boolean
  }
>(
  "settings/getSocialAccount",
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await api.get<SocialAccount>(`/socialAccount/${shopId}`, {
        withCredentials: true,
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch social account")
    }
  },
  {
    condition: (shopId, { getState }) => {
      const { settings } = getState() as { settings: SettingsState }
      const existingSocialAccount = settings.socialAccount

      // Don't fetch if:
      // 1. Already loading
      // 2. Already have social account data for this shop
      return !(settings.status === "loading" || (existingSocialAccount && existingSocialAccount.shopId === shopId))
    },
  },
)

/**
 * Thunk for updating a social account.
 * - Endpoint: PUT /socialAccount/{shopId}
 * - Payload: shopId and socialAccountDTO
 */
export const updateSocialAccount = createAsyncThunk<
  SocialAccount,
  {
    shopId: string
    socialAccountData: Omit<SocialAccount, "id" | "shopId">
  },
  { rejectValue: string }
>("settings/updateSocialAccount", async ({ shopId, socialAccountData }, { rejectWithValue }) => {
  try {
    const response = await api.put<SocialAccount>(`/socialAccount/${shopId}`, socialAccountData, {
      withCredentials: true,
    })
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update social account")
  }
})

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // Reducer to reset settings state (if needed)
    resetSettingsState(state) {
      state.socialAccount = undefined
      state.status = "idle"
      state.error = null
    },
    // Reducer to update local social account data
    updateLocalSocialAccount(state, action: PayloadAction<Partial<SocialAccount>>) {
      if (state.socialAccount) {
        state.socialAccount = { ...state.socialAccount, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling createSocialAccount thunk states
      .addCase(createSocialAccount.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(createSocialAccount.fulfilled, (state, action: PayloadAction<SocialAccount>) => {
        state.status = "succeeded"
        state.socialAccount = action.payload
      })
      .addCase(createSocialAccount.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || "Failed to create social account"
      })

      // Handling getSocialAccount thunk states
      .addCase(getSocialAccount.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(getSocialAccount.fulfilled, (state, action: PayloadAction<SocialAccount>) => {
        state.status = "succeeded"
        state.socialAccount = action.payload
      })
      .addCase(getSocialAccount.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || "Failed to fetch social account"
      })

      // Handling updateSocialAccount thunk states
      .addCase(updateSocialAccount.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(updateSocialAccount.fulfilled, (state, action: PayloadAction<SocialAccount>) => {
        state.status = "succeeded"
        state.socialAccount = action.payload
      })
      .addCase(updateSocialAccount.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || "Failed to update social account"
      })
  },
})

export const { resetSettingsState, updateLocalSocialAccount } = settingsSlice.actions
export default settingsSlice.reducer
