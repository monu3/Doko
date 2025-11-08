// src/product/hooks/useProducts.ts
import { createMultiEntityHook } from "@/websitesThemes/hooks/createMultiEntityHook";
import {
  fetchProductsByCategoryId,
  fetchProductById,
  fetchProductsByShopId,
} from "@/product/slice/productSlice";
import { RootState } from "@/store";

// Build the hook using your product thunks
export const useProducts = createMultiEntityHook<
  RootState["product"], // slice type
  any // returned data (flexible)
>(
  "product",
  {
    shopThunk: fetchProductsByShopId,
    categoryThunk: fetchProductsByCategoryId,
    singleThunk: fetchProductById,
  },
  (slice) => ({
    products: slice.products,
    product: slice.product,
    productsByCategory: slice.productsByCategory,
  })
);
