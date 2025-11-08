// src/websitesThemes/hooks/useProductDetail.ts
import { useCallback } from "react";
import { productDetailUtils } from "@/websitesThemes/themes/utils/productDetailUtils";

export const useProductDetail = () => {
  // Handler for variant selection
  const handleVariantSelect = useCallback(
    (
      setSelectedVariants: React.Dispatch<
        React.SetStateAction<Record<string, string>>
      >,
      variantType: string,
      option: string
    ) => {
      setSelectedVariants((prev) => {
        if (prev[variantType] === option) {
          const newVariants = { ...prev };
          delete newVariants[variantType];
          return newVariants;
        }
        return {
          ...prev,
          [variantType]: option,
        };
      });
    },
    []
  );

  // Handler for wishlist action loading check
  const isWishlistActionLoading = useCallback(
    (
      productId: string,
      isAddingToWishlist: (id: string) => boolean,
      isRemovingFromWishlist: (id: string) => boolean
    ) => {
      return isAddingToWishlist(productId) || isRemovingFromWishlist(productId);
    },
    []
  );

  return {
    ...productDetailUtils,
    handleVariantSelect,
    isWishlistActionLoading,
  };
};
