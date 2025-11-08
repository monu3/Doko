import { lazy} from "react";

const HeaderDefault = lazy(() => import("./components/header"));
import ProductListPage from "./components/productListPage";
import { FooterDefault } from "./components/footer";
import ProductDetailPage from "./components/productDetailPage";
import Hero from "./components/fashion/Hero";
import { useLayoutState } from "@/websitesThemes/themes/components/helper/LayoutStateHelper";

function FashionLayout() {
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
      <HeaderDefault
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

      <FooterDefault />
    </div>
  );
}

export default FashionLayout;
