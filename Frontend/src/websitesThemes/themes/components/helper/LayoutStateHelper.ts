import { useState } from "react";

export interface LayoutState {
  selectedCategoryId: string | undefined;
  selectedCategoryName: string;
  selectedProduct: any | null;
  isHomePage: boolean;
  priceRange: [number, number];
  sortBy: string;
  productsPerPage: number;
}

export interface LayoutHandlers {
  handleCategorySelect: (categoryId: string, categoryName: string) => void;
  handleHomeSelect: () => void;
  handleProductClick: (product: any) => void;
  handleBackToProducts: () => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: string) => void;
  setProductsPerPage: (count: number) => void;
}

export const useLayoutState = (
  initialState?: Partial<LayoutState>
): LayoutState & LayoutHandlers => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(initialState?.selectedCategoryId ?? undefined);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    initialState?.selectedCategoryName ?? "All Products"
  );
  const [selectedProduct, setSelectedProduct] = useState<any | null>(
    initialState?.selectedProduct ?? null
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialState?.priceRange ?? [0, 1000000]
  );
  const [sortBy, setSortBy] = useState<string>(
    initialState?.sortBy ?? "popular"
  );
  const [productsPerPage, setProductsPerPage] = useState<number>(
    initialState?.productsPerPage ?? 24
  );

  // Check if we're on the home page based on category selection
  const isHomePage =
    selectedCategoryId === undefined && selectedCategoryName === "All Products";

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    setSelectedProduct(null); // Reset selected product when category changes
  };

  const handleHomeSelect = () => {
    setSelectedCategoryId(undefined);
    setSelectedCategoryName("All Products");
    setSelectedProduct(null); // Reset selected product when going home
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  return {
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
  };
};
