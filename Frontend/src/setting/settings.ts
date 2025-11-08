export interface StoreDetails {
  storeLink: string;
  storeName: string;
  emailAddress: string;
  country: string;
  storeAddress: string;
}

export interface StoreAddress {
  street: string;
  city: string;
  tole: string;
  mapUrl: string;
  postalCode: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  marketingEmails: boolean;
}

export interface PaymentSettings {
  paymentMethods: string[];
  currency: string;
  taxRate: number;
  processingFee: number;
}

export interface CheckoutSettings {
  guestCheckout: boolean;
  requireAccount: boolean;
  showTaxes: boolean;
  showShipping: boolean;
  termsRequired: boolean;
}

export interface ShippingSettings {
  freeShippingThreshold: number;
  shippingZones: string[];
  defaultShippingRate: number;
  expeditedShipping: boolean;
}

export interface LanguageSettings {
  defaultLanguage: string;
  supportedLanguages: string[];
  rtlSupport: boolean;
}

export interface SupportSocialSettings {
  supportEmail: string;
  supportPhone: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface PolicySettings {
  privacyPolicy: string;
  termsOfService: string;
  returnPolicy: string;
  shippingPolicy: string;
}

export type SettingsSection =
  | "store-details"
  | "store-address"
  | "notifications"
  | "payments"
  | "checkout"
  | "shipping"
  | "languages"
  | "support-social"
  | "policies";


  // src/types/payment.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaymentConfig {
  id: string;
  shopId: string;
  paymentMethod: string;
  credentials: { [key: string]: string };
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentConfigSummary {
  id: string;
  shopId: string;
  paymentMethod: string;
  active: boolean;
  createdAt: string;
  maskedCredentials: {
    paymentMethod: string;
    maskedMerchantCode: string | null;
    maskedPublicKey: string | null;
    lastFourDigits: string | null;
  };
}

export interface PaymentState {
  configs: PaymentConfigSummary[];
  configDetails: { [key: string]: PaymentConfig }; // key: paymentMethod
  loading: boolean;
  error: string | null;
  setupDialog: {
    open: boolean;
    paymentMethod: string | null;
  };
  currentConfig: PaymentConfig | null;
}

export interface CreateConfigRequest {
  shopId: string;
  paymentMethod: string;
  credentials: { [key: string]: string };
}

export interface UpdateConfigRequest {
  credentials?: { [key: string]: string };
  active?: boolean;
}

export interface CredentialField {
  key: string;
  label: string;
  type: "text" | "password";
  placeholder: string;
}
