import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Types
interface MenuItem {
  id: string
  label: string
  href: string
  children?: MenuItem[]
}

interface SocialLinks {
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  youtube?: string
}

interface ThemeState {
  menuItems: MenuItem[]
  footerLinks: MenuItem[]
  socialLinks: SocialLinks
  deliveryTime: string
  paymentMethods: string[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: ThemeState = {
  menuItems: [],
  footerLinks: [],
  socialLinks: {},
  deliveryTime: "3-5 days",
  paymentMethods: ["Cash on delivery"],
  status: "idle",
  error: null,
}

// Async thunks
export const fetchThemeData = createAsyncThunk("theme/fetchThemeData", async (shopId: string) => {
  const response = await axios.get(`/api/shops/${shopId}/theme`)
  return response.data
})

export const updateThemeData = createAsyncThunk(
  "theme/updateThemeData",
  async ({ shopId, data }: { shopId: string; data: Partial<ThemeState> }) => {
    const response = await axios.put(`/api/shops/${shopId}/theme`, data)
    return response.data
  },
)

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // Sync reducers for local state updates
    setMenuItems: (state, action) => {
      state.menuItems = action.payload
    },
    setFooterLinks: (state, action) => {
      state.footerLinks = action.payload
    },
    setSocialLinks: (state, action) => {
      state.socialLinks = action.payload
    },
    setDeliveryTime: (state, action) => {
      state.deliveryTime = action.payload
    },
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch theme data
      .addCase(fetchThemeData.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchThemeData.fulfilled, (state, action) => {
        state.status = "succeeded"
        // Update all theme data
        Object.assign(state, action.payload)
      })
      .addCase(fetchThemeData.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch theme data"
      })
      // Update theme data
      .addCase(updateThemeData.fulfilled, (state, action) => {
        Object.assign(state, action.payload)
      })
  },
})

export const { setFooterLinks, setSocialLinks, setDeliveryTime, setPaymentMethods } = themeSlice.actions

export default themeSlice.reducer

