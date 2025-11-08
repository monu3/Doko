"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Minus,
  Trash2,
  Heart,
  ArrowLeft,
  Star,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import CheckoutFlow from "./checkoutFlow";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useCustomer } from "@/hooks/useCustomer";
import { CartItem } from "../types";

interface CustomerCartPageProps {
  onBack?: () => void;
}

const CustomerCartPage: React.FC<CustomerCartPageProps> = ({ onBack }) => {
  const {
    itemsByShop,
    summary,
    fetchItems: fetchCart,
    updateItem,
    removeItem,
    clearAllItems,
    updateLoading,
    removeLoading,
    error,
  } = useCart();
  const {
    wishlistStatus,
    isAddingToWishlist,
    isRemovingFromWishlist,
    toggleWishlist,
  } = useWishlist();
  const { isAuthenticated } = useCustomer();

  const [clearingCart, setClearingCart] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutShopData, setCheckoutShopData] = useState<{
    shopId: string;
    shopItems: CartItem[];
  } | null>(null);

  // Fetch cart items when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Calculate subtotal for each shop
  const calculateShopSubtotal = (shopItems: CartItem[]) => {
    return shopItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  // Get shop info from the first item in the shop group
  const getShopInfo = (shopId: string, shopItems: CartItem[]) => {
    const firstItem = shopItems[0];
    return {
      id: shopId,
      name: firstItem?.shopName || "Unknown Shop",
      logo: "/placeholder.svg?height=40&width=40",
      rating: 4.5, // Mock rating
      reviewCount: "2.5K", // Mock review count
    };
  };

  const handleQuantityChange = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    await updateItem({ cartItemId, quantity: newQuantity });
    fetchCart();
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeItem(cartItemId).unwrap();
      // Refresh cart after removal
      fetchCart();
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const handleClearCart = async () => {
    setClearingCart(true);
    try {
      await clearAllItems().unwrap();
      // Refresh cart after clearing
      fetchCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setClearingCart(false);
    }
  };

  const handleMoveToWishlist = async (item: CartItem) => {
    toggleWishlist(item.productId);
  };

  const handleCheckout = (shopId: string, shopItems: CartItem[]) => {
    setCheckoutShopData({ shopId, shopItems });
    setShowCheckout(true);
  };

  // const isInWishlist = (productId: string) => {
  //   return wishlistStatus[productId] || false;
  // };

  const handleBackFromCheckout = () => {
    setShowCheckout(false);
    setCheckoutShopData(null);
  };

  const isWishlistLoadingFn = (productId: string) => {
    return isAddingToWishlist(productId) || isRemovingFromWishlist(productId);
  };

  // Show loading state
  if (!itemsByShop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="icon" onClick={onBack}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading your cart...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="icon" onClick={onBack}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading cart: {error}</p>
            <Button onClick={() => fetchCart()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  const shopEntries = Object.entries(itemsByShop);

  if (shopEntries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="icon" onClick={onBack}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <ShoppingBag className="h-24 w-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Add some products to get started with your shopping.
            </p>
            <Button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show checkout flow if triggered
  if (showCheckout && checkoutShopData) {
    return (
      <CheckoutFlow
        shopData={checkoutShopData}
        onBack={handleBackFromCheckout}
        onOrderComplete={() => {
          setShowCheckout(false);
          setCheckoutShopData(null);
          // Refresh cart after successful order
          fetchCart();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="icon" onClick={onBack}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {summary.totalItems}{" "}
                {summary.totalItems === 1 ? "item" : "items"}
              </Badge>
            </div>

            {shopEntries.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={clearingCart}
                className="text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
              >
                {clearingCart ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  "Clear Cart"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {shopEntries.map(([shopId, shopItems]) => {
            const shopInfo = getShopInfo(shopId, shopItems);
            const shopSubtotal = calculateShopSubtotal(shopItems);

            return (
              <div
                key={shopId}
                className="bg-white rounded-2xl shadow-sm border overflow-hidden"
              >
                {/* Shop Header */}
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex items-center gap-4">
                    <img
                      src={shopInfo.logo || "/placeholder.svg"}
                      alt={shopInfo.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg?height=48&width=48";
                      }}
                    />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {shopInfo.name}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{shopInfo.rating}</span>
                        </div>
                        <span>({shopInfo.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shop Items */}
                <div className="divide-y">
                  {shopItems.map((item) => {
                    const hasDiscount =
                      item.originalPrice && item.originalPrice > item.price;

                    return (
                      <div key={item.id} className="p-6">
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.productImage || "/placeholder.svg"}
                              alt={item.productName}
                              className="w-24 h-24 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "/placeholder.svg?height=96&width=96";
                              }}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {item.productName}
                                </h3>

                                {/* Variants */}
                                {item.selectedVariant && (
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Variant: {item.selectedVariant}
                                    </Badge>
                                  </div>
                                )}

                                {/* Stock Info */}
                                <div className="text-sm text-gray-500 mb-2">
                                  {item.stockQuantity > 0 ? (
                                    <span className="text-green-600">
                                      In Stock ({item.stockQuantity} available)
                                    </span>
                                  ) : (
                                    <span className="text-red-600">
                                      Out of Stock
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <div className="text-xl font-bold text-gray-900">
                                  Rs. {item.price}
                                </div>
                                {hasDiscount && (
                                  <div className="text-sm text-gray-500 line-through">
                                    Rs. {item.originalPrice}
                                  </div>
                                )}
                                {item.discountPercentage && (
                                  <div className="text-sm text-green-600">
                                    -{item.discountPercentage}% off
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Total Price for this item */}
                            <div className="text-lg font-semibold text-blue-600 mb-4">
                              Total: Rs. {item.totalPrice.toFixed(2)}
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between mt-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-4">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-full bg-transparent"
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={removeLoading[item.id]}
                                  title="Remove item"
                                >
                                  {removeLoading[item.id] ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  )}
                                </Button>

                                <div className="flex items-center border rounded-full">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    disabled={
                                      item.quantity <= 1 ||
                                      updateLoading[item.id]
                                    }
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                                    {updateLoading[item.id] ? (
                                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                    ) : (
                                      item.quantity
                                    )}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    disabled={
                                      item.quantity >= item.stockQuantity ||
                                      updateLoading[item.id]
                                    }
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Move to Wishlist */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`flex items-center gap-2 ${
                                  wishlistStatus[item.productId]
                                    ? "text-red-600 hover:text-red-700"
                                    : "text-gray-600 hover:text-gray-700"
                                }`}
                                onClick={() => handleMoveToWishlist(item)}
                                disabled={isWishlistLoadingFn(item.productId)}
                              >
                                {isWishlistLoadingFn(item.productId) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Heart
                                    className={`h-4 w-4 ${
                                      wishlistStatus[item.productId]
                                        ? "fill-current"
                                        : ""
                                    }`}
                                  />
                                )}
                                {wishlistStatus[item.productId]
                                  ? "In Wishlist"
                                  : "Move to saved"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shop Checkout Section */}
                <div className="p-6 bg-gray-50 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold text-gray-900">
                      Subtotal ({shopItems.length}{" "}
                      {shopItems.length === 1 ? "item" : "items"})
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      Rs. {shopSubtotal.toFixed(2)}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleCheckout(shopId, shopItems)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-xl"
                    size="lg"
                  >
                    Continue to checkout
                  </Button>

                  <p className="text-sm text-gray-500 text-center mt-3">
                    Taxes & shipping calculated at checkout
                  </p>
                </div>
              </div>
            );
          })}

          {/* Overall Total (if multiple shops) */}
          {shopEntries.length > 1 && (
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center justify-between text-xl font-bold">
                <span>Total ({summary.totalItems} items)</span>
                <span className="text-2xl text-blue-600">
                  Rs. {summary.totalAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Items from {shopEntries.length} different shops
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCartPage;
