export interface StoreDetails {
  name: string;
  address: string;
  email: string;
  phone?: string;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface FooterProps {
  storeDetails: StoreDetails;
  socialLinks: SocialLinks;
  deliveryTime?: string;
  paymentMethods?: string[];
}
