// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/auth/slice/authSlice";
import shopReducer from "@/shop/slice/shopSlice";
import categoryReducer from "@/category/slice/categorySlice";
import productReducer from "@/product/slice/productSlice";
import imageReducer from "@/images/slice/imageSlice";
import themeReducer from "@/websitesThemes/slice/themeSlice";
import settingsReducer from "@/setting/slice/settingSlice";
import customerHeaderReducer from "@/customerView/slice/customerHeaderSlice";
import shopGalleryReducer from "@/customerView/slice/shopGallerySlice";
import cartReducer from "@/customerView/slice/cartSlice";
import wishlistReducer from "@/customerView/slice/wishlistSlice";
import ordersReducer from "@/orders/slice/orderSlice";
import paymentReducer from "@/setting/slice/paymentSlice";
// ... import other reducers as needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    shop: shopReducer,
    category: categoryReducer,
    product: productReducer,
    orders: ordersReducer,
    image: imageReducer,
    theme: themeReducer,
    settings: settingsReducer,
    customerHeader: customerHeaderReducer,
    shopGallery: shopGalleryReducer, // Assuming shopGallery is similar to customerHeader
    cart: cartReducer, // Cart slice for managing shopping cart state
    wishlist: wishlistReducer, // Wishlist slice for managing wishlist state
    // other slices (e.g., shop, product) can go here
    payment: paymentReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
