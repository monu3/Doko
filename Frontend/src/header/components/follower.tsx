"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Loader2 } from "lucide-react";
import { useShop } from "@/shop/api/shopService";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  selectFollowerCountForShop,
  selectFollowerCountsLoading,
  fetchFollowerCount,
} from "@/customerView/slice/shopGallerySlice";

export default function Followe() {
  const { shop } = useShop();
  const dispatch = useAppDispatch();

  const shopId = shop?.id;

  // Grab follower count and loading state from Redux
  const followerCount = useAppSelector(
    selectFollowerCountForShop(shopId || "")
  );
  const followerCountsLoading = useAppSelector(selectFollowerCountsLoading);
  const isLoading = shopId ? followerCountsLoading[shopId] : false;

  // Fetch follower count when shopId is available
  useEffect(() => {
    if (shopId) {
      dispatch(fetchFollowerCount({ shopId }));
    }
  }, [dispatch, shopId]);

  if (!shopId) return null;

  return (
    <Card className="w-32 inline-flex items-center space-x-3 px-2 py-1 bg-blue-400 text-primary-foreground">
      <CardContent className="flex items-center p-0">
        <Users className="h-6 w-3 mr-1" />
        <span className="text-xs font-medium">Followers123: </span>
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin ml-1" />
        ) : (
          <span className="text-xs font-bold ml-1">
            {followerCount.toLocaleString()}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
