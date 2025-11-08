import { useAppDispatch } from "@/hooks";
import { getShopByUrl } from "@/shop/slice/shopSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ThemeLoader from "../../themeLoader";

// ShopPublicPage.tsx
export const ShopPublicPage = () => {
  const { shopUrl } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getShopByUrl(shopUrl!));
  }, [dispatch, shopUrl]);

  return <ThemeLoader />;
};
