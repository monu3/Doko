// hooks/useSocialAccount.ts
import { useEffect, useCallback } from "react";
import { RootState } from "@/store";
import {
  getSocialAccount,
  resetSettingsState,
} from "@/setting/slice/settingSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";

export const useSocialAccount = (shopId?: string) => {
  const dispatch = useAppDispatch();
  const { socialAccount, status, error } = useAppSelector(
    (state: RootState) => state.settings
  );

  /** ─── Action: Fetch social account by shopId ─── */
  /** Auto-fetch if shopId exists */
  useEffect(() => {
    if (shopId) {
      dispatch(getSocialAccount(shopId));
    }
  }, [dispatch, shopId]);
  /** ─── Local actions (reducers) ─── */
  const resetState = useCallback(() => {
    dispatch(resetSettingsState());
  }, [dispatch]);

  // const updateLocal = useCallback(
  //   (data: Partial<typeof socialAccount>) => {
  //     dispatch(updateLocalSocialAccount(data))
  //   },
  //   [dispatch]
  // )

  /** ─── Return API ─── */
  return {
    // State
    socialAccount,
    status,
    error,

    // Actions
    resetState,
    // updateLocal,

    // Derived state
    isLoading: status === "loading",
    hasError: error !== null,
    isEmpty: !socialAccount,
  };
};

