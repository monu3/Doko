// src/cart/hooks/useCart.ts
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import type { RootState } from "@/store";
import {
  addToCart,
  fetchCartItems,
  fetchCartItemsGrouped,
  updateCartItem,
  removeFromCart,
  clearCart,
  fetchCartSummary,
  fetchCartCount,
  placeOrder,
  initiatePayment,
  clearError,
  clearOrderError,
  clearPaymentError,
  resetCart,
  optimisticAddToCart,
  optimisticUpdateCart,
  optimisticRemoveFromCart,
} from "@/customerView/slice/cartSlice";
import {
  AddToCartRequest,
  UpdateCartItemRequest,
  OrderRequest,
  CartItem,
  CartSummary,
  PaymentInitRequest,
} from "@/customerView/types";

export const useCart = () => {
  const dispatch = useAppDispatch();

  // Select all cart state from Redux
  const cartState = useAppSelector((state: RootState) => state.cart);
  const {
    items,
    itemsByShop,
    summary,
    loading,
    error,
    addToCartLoading,
    updateLoading,
    removeLoading,
    orderLoading,
    orderError,
    lastOrder,
    paymentLoading,
    paymentRedirectHtml,
    paymentError,
    paymentFormData,
  } = cartState;

  // Memoized action creators
  const addItemToCart = useCallback(
    (data: AddToCartRequest) => {
      return dispatch(addToCart(data));
    },
    [dispatch]
  );

  const fetchItems = useCallback(() => {
    return dispatch(fetchCartItems());
  }, [dispatch]);

  const fetchGroupedItems = useCallback(() => {
    return dispatch(fetchCartItemsGrouped());
  }, [dispatch]);

  const updateItem = useCallback(
    (data: UpdateCartItemRequest) => {
      return dispatch(updateCartItem(data));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (cartItemId: string) => {
      return dispatch(removeFromCart(cartItemId));
    },
    [dispatch]
  );

  const clearAllItems = useCallback(() => {
    return dispatch(clearCart());
  }, [dispatch]);

  const fetchSummary = useCallback(() => {
    return dispatch(fetchCartSummary());
  }, [dispatch]);

  const fetchCount = useCallback(() => {
    return dispatch(fetchCartCount());
  }, [dispatch]);

  const createOrder = useCallback(
    (orderData: OrderRequest) => {
      return dispatch(placeOrder(orderData));
    },
    [dispatch]
  );

  const initiatePaymentProcess = useCallback(
    (paymentData: PaymentInitRequest) => {
      return dispatch(initiatePayment(paymentData));
    },
    [dispatch]
  );

  const clearErrors = useCallback(() => {
    dispatch(clearError());
    dispatch(clearOrderError());
    dispatch(clearPaymentError());
  }, [dispatch]);

  const resetCartState = useCallback(() => {
    dispatch(resetCart());
  }, [dispatch]);

  const optimisticAdd = useCallback(
    (productId: string) => {
      dispatch(optimisticAddToCart({ productId }));
    },
    [dispatch]
  );

  const optimisticUpdate = useCallback(
    (cartItemId: string) => {
      dispatch(optimisticUpdateCart({ cartItemId }));
    },
    [dispatch]
  );

  const optimisticRemove = useCallback(
    (cartItemId: string) => {
      dispatch(optimisticRemoveFromCart({ cartItemId }));
    },
    [dispatch]
  );

  // Helper functions
  const getCartItem = useCallback(
    (cartItemId: string): CartItem | undefined => {
      return items.find((item) => item.id === cartItemId);
    },
    [items]
  );

  const getShopItems = useCallback(
    (shopId: string): CartItem[] => {
      return itemsByShop[shopId] || [];
    },
    [itemsByShop]
  );

  const getShopTotal = useCallback(
    (shopId: string): number => {
      const shopItems = getShopItems(shopId);
      return shopItems.reduce((total, item) => total + item.totalPrice, 0);
    },
    [getShopItems]
  );

  const isAddingToCart = useCallback(
    (productId: string): boolean => {
      return addToCartLoading[productId] || false;
    },
    [addToCartLoading]
  );

  const isUpdatingItem = useCallback(
    (cartItemId: string): boolean => {
      return updateLoading[cartItemId] || false;
    },
    [updateLoading]
  );

  const isRemovingItem = useCallback(
    (cartItemId: string): boolean => {
      return removeLoading[cartItemId] || false;
    },
    [removeLoading]
  );

  // Calculate cart totals (fallback if summary is not available)
  const calculatedSummary: CartSummary = {
    totalItems: summary.totalItems || items.length,
    totalAmount:
      summary.totalAmount ||
      items.reduce((total, item) => total + item.totalPrice, 0),
  };

  return {
    // State
    items,
    itemsByShop,
    summary: calculatedSummary,
    loading,
    error,
    orderLoading,
    orderError,
    lastOrder,
    updateLoading,
    removeLoading,

    // Payment state
    paymentLoading,
    paymentRedirectHtml,
    paymentError,
    paymentFormData,

    // Actions
    addItemToCart,
    fetchItems,
    fetchGroupedItems,
    updateItem,
    removeItem,
    clearAllItems,
    fetchSummary,
    fetchCount,
    createOrder,
    initiatePayment: initiatePaymentProcess,
    initiatePaymentProcess,
    clearErrors,
    resetCartState,

    // Optimistic actions
    optimisticAdd,
    optimisticUpdate,
    optimisticRemove,

    // Helper functions
    getCartItem,
    getShopItems,
    getShopTotal,
    isAddingToCart,
    isUpdatingItem,
    isRemovingItem,

    // Derived state
    isEmpty: items.length === 0,
    hasItems: items.length > 0,
    totalUniqueItems: items.length,
    totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
  };
};

// Additional specialized hooks for specific use cases

export const useCartItems = () => {
  const { items, loading, error, fetchItems } = useCart();

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
  };
};

export const useCartSummary = () => {
  const { summary, loading, error, fetchSummary } = useCart();

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
};

export const useCartOperations = () => {
  const {
    addItemToCart,
    updateItem,
    removeItem,
    clearAllItems,
    isAddingToCart,
    isUpdatingItem,
    isRemovingItem,
    optimisticAdd,
    optimisticUpdate,
    optimisticRemove,
  } = useCart();

  return {
    addItemToCart,
    updateItem,
    removeItem,
    clearAllItems,
    isAddingToCart,
    isUpdatingItem,
    isRemovingItem,
    optimisticAdd,
    optimisticUpdate,
    optimisticRemove,
  };
};

export const useCartOrder = () => {
  const { createOrder, orderLoading, orderError, lastOrder, clearErrors } =
    useCart();

  return {
    createOrder,
    orderLoading,
    orderError,
    lastOrder,
    clearOrderError: clearErrors,
  };
};

export const useCartPayment = () => {
  const {
    initiatePayment,
    paymentLoading,
    paymentRedirectHtml,
    paymentError,
    clearErrors,
  } = useCart();

  return {
    initiatePayment,
    paymentLoading,
    paymentRedirectHtml,
    paymentError,
    clearPaymentError: clearErrors,
  };
};

export default useCart;
