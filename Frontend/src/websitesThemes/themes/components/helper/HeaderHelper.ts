import { useState } from "react";
import { useShop } from "@/hooks/useShop";
import { useCategory } from "@/hooks/useCategory";

export interface HeaderData {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  shop: ReturnType<typeof useShop>["shop"];
  categories: ReturnType<typeof useCategory>["categories"];
  activeCategories: any[];
  visibleCategories: any[];
  dropdownCategories: any[];
}

export interface HeaderHandlers {
  handleCategoryClick: (
    categoryId: string,
    categoryName: string,
    onCategorySelect?: (categoryId: string, categoryName: string) => void
  ) => void;
  handleHomeClick: (onHomeSelect?: () => void) => void;
}

export const useHeaderData = (): HeaderData => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { categories } = useCategory();
  const { shop } = useShop();

  // Filter only active categories
  const activeCategories =
    categories?.filter((category) => category.active) || [];

  // Split categories into visible (first 3) and dropdown (rest)
  const visibleCategories = activeCategories.slice(0, 3);
  const dropdownCategories = activeCategories.slice(3);

  return {
    isMenuOpen,
    setIsMenuOpen,
    searchQuery,
    setSearchQuery,
    shop,
    categories,
    activeCategories,
    visibleCategories,
    dropdownCategories,
  };
};

export const useHeaderHandlers = (): HeaderHandlers => {
  const handleCategoryClick = (
    categoryId: string,
    categoryName: string,
    onCategorySelect?: (categoryId: string, categoryName: string) => void
  ) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId, categoryName);
    }
  };

  const handleHomeClick = (onHomeSelect?: () => void) => {
    if (onHomeSelect) {
      onHomeSelect();
    }
  };

  return {
    handleCategoryClick,
    handleHomeClick,
  };
};
