export interface AudienceData {
  customerName: string;
  mobileNumber: string;
  email: string;
  city: string;
  totalOrders: number;
  totalSales: number;
}

// Define the Shop interface based on the API response.
export interface Shop {
  id: string;
  shopUrl: string;
  businessName: string;
  theme?: string;
  logoUrl: string;
  district: string; // This could be an enum, but here we'll use a string
  province: string; // Same here
  followers: any[]; // Use appropriate type or number if you only need a count
  categories: any[]; // Use appropriate type or number if you only need a count
  products: any[]; // Use appropriate type or number if you only need a count
  active: boolean;
  owner: {
    // Add owner field
    id: string;
  };
  address?: {
    street: string;
    city: string;
    tole: string;
    mapUrl: string;
    postalCode: string;
  };
  // Add other properties as needed (e.g., logoUrl, etc.)
}

// Define the state interface for shop-related state.
export interface ShopState {
  shop?: Shop; // Single shop details (for the current owner)
  shops: Shop[]; // List of all shops (for admin listing, etc.)
  audience: AudienceData[];
  audienceStatus: "idle" | "loading" | "succeeded" | "failed";
  audienceError: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastFetched: number | null;
}