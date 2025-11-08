export interface Category {
  id: string;
  name: string;
  categoryUrl: string;
  bannerUrl: string;
  description: string;
  deleted: boolean;
  createdAt: string;
  active: boolean;
  shopId: string; // ADDED: shopId field so the backend receives it.
  productCount: number;
}

// Cache entry interface
export interface CategoryCacheEntry {
  data: Category;
  timestamp: number;
}
export interface CategoryFormData {
  name: string;
  image: string;
  banner?: string;
  description: string;
  isSubcategory: boolean;
  parentCategory?: string;
  status: boolean;
}
// Define the state interface for category-related state
export interface CategoryState {
  categories: Category[];
  selectedCategory?: Category | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  updateStatusLoading: Record<string, boolean>; // Track loading state for individual status updates
  lastFetched: number | null; // Timestamp of the last successful fetch
  cache: Record<string, CategoryCacheEntry>; // Cache for individual categories by ID
}
