
export interface HeaderProps {
  onCategorySelect?: (categoryId: string, categoryName: string) => void;
  onHomeSelect?: () => void;
  selectedCategory?: string;
}

export interface ProductCatalogProps {
  selectedCategoryId?: string;
  selectedCategoryName?: string;
  onProductClick?: (product: any) => void;
  priceRange: number[];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  productsPerPage: number;
  setProductsPerPage: (count: number) => void;
  isHomePage: boolean;

}

export interface ProductDetailPageProps {
  product: any;
  onBack: () => void;
}