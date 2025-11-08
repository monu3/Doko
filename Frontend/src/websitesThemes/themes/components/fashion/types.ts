// types.ts (optional: extract into separate file if you want reusability)
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: "women" | "men";
  subcategory: string;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  tags: string[];
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type WishlistItem = Product;
