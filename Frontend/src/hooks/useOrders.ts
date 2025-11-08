// hooks/useOrders.ts
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getOrdersByShop } from "@/orders/slice/orderSlice";

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const shopId = useAppSelector((state) => state.shop.shop?.id); // adjust path if different
  const { orders, loading, error, lastFetched } = useAppSelector(
    (state) => state.orders
  );

  const fetchOrders = useCallback(() => {
    if (shopId) {
      console.log("Fetching orders for shop:", shopId);
      dispatch(getOrdersByShop(shopId));
    }
  }, [shopId, dispatch]);

  useEffect(() => {
    // Only fetch if we have a shopId and either:
    // 1. We haven't fetched before, or
    // 2. It's been more than 30 seconds since the last fetch
    if (shopId && (!lastFetched || Date.now() - lastFetched > 30000)) {
      fetchOrders();
    }
  }, [shopId, fetchOrders, lastFetched]);

  return { orders, loading, error,refetch: fetchOrders };
};
