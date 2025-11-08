export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountPrice: number | null;
  discountPercentage: number;
  variant: string | null;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  items: OrderItem[];
  paymentMethod: string;
  status: string;
  total: number;
  channel: string;
  shopId: string;
  shopName: string;
  deliveryFee: number;
  orderNumber: string | null;
  originalTotal: number | null;
  shippingAddress: {
    name: string;
    email: string;
    mobile: string;
    country: string;
    address: string;
    city: string;
    province?: string;
    zip?: string;
  };
}

export interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  updatingStatus: boolean;
  lastFetched: number | null;
}

export interface OrdersApiResponse {
  status: "success" | "error";
  orders?: Order[];
  message?: string;
}

export interface OrderStatusUpdateResponse {
  status: "success" | "error";
  orders?: Order;
  message?: string;
}