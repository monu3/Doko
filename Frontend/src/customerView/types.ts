export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productImages: string[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedVariant?: string;
  shopId: string;
  shopName: string;
  stockQuantity: number;
  createdAt: string;
}

export interface CartSummary {
  totalItems: number;
  totalAmount: number;
}

export interface CartState {
  totalItems: any;
  items: CartItem[];
  itemsByShop: Record<string, CartItem[]>;
  summary: CartSummary;
  loading: boolean;
  error: string | null;
  addToCartLoading: Record<string, boolean>; // Track loading per product
  updateLoading: Record<string, boolean>; // Track loading per cart item
  removeLoading: Record<string, boolean>; // Track loading per cart item
  orderLoading: boolean;
  orderError: string | null;
  lastOrder: OrderResponse | null;
  paymentLoading: boolean;
  paymentError: string | null;
  paymentRedirectHtml: string | null;
  paymentFormData: PaymentInitResponse | null;
}

export interface OrderRequest {
  shopId: string;
  shippingAddress: {
    name: string;
    email: string;
    mobile: string;
    country: string;
    address: string;
    city: string;
  };
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  shippingAddress: any;
  paymentMethod: string;
}

// API Request Types
export interface AddToCartRequest {
  productId: string;
  quantity?: number;
  selectedVariant?: string;
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}

export interface PaymentInitRequest {
  shopId: string;
  paymentMethod: string;
  orderId: string;
  amountMinor: number;
  returnUrl: string;
  failureUrl: string;
}

export interface PaymentInitResponse {
  formUrl: string;
  fields: {
    amount: string;
    tax_amount: string;
    total_amount: string;
    transaction_uuid: string;
    product_code: string;
    product_service_charge: string;
    product_delivery_charge: string;
    success_url: string;
    failure_url: string;
    signed_field_names: string;
    signature: string;
  };
  gatewayRequestId: string;
}
