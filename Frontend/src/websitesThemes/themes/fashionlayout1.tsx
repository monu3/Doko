"use client";

import Hero from "./components/fashion/Hero";
import "./components/fashion/FashionCSS.css";
import Header from "./components/fashion/Header";
import Footer from "./components/fashion/Footer";
import { Toaster } from "@/components/ui/toaster";
import ProductDetailPage from "./components/productDetailPage";
import ProductListPage from "./components/productListPage";
import { useLayoutState } from "@/websitesThemes/themes/components/helper/LayoutStateHelper";

function FashionLayout1() {
  const {
      selectedCategoryId,
      selectedCategoryName,
      selectedProduct,
      isHomePage,
      priceRange,
      sortBy,
      productsPerPage,
      handleCategorySelect,
      handleHomeSelect,
      handleProductClick,
      handleBackToProducts,
      setPriceRange,
      setSortBy,
      setProductsPerPage,
    } = useLayoutState();

  return (
    <div className="App bg-mesh-luxury min-h-screen flex flex-col">
      <Header
        onCategorySelect={handleCategorySelect}
        onHomeSelect={handleHomeSelect}
        selectedCategory={selectedCategoryId}
      />

      {isHomePage && <Hero />}
      <main className="flex-1">
        {selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={handleBackToProducts}
          />
        ) : (
          <>
            <ProductListPage
              selectedCategoryId={selectedCategoryId}
              selectedCategoryName={selectedCategoryName}
              onProductClick={handleProductClick}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              productsPerPage={productsPerPage}
              setProductsPerPage={setProductsPerPage}
              isHomePage={isHomePage} // Pass isHomePage as prop
            />
          </>
        )}
      </main>

      <Footer />

      <Toaster />
    </div>
  );
}

export default FashionLayout1;
