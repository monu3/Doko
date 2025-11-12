"use client";

import CustomerFooter from "../components/customerFooter";
import CustomerHeader from "../components/customerHeader";
import CustomerHero from "../components/customerHero";
import ShopGalleryPage from "../components/shopGalleryPage";
import { useState, useEffect } from "react";
// import CartSidebar from "../components/cartSidebar";
import CustomerCartPage from "../components/cartPage";

export default function CustomerDashboard() {
  const [signupDialogOpen, setSignupDialogOpen] = useState(false);

  const [currentView, setCurrentView] = useState<
    "home" | "cart" | "product-detail"
  >("home");

  // Check for payment status in URL and show cart if returning from payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("paymentStatus");
    const orderId = urlParams.get("orderId");

    if (paymentStatus && orderId) {
      // User is returning from payment gateway - show cart which will show checkout confirmation
      console.log("Payment return detected, showing cart view");
      setCurrentView("cart");

      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleSignupRequired = () => {
    setSignupDialogOpen(true);
  };

  const handleCartClick = () => {
    setCurrentView("cart");
  };

  const handleHomeSelect = () => {
    setCurrentView("home");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "cart":
        return <CustomerCartPage onBack={handleBackToHome} />;

      case "home":
      default:
        return (
          <>
            <main className="pt-3">
              <CustomerHero />
              {/* Shop Gallery Section */}
              <ShopGalleryPage onSignupRequired={handleSignupRequired} />
            </main>
            <CustomerFooter />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader
        onCartClick={handleCartClick}
        onHomeSelect={handleHomeSelect}
        signupDialogOpen={signupDialogOpen}
        onSignupDialogChange={setSignupDialogOpen}
      />

      {renderCurrentView()}

      {/* Pass product click handler to wishlist sidebar
      <WishlistSidebar onProductClick={handleProductClick} /> */}
    </div>
  );
}
