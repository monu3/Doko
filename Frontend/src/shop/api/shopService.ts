// src/shop/services/shopService.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchOwnerId } from "@/auth/slice/authSlice";
import { fetchAudience, getShopByOwnerId } from "../slice/shopSlice";

export const useShop = () => {
  const dispatch = useAppDispatch();
  const { ownerId, status: authStatus } = useAppSelector((state) => state.auth);
  const {
    shop,
    status: shopStatus,
    audience,
    audienceStatus,
  } = useAppSelector((state) => state.shop);

  // Fetch ownerId only once when needed
  useEffect(() => {
    if (!ownerId && authStatus === "idle") {
      dispatch(fetchOwnerId());
    }
  }, [dispatch, ownerId, authStatus]);

  // Fetch shop data only once when needed
  useEffect(() => {
    if (ownerId && !shop && shopStatus === "idle") {
      dispatch(getShopByOwnerId(ownerId));
    }
  }, [dispatch, ownerId, shop, shopStatus]);

  // Fetch audience only when shop is available
  useEffect(() => {
    if (shop?.id && audienceStatus === "idle") {
      dispatch(fetchAudience(shop.id));
    }
  }, [dispatch, shop?.id, audienceStatus]);

  return {
    shop,
    audience,
    status: shopStatus,
    ownerId,
    isShopLoading: shopStatus === "loading" || authStatus === "loading",
    isAudienceLoading: audienceStatus === "loading",
  };
};
