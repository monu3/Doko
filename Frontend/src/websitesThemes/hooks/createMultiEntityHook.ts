// src/hooks/createMultiEntityHook.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/store";

type Status = "idle" | "loading" | "succeeded" | "failed";

// Define how the hook can be configured
interface HookOptions {
  shopId?: string;
  categoryId?: string;
  entityId?: string;
  enabled?: boolean;
}

interface Thunks {
  shopThunk?: any;      // e.g. fetchProductsByShopId
  categoryThunk?: any;  // e.g. fetchProductsByCategoryId
  singleThunk?: any;    // e.g. fetchProductById
}

export function createMultiEntityHook<TSlice, TData>(
  sliceKey: keyof RootState,                     // e.g. "product"
  thunks: Thunks,                                // mapping of thunks
  selector: (slice: TSlice) => TData             // extract data from slice
) {
  return function useEntity(
    mode: "shop" | "category" | "single" = "shop",
    options: HookOptions = {}
  ) {
    const dispatch = useAppDispatch();
    const stateSlice: any = useAppSelector((s) => s[sliceKey]);
    const status: Status = stateSlice.status;
    const error = stateSlice.error;
    const data = selector(stateSlice);

    const rootShopId = useAppSelector((s) => s.shop.shop?.id);
    const { shopId = rootShopId, categoryId, entityId, enabled = true } = options;

    useEffect(() => {
      if (!enabled) return;

      if (mode === "shop" && shopId && thunks.shopThunk && status === "idle") {
        dispatch(thunks.shopThunk());
      }

      if (mode === "category" && categoryId && thunks.categoryThunk) {
        dispatch(thunks.categoryThunk(categoryId));
      }

      if (mode === "single" && entityId && thunks.singleThunk) {
        dispatch(thunks.singleThunk(entityId));
      }
    }, [dispatch, mode, shopId, categoryId, entityId, status, enabled]);

    return {
      data,
      status,
      error,
      isLoading: status === "loading",
      isError: status === "failed",
      slice: stateSlice, // full slice in case you need more
    };
  };
}
