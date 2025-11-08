// src/websitesThemes/themes/utils/productListUtils.ts
import {
  Product,
  VariantOption,
} from "@/product/types/product";

export interface ProductUtils {
  getProductImages: (product: Product) => string[];
  getCurrentProductImage: (
    product: Product,
    currentImageIndex: Record<string, number>
  ) => string;
  getProductImage: (product: Product) => string;
  generateVariants: (product: Product) => VariantOption[];
  getCategoryBannerImage: (
    selectedCategoryId: string,
    selectedCategoryName: string,
    categories: any[]
  ) => string;
  filterAndSortProducts: (
    products: Product[],
    selectedCategoryId: string,
    priceRange: number[],
    sortBy: string,
    productsPerPage: number,
    selectedCategoryName: string
  ) => Product[];
  isWishlistActionLoading: (
    productId: string,
    isAddingToWishlist: (id: string) => boolean,
    isRemovingFromWishlist: (id: string) => boolean
  ) => boolean;
  handleVariantChange: (
    setSelectedVariants: React.Dispatch<
      React.SetStateAction<{ [key: string]: string }>
    >,
    variantType: string,
    value: string
  ) => void;
  handleProductHover: (
    setHoveredProduct: React.Dispatch<React.SetStateAction<string | null>>,
    setCurrentImageIndex: React.Dispatch<
      React.SetStateAction<{ [key: string]: number }>
    >,
    products: Product[],
    productId: string
  ) => void;
  calculateProductDiscount: (product: Product) => {
    hasDiscount: boolean;
    discountPercentage: number;
  };
}

export const productListUtils: ProductUtils = {
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

    if (images.length === 0) {
      images.push("/placeholder.svg?height=400&width=300");
    }

    return images;
  },

  // Helper function to get current product image (for hover effect)
  getCurrentProductImage: (
    product: Product,
    currentImageIndex: Record<string, number>
  ) => {
    const images = productListUtils.getProductImages(product);
    const index = currentImageIndex[product.id] || 0;
    return images[index] || images[0];
  },

  // Helper function to get main product image
  getProductImage: (product: Product) => {
    const images = productListUtils.getProductImages(product);
    return images[0];
  },

  // Generate variants from real data only
  // Generate variants from real data only
  generateVariants: (product: Product): VariantOption[] => {
    const variants: VariantOption[] = [];

    // Parse real variant data
    if (product.variantData) {
      try {
        console.log("Parsing variant data:", product.variantData);

        const parsedData = JSON.parse(product.variantData);
        console.log("Parsed variant data:", parsedData);

        // Handle different possible structures
        const variantArray = parsedData.variants || parsedData || [];

        if (Array.isArray(variantArray)) {
          variantArray.forEach((variant: any, index: number) => {
            console.log(`Variant ${index}:`, variant);

            if (variant && variant.name && Array.isArray(variant.values)) {
              variants.push({
                name: variant.name.toLowerCase().replace(/\s+/g, "-"), // Convert to kebab-case
                label: variant.name,
                values: variant.values.filter((v: any) => v && v.trim() !== ""), // Remove empty values
              });
            }
          });
        }

        console.log("Final variants:", variants);
      } catch (error) {
        console.error("Failed to parse variant data:", error);
        console.log("Raw variantData that failed:", product.variantData);
      }
    } else {
      console.log("No variantData found for product:", product.id);
    }

    return variants;
  },

  // Helper function to get category banner image from backend
  getCategoryBannerImage: (
    selectedCategoryId: string,
    selectedCategoryName: string,
    categories: any[]
  ) => {
    if (
      !selectedCategoryId ||
      selectedCategoryId === "" ||
      selectedCategoryName === "All Products" ||
      selectedCategoryName === "HOME"
    ) {
      return "/placeholder.svg?height=300&width=1200&text=All+Products";
    }

    const currentCategory = categories.find(
      (category) =>
        String(category.id).trim() === String(selectedCategoryId).trim()
    );

    if (!currentCategory) {
      return "/placeholder.svg?height=300&width=1200&text=Category+Banner";
    }

    if (currentCategory.bannerUrl) {
      return currentCategory.bannerUrl;
    }

    return "/placeholder.svg?height=300&width=1200&text=Category+Banner";
  },

  // Filter and sort products
  filterAndSortProducts: (
    products: Product[],
    selectedCategoryId: string,
    priceRange: number[],
    sortBy: string,
    productsPerPage: number,
    selectedCategoryName: string
  ) => {
    const categoryProducts = (() => {
      if (
        !selectedCategoryId ||
        selectedCategoryId === "" ||
        selectedCategoryName === "All Products" ||
        selectedCategoryName === "HOME"
      ) {
        return products;
      }

      return products.filter((product) => {
        return (
          String(product.categoryId).trim() ===
          String(selectedCategoryId).trim()
        );
      });
    })();

    return categoryProducts
      .filter((product) => {
        const price = product.price || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low-high":
            return (a.price || 0) - (b.price || 0);
          case "price-high-low":
            return (b.price || 0) - (a.price || 0);
          case "latest":
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            );
          default:
            return 0;
        }
      })
      .slice(0, productsPerPage);
  },

  // Helper function to check if wishlist is loading for this product
  isWishlistActionLoading: (
    productId: string,
    isAddingToWishlist: (id: string) => boolean,
    isRemovingFromWishlist: (id: string) => boolean
  ) => {
    return isAddingToWishlist(productId) || isRemovingFromWishlist(productId);
  },

  // Handle variant change
  handleVariantChange: (
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

  // Handle product hover
  handleProductHover: (
    setHoveredProduct: React.Dispatch<React.SetStateAction<string | null>>,
    setCurrentImageIndex: React.Dispatch<
      React.SetStateAction<{ [key: string]: number }>
    >,
    products: Product[],
    productId: string
  ) => {
    setHoveredProduct(productId);
    const product = products.find((p) => p.id === productId);
    if (product) {
      const images = productListUtils.getProductImages(product);
      if (images.length > 1) {
        setCurrentImageIndex((prev) => ({
          ...prev,
          [productId]: 0,
        }));
      }
    }
  },

  // Calculate product discount using actual discount fields
  calculateProductDiscount: (product: Product) => {
    const hasDiscount =
      product.discountPrice &&
      product.price &&
      product.discountPrice > product.price;

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
};
