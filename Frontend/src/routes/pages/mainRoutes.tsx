import { BrowserRouter, Route, Routes } from "react-router-dom";
import OrdersPage from "@/orders/pages/orders";
import Page from "@/common/components/page";
import ProductsPage from "@/product/pages/product";
import Audience from "@/audience/pages/audience";
import ThemePage from "@/appearance/pages/theme";
import Setting from "@/setting/pages/setting";
import AddProductPage from "@/product/pages/addProductForm";
import EditProductPage from "@/product/pages/editProductForm";
import CategoriesPage from "@/category/pages/category";
import AddCategoryPage from "@/category/pages/addCategoryForm";
import EditCategoryPage from "@/category/pages/editCategoryForm";
import LoginPageDisplay from "@/auth/pages/loginPage";
import RegisterPageDisplay from "@/auth/pages/registerPage";
import OTPPageDisplay from "@/auth/pages/otpPage";
import ProtectedRoute from "@/routes/components/ProtectedRoute";
import LoginRouteGuard from "@/routes/components/LoginRouteGuard";
import NotFound from "@/common/components/notFoundPage";
import { ShopDetailsPage } from "@/shop/pages/shopDetailPage";
import PagesPage from "@/appearance/pages/pages";
import AddPagePage from "@/appearance/components/page/AddPagesForm";
import MenusPage from "@/appearance/pages/menus";
import BlogsPage from "@/appearance/pages/blog";
import AddBlogPage from "@/appearance/components/blog/addBlogForm";
import MediaPage from "@/appearance/pages/media";
import { UploadDialog } from "@/appearance/components/media/addMediaForm";
import { ShopPublicPage } from "@/websitesThemes/themes/pages/shopPublicPage";
import LandingPage from "@/landingPage/landingPage";
import CustomerDashboard from "@/customerView/pages/customerdashboard";
import Dashboard from "@/dashboard/pages/dashboard";

function MainRoutes() {
  // const url="www.google.com"
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/customerView" element={<CustomerDashboard />} />
        <Route path="/register" element={<RegisterPageDisplay />} />
        <Route path="/shop/:shopUrl" element={<ShopPublicPage />} />

        <Route
          path="/login"
          element={
            <LoginRouteGuard>
              <LoginPageDisplay />
            </LoginRouteGuard>
          }
        />
        <Route path="/verify-otp" element={<OTPPageDisplay />} />
        <Route path="/shop-details" element={<ShopDetailsPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Page />}>
            <Route index element={<Dashboard />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/add" element={<AddProductPage />} />
            <Route path="/products/edit/:id" element={<EditProductPage />} />
            <Route path="/products/categories" element={<CategoriesPage />} />
            <Route
              path="/products/categories/add"
              element={<AddCategoryPage />}
            />
            <Route
              path="/products/categories/edit/:id"
              element={<EditCategoryPage />}
            />
            {/* <Route path="/analytics" element={<Analytics />} /> */}
            {/* <Route path="/payments" element={<Payment />} /> */}
            {/* <Route path="/discounts" element={<Discounts />} /> */}
            <Route path="/audience" element={<Audience />} />
            <Route path="/appearance" element={<ThemePage />} />
            <Route path="/appearance/pages" element={<PagesPage />} />
            <Route path="pages/add" element={<AddPagePage />} />
            <Route path="/appearance/menus" element={<MenusPage />} />
            <Route path="/appearance/blog" element={<BlogsPage />} />
            <Route path="blogs/add" element={<AddBlogPage />} />
            <Route path="/appearance/media" element={<MediaPage />} />
            <Route path="media/add" element={<UploadDialog />} />
            <Route path="/settings" element={<Setting />} />
            {/* <Route path="/:url" element={<FashionLayout />} /> */}
          </Route>

          {/* Shop Public View */}
        </Route>

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
