// src/customer/hooks/useCustomer.ts
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import type { RootState } from "@/store";
import {
  initiateSignup,
  verifySignup,
  resendOtp,
  logoutCustomer,
  followShop,
  unfollowShop,
  getFollowerCount,
  loadUserFollowedShops,
  loadCartAndWishlistCounts,
  resetSignupState,
  logout,
  updateCartCount,
  updateWishlistCount,
  clearError,
  clearFollowError,
  setFollowedShops,
  initializeUserData,
  type InitiateSignupRequest,
  type VerifySignupRequest,
  type ResendOtpRequest,
} from "@/customerView/slice/customerHeaderSlice";

export const useCustomer = () => {
  const dispatch = useAppDispatch();

  // Select all customer state from Redux
  const customerState = useAppSelector(
    (state: RootState) => state.customerHeader
  );
  const {
    user,
    isAuthenticated,
    signupStatus,
    signupLoading,
    signupError,
    logoutLoading,
    logoutError,
    currentEmail,
    cartItemsCount,
    wishlistItemsCount,
    authToken,
    followedShops,
    followLoading,
    followError,
    followedShopsLoading,
  } = customerState;

  // 🔹 Automatically load followed shops when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(loadUserFollowedShops({ customerId: user.id }));
    }
  }, [dispatch, isAuthenticated, user?.id]);

  // Memoized action creators
  const signupInitiate = useCallback(
    (data: InitiateSignupRequest) => {
      return dispatch(initiateSignup(data));
    },
    [dispatch]
  );

  const signupVerify = useCallback(
    (data: VerifySignupRequest) => {
      return dispatch(verifySignup(data));
    },
    [dispatch]
  );

  const resendOtpCode = useCallback(
    (data: ResendOtpRequest) => {
      return dispatch(resendOtp(data));
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    return dispatch(logoutCustomer());
  }, [dispatch]);

  const followShopAction = useCallback(
    (shopId: string) => {
      return dispatch(followShop({ shopId }));
    },
    [dispatch]
  );

  const unfollowShopAction = useCallback(
    (shopId: string) => {
      return dispatch(unfollowShop({ shopId }));
    },
    [dispatch]
  );

  const getShopFollowerCount = useCallback(
    (shopId: string) => {
      return dispatch(getFollowerCount({ shopId }));
    },
    [dispatch]
  );

  // const loadFollowedShops = useCallback(
  //   (customerId: string) => {
  //     return dispatch(loadUserFollowedShops({ customerId }));
  //   },
  //   [dispatch]
  // );

  const loadCounts = useCallback(() => {
    return dispatch(loadCartAndWishlistCounts());
  }, [dispatch]);

  const resetSignup = useCallback(() => {
    dispatch(resetSignupState());
  }, [dispatch]);

  const logoutLocal = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const updateCartItemCount = useCallback(
    (count: number) => {
      dispatch(updateCartCount(count));
    },
    [dispatch]
  );

  const updateWishlistItemCount = useCallback(
    (count: number) => {
      dispatch(updateWishlistCount(count));
    },
    [dispatch]
  );

  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearFollowErrors = useCallback(() => {
    dispatch(clearFollowError());
  }, [dispatch]);

  const setFollowedShopsList = useCallback(
    (shopIds: string[]) => {
      dispatch(setFollowedShops(shopIds));
    },
    [dispatch]
  );

  const initializeData = useCallback(() => {
    dispatch(initializeUserData());
  }, [dispatch]);

  // Helper functions
  const isFollowingShop = useCallback(
    (shopId: string): boolean => {
      return followedShops.includes(shopId);
    },
    [followedShops]
  );

  const toggleFollowShop = useCallback(
    async (shopId: string) => {
      const currentlyFollowing = isFollowingShop(shopId);

      if (currentlyFollowing) {
        return unfollowShopAction(shopId);
      } else {
        return followShopAction(shopId);
      }
    },
    [isFollowingShop, followShopAction, unfollowShopAction]
  );

  // Check if user is authenticated and has valid token
  const isValidSession = useCallback((): boolean => {
    if (!isAuthenticated || !authToken) return false;

    // Optional: Add token expiration check here if you store expiry time
    try {
      const token = localStorage.getItem("authToken");
      return token === authToken;
    } catch {
      return false;
    }
  }, [isAuthenticated, authToken]);

  // Get user ID safely
  const getUserId = useCallback((): string | null => {
    return user?.id || null;
  }, [user]);

  return {
    // State
    user,
    isAuthenticated,
    signupStatus,
    signupLoading,
    signupError,
    logoutLoading,
    logoutError,
    currentEmail,
    cartItemsCount,
    wishlistItemsCount,
    authToken,
    followedShops,
    followLoading,
    followError,
    followedShopsLoading,

    // Actions
    signupInitiate,
    signupVerify,
    resendOtpCode,
    logoutUser,
    followShopAction,
    unfollowShopAction,
    getShopFollowerCount,
    // loadFollowedShops,
    loadCounts,

    // Reducer actions
    resetSignup,
    logoutLocal,
    updateCartItemCount,
    updateWishlistItemCount,
    clearErrors,
    clearFollowErrors,
    setFollowedShopsList,
    initializeData,

    // Helper functions
    isFollowingShop,
    toggleFollowShop,
    isValidSession,
    getUserId,

    // Derived state
    hasUser: !!user,
    isSignedUp: signupStatus === "completed",
    isEmailSent: signupStatus === "email_sent",
    canResendOtp: signupStatus === "email_sent",
    followCount: followedShops.length,
  };
};

// Additional specialized hooks for specific use cases

export const useCustomerAuth = () => {
  const {
    isAuthenticated,
    user,
    authToken,
    isValidSession,
    logoutUser,
    loadCounts,
  } = useCustomer();

  return {
    isAuthenticated,
    user,
    authToken,
    isValidSession,
    logout: logoutUser,
    loadCounts,
  };
};

export const useCustomerSignup = () => {
  const {
    signupInitiate,
    signupVerify,
    resendOtpCode,
    signupLoading,
    signupError,
    signupStatus,
    currentEmail,
    resetSignup,
    clearErrors,
  } = useCustomer();

  return {
    initiateSignup: signupInitiate,
    verifySignup: signupVerify,
    resendOtp: resendOtpCode,
    loading: signupLoading,
    error: signupError,
    status: signupStatus,
    currentEmail,
    resetSignup,
    clearErrors,
  };
};

export const useCustomerFollow = () => {
  const {
    followedShops,
    followLoading,
    followError,
    isFollowingShop,
    toggleFollowShop,
    followShopAction,
    unfollowShopAction,
    // loadFollowedShops,
    clearFollowErrors,
  } = useCustomer();

  return {
    followedShops,
    loading: followLoading,
    error: followError,
    isFollowing: isFollowingShop,
    toggleFollow: toggleFollowShop,
    followShop: followShopAction,
    unfollowShop: unfollowShopAction,
    // loadFollowedShops,
    clearErrors: clearFollowErrors,
  };
};

export const useCustomerCounts = () => {
  const {
    cartItemsCount,
    wishlistItemsCount,
    loadCounts,
    updateCartItemCount,
    updateWishlistItemCount,
  } = useCustomer();

  return {
    cartCount: cartItemsCount,
    wishlistCount: wishlistItemsCount,
    loadCounts,
    updateCartCount: updateCartItemCount,
    updateWishlistCount: updateWishlistItemCount,
  };
};

export default useCustomer;
