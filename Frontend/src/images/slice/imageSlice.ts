// src/image/slice/imageSlice.ts (updated)
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";

export interface ImageUploadOptions {
  folder?: string;
  transformations?: Record<string, any>;
}

export interface ImageState {
  imageUrl: string | null;
  imageUrls: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  uploadProgress: number;
  currentUpload: {
    fileName: string;
    progress: number;
  } | null;
}

const initialState: ImageState = {
  imageUrl: null,
  imageUrls: [],
  status: "idle",
  error: null,
  uploadProgress: 0,
  currentUpload: null,
};

export const uploadImage = createAsyncThunk<
  string,
  { file: File; options?: ImageUploadOptions },
  { rejectValue: string }
>("image/uploadImage", async ({ file, options }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    if (options?.folder) {
      formData.append("folder", options.folder);
    }

    const response = await api.post<{
      success: boolean;
      url: string;
      message: string;
    }>("/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    if (!response.data.success) {
      return rejectWithValue(response.data.message || "Upload failed");
    }

    return response.data.url;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Image upload failed"
    );
  }
});

export const uploadMultipleImages = createAsyncThunk<
  string[],
  { files: File[]; options?: ImageUploadOptions },
  { rejectValue: string }
>(
  "image/uploadMultipleImages",
  async ({ files, options }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      if (options?.folder) {
        formData.append("folder", options.folder);
      }

      const response = await api.post<{
        success: boolean;
        urls: string[];
        errors: string[];
        uploadedCount: number;
        failedCount: number;
      }>("/images/upload-multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (
        !response.data.success &&
        response.data.failedCount === files.length
      ) {
        const errorMessage =
          response.data.errors?.join(", ") || "Upload failed";
        return rejectWithValue(errorMessage);
      }

      return response.data.urls || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Multiple image upload failed"
      );
    }
  }
);

// Add delete image functionality
export const deleteImage = createAsyncThunk<
  boolean,
  { imageUrl: string },
  { rejectValue: string }
>("image/deleteImage", async ({ imageUrl }, { rejectWithValue }) => {
  try {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>("/images/delete", {
      params: { url: imageUrl },
      withCredentials: true,
    });

    if (!response.data.success) {
      return rejectWithValue(response.data.message || "Delete failed");
    }

    return true;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || "Image deletion failed"
    );
  }
});

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    clearImage(state) {
      state.imageUrl = null;
      state.imageUrls = [];
      state.status = "idle";
      state.error = null;
      state.uploadProgress = 0;
      state.currentUpload = null;
    },
    setImageUrl(state, action: PayloadAction<string>) {
      state.imageUrl = action.payload;
    },
    addImageUrl(state, action: PayloadAction<string>) {
      state.imageUrls.push(action.payload);
    },
    removeImageUrl(state, action: PayloadAction<string>) {
      state.imageUrls = state.imageUrls.filter((url) => url !== action.payload);
    },
    clearError(state) {
      state.error = null;
    },
    setUploadProgress(state, action: PayloadAction<number>) {
      state.uploadProgress = action.payload;
    },
    setCurrentUpload(
      state,
      action: PayloadAction<{ fileName: string; progress: number } | null>
    ) {
      state.currentUpload = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Single image upload
      .addCase(uploadImage.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(
        uploadImage.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.imageUrl = action.payload;
          state.imageUrls.push(action.payload);
          state.error = null;
          state.uploadProgress = 100;
          state.currentUpload = null;
        }
      )
      .addCase(uploadImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to upload image";
        state.uploadProgress = 0;
        state.currentUpload = null;
      })
      // Multiple image upload
      .addCase(uploadMultipleImages.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(
        uploadMultipleImages.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.status = "succeeded";
          state.imageUrls = [...state.imageUrls, ...action.payload];
          state.error = null;
          state.uploadProgress = 100;
          state.currentUpload = null;
        }
      )
      .addCase(uploadMultipleImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to upload images";
        state.uploadProgress = 0;
        state.currentUpload = null;
      })
      // Delete image
      .addCase(
        deleteImage.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          if (action.payload) {
            // Image URL is removed in the component, not here
            state.error = null;
          }
        }
      )
      .addCase(deleteImage.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete image";
      });
  },
});

export const {
  clearImage,
  setImageUrl,
  addImageUrl,
  removeImageUrl,
  clearError,
  setUploadProgress,
  setCurrentUpload,
} = imageSlice.actions;

export default imageSlice.reducer;
