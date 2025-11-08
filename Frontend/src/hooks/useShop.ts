import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createShop,
  getShopByOwnerId,
  getAllShops,
  getShopByUrl,
  updateShopTheme,
  updateStoreDetails,
  updateStoreAddress,
  fetchAudience,
  resetShopState
} from "@/shop/slice/shopSlice";
import {RootState } from "@/store";
import { useCallback } from "react";

export const useShop = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const shop = useAppSelector((state: RootState) => state.shop.shop);
  const shops = useAppSelector((state: RootState) => state.shop.shops);
  const audience = useAppSelector((state: RootState) => state.shop.audience);
  const audienceStatus = useAppSelector(
    (state: RootState) => state.shop.audienceStatus
  );
  const audienceError = useAppSelector(
    (state: RootState) => state.shop.audienceError
  );
  const status = useAppSelector((state: RootState) => state.shop.status);
  const error = useAppSelector((state: RootState) => state.shop.error);

  /**
   * ─── Actions (memoized with useCallback where needed) ───
   */
  const loadShopByOwnerId = useCallback(
    (ownerId: string) => dispatch(getShopByOwnerId(ownerId)),
    [dispatch]
  );

  const loadShopByUrl = useCallback(
    (shopUrl: string) => dispatch(getShopByUrl(shopUrl)),
    [dispatch]
  );

  const loadAllShops = useCallback(() => dispatch(getAllShops()), [dispatch]);

  const loadAudience = useCallback(
    (shopId: string) => dispatch(fetchAudience(shopId)),
    [dispatch]
  );

  /**
   * ─── Actions (plain, used on demand like form submit) ───
   */
  const addShop = (
    shopDTO: {
      shopUrl: string;
      businessName: string;
      district: string;
      province: string;
    },
    ownerId: string
  ) => {
    return dispatch(createShop({ shopDTO, ownerId }));
  };

  const changeShopTheme = (shopId: string, theme: string) => {
    return dispatch(updateShopTheme({ shopId, theme }));
  };

  const editStoreDetails = (
    shopId: string,
    storeDetails: {
      shopUrl?: string;
      businessName?: string;
      district?: string;
      province?: string;
      logoUrl?: string;
    }
  ) => {
    return dispatch(updateStoreDetails({ shopId, storeDetails }));
  };

  const editStoreAddress = (
    shopId: string,
    address: {
      street: string;
      city: string;
      tole: string;
      mapUrl: string;
      postalCode: string;
    }
  ) => {
    return dispatch(updateStoreAddress({ shopId, address }));
  };

  const reset = () => dispatch(resetShopState());

  return {
    shop,
    shops,
    audience,
    audienceStatus,
    audienceError,
    status,
    error,

    // Actions
    loadShopByOwnerId,
    loadShopByUrl,
    loadAllShops,
    loadAudience,
    addShop,
    changeShopTheme,
    editStoreDetails,
    editStoreAddress,
    reset,
  };
};

export type UseShopReturn = ReturnType<typeof useShop>;
