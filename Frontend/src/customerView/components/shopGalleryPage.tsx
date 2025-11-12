"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Heart, AlertCircle, ExternalLink, Loader2, Users } from "lucide-react";

import useShopGallery from "@/hooks/useShopGallery";
import { useCustomerAuth, useCustomerFollow } from "@/hooks/useCustomer";

interface ShopGalleryPageProps {
  onSignupRequired?: () => void;
}

const ShopGalleryPage = ({ onSignupRequired }: ShopGalleryPageProps) => {
  const navigate = useNavigate();

  // Shop gallery hook
  const {
    shops,
    status,
    error,
    updateFollowerCount,
    getFollowerCount,
    isFollowerCountLoading,
    loadGalleryWithCounts,
  } = useShopGallery();

  // Customer follow & auth
  const { isAuthenticated } = useCustomerAuth();
  // Customer follow hook
  const {
    loading: followLoading,
    toggleFollow,
    isFollowing,
    clearErrors: clearFollowErrors,
  } = useCustomerFollow();

  const [wishlistedProducts, setWishlistedProducts] = useState<Set<string>>(
    new Set()
  );
  const [followingShopId, setFollowingShopId] = useState<string | null>(null);

  // Scroll parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll(".shop-card");
      const scrollY = window.scrollY;
      cards.forEach((card: any) => {
        const speed = card.getAttribute("data-speed") || 0.15;
        card.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load gallery + follower counts on mount
  useEffect(() => {
    loadGalleryWithCounts().catch(() => {
      toast.error("Failed to load shops. Please try again later.", {
        autoClose: 2000,
      });
    });
  }, [loadGalleryWithCounts]);

  // Handle follow errors
  useEffect(() => {
    if (followLoading === false && clearFollowErrors) {
      clearFollowErrors();
    }
  }, [followLoading, clearFollowErrors]);

  const handleFollowToggle = async (shopId: string) => {
    if (!isAuthenticated) {
      onSignupRequired
        ? onSignupRequired()
        : toast.info("Please sign in to follow shops", { autoClose: 2000 });
      return;
    }

    setFollowingShopId(shopId);

    try {
      await toggleFollow(shopId);
      // Update local follower count
      const increment = !isFollowing(shopId);
      updateFollowerCount(shopId, increment);
      toast.success(
        `${increment ? "Followed" : "Unfollowed"} shop successfully`,
        { autoClose: 2000 }
      );
    } catch (err) {
      console.error("Follow/unfollow error:", err);
    } finally {
      setFollowingShopId(null);
    }
  };

  const toggleWishlist = (shopId: string) => {
    if (!isAuthenticated) {
      onSignupRequired
        ? onSignupRequired()
        : toast.info("Please sign in to manage your wishlist", {
            autoClose: 2000,
          });
      return;
    }

    setWishlistedProducts((prev) => {
      const newSet = new Set(prev);
      const action = newSet.has(shopId) ? "Removed" : "Added";
      newSet.has(shopId) ? newSet.delete(shopId) : newSet.add(shopId);
      toast.success(
        `${action} shop ${action === "Added" ? "to" : "from"} wishlist`,
        {
          autoClose: 2000,
        }
      );
      return newSet;
    });
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonGalleryPlaceholder />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Failed to load shops. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-white/50 to-purple-100/40 py-8">
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          {shops.map((shop) => {
            const shopId = shop.shopId;
            const isFollowed = isFollowing(shopId);
            const isFollowingThisShop = followingShopId === shopId;
            const followerCount = getFollowerCount(shopId);
            const isCountLoading = isFollowerCountLoading(shopId);

            return (
              <div
                key={shopId}
                className="relative space-y-4 rounded-2xl p-5 bg-blue-100 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 border border-gray-300 transition-colors duration-300 ease-in-out shop-card"
                data-speed={0.15}
              >
                {/* Shop Header */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center overflow-hidden">
                      {shop.logoUrl ? (
                        <img
                          src={shop.logoUrl}
                          alt={shop.businessName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {shop.businessName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h2
                        className="text-lg font-semibold text-indigo-800 hover:underline cursor-pointer"
                        onClick={() => navigate(`/shop/${shop.shopUrl}`)}
                      >
                        {shop.businessName}
                      </h2>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {isCountLoading ? (
                          <Skeleton className="h-3 w-12" />
                        ) : (
                          <span>
                            {followerCount} follower
                            {followerCount === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 relative z-10">
                    <Button
                      variant={isFollowed ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFollowToggle(shopId)}
                      disabled={isFollowingThisShop}
                      className="rounded-full px-4 cursor-pointer relative z-10"
                      style={{ pointerEvents: "auto" }}
                    >
                      {isFollowingThisShop ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isFollowed ? "Unfollowing..." : "Following..."}
                        </>
                      ) : (
                        <>{isFollowed ? "Following" : "Follow"}</>
                      )}
                    </Button>

                    <button
                      onClick={() => navigate(`/shop/${shop.shopUrl}`)}
                      className="p-2 rounded-full hover:bg-white/20 transition"
                      title="Preview"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-700" />
                    </button>

                    <button
                      onClick={() => toggleWishlist(shopId)}
                      className="p-2 rounded-full hover:bg-white/20 transition"
                      title="Add to Wishlist"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          wishlistedProducts.has(shopId)
                            ? "text-red-500 fill-current"
                            : "text-gray-500"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShopGalleryPage;

// Skeleton placeholder component
const SkeletonGalleryPlaceholder = () => (
  <div className="space-y-12">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, j) => (
            <div
              key={j}
              className="rounded-xl overflow-hidden bg-white/30 backdrop-blur-sm shadow"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
