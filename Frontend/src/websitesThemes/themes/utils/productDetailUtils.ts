// src/websitesThemes/themes/utils/productDetailUtils.ts
import {
  Product,
  ProductVariantData,
  parseVariantData,
} from "@/product/types/product";

export interface ProductDetailUtils {
  getProductImages: (product: Product) => string[];
  generateVariants: (product: Product) => { [key: string]: string[] };
  calculateDiscount: (product: Product) => {
    hasDiscount: boolean;
    discountPercentage: number;
  };
  parseVariantData: (
    variantData: string | null | undefined
  ) => ProductVariantData;
  handleVariantSelect: (
    setSelectedVariants: React.Dispatch<
      React.SetStateAction<{ [key: string]: string }>
    >,
    variantType: string,
    value: string
  ) => void;
  isWishlistActionLoading: (
    productId: string,
    isAddingToWishlist: (id: string) => boolean,
    isRemovingFromWishlist: (id: string) => boolean
  ) => boolean;
}

export const productDetailUtils: ProductDetailUtils = {
  // Helper function to get product images
  getProductImages: (product: Product) => {
    const images: string[] = [];

    // Add main image first
    if (product.imageUrl) {
      images.push(product.imageUrl);
    }

    // Add additional images
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      images.push(...product.images);
    }

    return images.length > 0
      ? images
      : ["/placeholder.svg?height=400&width=400"];
  },

  // Generate variants from real data only
  generateVariants: (product: Product) => {
    const variants: { [key: string]: string[] } = {};

    // Parse real variant data using your existing parseVariantData function
    if (product.variantData) {
      try {
        const parsedVariants = parseVariantData(product.variantData);
        parsedVariants.variants.forEach((variant) => {
          if (variant.name && variant.values && Array.isArray(variant.values)) {
            variants[variant.name] = variant.values;
          }
        });
      } catch (error) {
        console.warn("Failed to parse variant data:", error);
      }
    }

    return variants;
  },

  // Parse variant data using your existing function
  parseVariantData: (
    variantData: string | null | undefined
  ): ProductVariantData => {
    return parseVariantData(variantData);
  },

  // Handle variant selection
  handleVariantSelect: (
    setSelectedVariants: React.Dispatch<
      React.SetStateAction<{ [key: string]: string }>
    >,
    variantType: string,
    value: string
  ) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantType]: value,
    }));
  },

  // Calculate discount information using actual discount fields
  calculateDiscount: (product: Product) => {
    const hasDiscount =
      product.discountPrice &&
      product.price &&
      product.discountPrice > product.price;

    // Use provided discountPercentage or calculate it
    let discountPercentage = product.discountPercentage || 0;

    if (hasDiscount && !discountPercentage) {
      discountPercentage = Math.round(
        ((product.discountPrice - product.price) / product.discountPrice) * 100
      );
    }

    return {
      hasDiscount: hasDiscount || discountPercentage > 0,
      discountPercentage: Math.round(discountPercentage),
    };
  },

  // Helper function to check if wishlist is loading for this product
  isWishlistActionLoading: (
    productId: string,
    isAddingToWishlist: (id: string) => boolean,
    isRemovingFromWishlist: (id: string) => boolean
  ) => {
    return isAddingToWishlist(productId) || isRemovingFromWishlist(productId);
  },
};
