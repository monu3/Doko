import { useShop } from "@/hooks/useShop";
import { useSocialAccount } from "@/hooks/useSocialAccount";
import { useCategory } from "@/hooks/useCategory";

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
}

export interface ContactInfo {
  street: string;
  city: string;
  province: string;
  district: string;
  phone: string;
  email: string;
  postalCode: string;
  mapUrl: string;
}

export interface FooterData {
  shop: ReturnType<typeof useShop>["shop"];
  socialAccount: ReturnType<typeof useSocialAccount>["socialAccount"];
  categories: ReturnType<typeof useCategory>["categories"];
  activeCategories: any[];
  socialLinks: SocialLinks;
  contactInfo: ContactInfo;
}

export const useFooterData = (): FooterData => {
  const { shop } = useShop();
  const { socialAccount } = useSocialAccount(shop?.id);
  const { categories } = useCategory();

  // Filter active categories
  const activeCategories =
    categories?.filter((category) => category.active) || [];

  // Get social links from settings
  const socialLinks: SocialLinks = {
    facebook: socialAccount?.facebookLink || "",
    instagram: socialAccount?.instagramLink || "",
    tiktok: socialAccount?.tiktokLink || "",
    youtube: socialAccount?.youtubeLink || "",
  };

  // Get contact information from shop and social account
  const contactInfo: ContactInfo = {
    street: shop?.address?.street || "",
    city: shop?.address?.city || "",
    province: shop?.province || "",
    district: shop?.district || "",
    phone: socialAccount?.supportPhone || "",
    email: socialAccount?.supportEmail || "",
    postalCode: shop?.address?.postalCode || "",
    mapUrl: shop?.address?.mapUrl || "",
  };

  return {
    shop,
    socialAccount,
    categories,
    activeCategories,
    socialLinks,
    contactInfo,
  };
};

export const handleSocialClick = (url: string): void => {
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

export const handleMapClick = (mapUrl: string): void => {
  if (mapUrl) {
    window.open(mapUrl, "_blank", "noopener,noreferrer");
  }
};
