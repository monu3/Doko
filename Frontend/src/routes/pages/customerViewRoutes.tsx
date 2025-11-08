import { BrowserRouter, Route, Routes } from "react-router-dom"
import NotFound from "@/common/components/notFoundPage"
import CustomerDashboard from "@/customerView/pages/customerdashboard"


function CustomerViewRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer View Routes */}
        <Route path="/customerView" element={<CustomerDashboard />} />
        {/* <Route path="/explore" element={<CustomerProductsPage />} />
        <Route path="/products" element={<CustomerProductsPage />} />
        <Route path="/product/:id" element={<CustomerProductDetail />} />
        <Route path="/cart" element={<CustomerCartPage />} />
        <Route path="/wishlist" element={<CustomerWishlistPage />} />
        <Route path="/orders" element={<CustomerOrdersPage />} />
        <Route path="/profile" element={<CustomerProfilePage />} /> */}

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default CustomerViewRoutes
