"use client";

import CustomerFooter from "../components/customerFooter";
import CustomerHeader from "../components/customerHeader";
import CustomerHero from "../components/customerHero";
import ShopGalleryPage from "../components/shopGalleryPage";
import { useState } from "react";
// import CartSidebar from "../components/cartSidebar";
import CustomerCartPage from "../components/cartPage";

export default function CustomerDashboard() {
  const [signupDialogOpen, setSignupDialogOpen] = useState(false);

  const [currentView, setCurrentView] = useState<
    "home" | "cart" | "product-detail"
  >("home");

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
