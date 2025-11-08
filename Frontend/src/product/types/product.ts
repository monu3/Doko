export interface ProductVariant {
  name: string; // e.g., "Color", "Size"
  values: string[]; // e.g., ["Red", "Blue", "Green"]
}

// Types for the utility functions
export interface VariantOption {
  name: string;
  label: string;
  values: string[];
}

export interface ProductVariantData {
  variants: ProductVariant[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  discountPercentage: number;
  stock: number;
  imageUrl: string;
  images: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  shopId: string;
  categoryId: string;

  // Simple variant support
  hasVariants: boolean;
  variantData?: string | null; // JSON string of ProductVariantData
}

// Add this interface near your imports
export interface ProductWithVariants extends Product {
  variants: VariantOption[];
}

// Define the product state interface
export interface ProductState {
  products: Product[]; // List of products for a shop
  product?: Product; // Single product for detailed view
  productsByCategory: Record<string, Product[]>; // Mapping: categoryId => Product[]
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  updateStatusLoading: Record<string, boolean>;
  lastFetched: number | null;
}

export interface ProductFormData {
  // Product Information
  name: string;
  category: string;
  price: string;
  discountedPrice?: string;
  description: string;

  // Product Media
  images: string[];
  video?: string;

  // Inventory
  quantity: string;
  skuId: string;

  // Variants
  variants: {
    name: string;
    values: string[];
  }[];

  status: boolean;
}

// Helper function to parse variant data safely
export const parseVariantData = (
  variantData: string | null | undefined
): ProductVariantData => {
  if (!variantData) {
    return { variants: [] };
  }

  try {
    const parsed = JSON.parse(variantData);
    // Validate the structure
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray(parsed.variants)
    ) {
      return {
        variants: parsed.variants.map((v: any) => ({
          name: v.name || "",
          values: Array.isArray(v.values) ? v.values : [],
        })),
      };
    }
    return { variants: [] };
  } catch (error) {
    return { variants: [] };
  }
};

// Helper function to validate variant data before sending to backend
export const validateVariantData = (
  variantData: ProductVariantData
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!variantData.variants || !Array.isArray(variantData.variants)) {
    return { isValid: false, errors: ["Invalid variant data structure"] };
  }

  variantData.variants.forEach((variant, index) => {
    if (!variant.name?.trim()) {
      errors.push(`Variant ${index + 1} needs a name`);
    }

    if (!variant.values || !Array.isArray(variant.values)) {
      errors.push(`Variant "${variant.name}" has invalid values array`);
      return;
    }

    if (variant.values.length === 0) {
      errors.push(`Variant "${variant.name}" needs at least one value`);
    }

    variant.values.forEach((value, valueIndex) => {
      if (!value?.trim()) {
        errors.push(
          `Variant "${variant.name}" has empty value at position ${
            valueIndex + 1
          }`
        );
      }
    });

    // Check for duplicate variant names
    const duplicateNames = variantData.variants.filter(
      (v) => v.name === variant.name
    );
    if (duplicateNames.length > 1) {
      errors.push(`Duplicate variant name: "${variant.name}"`);
    }
  });

  return { isValid: errors.length === 0, errors };
};
