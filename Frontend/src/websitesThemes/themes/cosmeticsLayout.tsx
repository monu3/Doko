import { lazy } from "react";

const Header = lazy(
  () => import("@/websitesThemes/themes/components/cosmeticsShop/header")
);
import ProductListPage from "./components/productListPage";
import ProductDetailPage from "./components/productDetailPage";
import Hero from "@/websitesThemes/themes/components/cosmeticsShop/hero";
import Footer from "@/websitesThemes/themes/components/cosmeticsShop/footer";
import { useLayoutState } from "@/websitesThemes/themes/components/helper/LayoutStateHelper";

function CosmeticsLayout() {
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
    <div>
      <Header
        onCategorySelect={handleCategorySelect}
        onHomeSelect={handleHomeSelect}
        selectedCategory={selectedCategoryId}
      />

      {/* Conditionally render Hero section only on home page */}
      {isHomePage && <Hero />}
      {selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          onBack={handleBackToProducts}
        />
      ) : (
        <ProductListPage
          selectedCategoryId={selectedCategoryId}
          selectedCategoryName={selectedCategoryName}
          onProductClick={handleProductClick}
          // Pass filter states as props
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          productsPerPage={productsPerPage}
          setProductsPerPage={setProductsPerPage}
          isHomePage={isHomePage} // Pass isHomePage as prop
        />
      )}

      <Footer />
    </div>
  );
}

export default CosmeticsLayout;
