"use client";
import { Button } from "@/components/ui/button";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, ShoppingCart, Trash2, Plus, Loader2 } from "lucide-react";
import { useCustomerAuth } from "@/hooks/useCustomer";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import type { WishlistItem } from "@/customerView/slice/wishlistSlice";

interface WishlistSidebarProps {
  onProductClick?: (product: any) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const WishlistSidebar = ({
  onProductClick,
  isOpen,
  onOpenChange,
}: WishlistSidebarProps) => {
  const {
    items,
    loading,
    error,
    fetchItems,
    removeItem,
    clearAllItems,
    isRemovingFromWishlist,
  } = useWishlist();

  const {
    addItemToCart,
    fetchItems: fetchCartItems,
    isAddingToCart,
  } = useCart();

  const { isAuthenticated } = useCustomerAuth();

  const [clearingWishlist, setClearingWishlist] = useState(false);
  const [addingAllToCart, setAddingAllToCart] = useState(false);

  // Fetch wishlist items when component mounts or opens
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      fetchItems();
    }
  }, [fetchItems, isAuthenticated, isOpen]);

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId).unwrap();
      // Refresh wishlist after removal
      fetchItems();
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const handleClearWishlist = async () => {
    setClearingWishlist(true);
    try {
      await clearAllItems().unwrap();
      // Refresh wishlist after clearing
      fetchItems();
    } catch (error) {
      console.error("Failed to clear wishlist:", error);
    } finally {
      setClearingWishlist(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleProductClick = (item: WishlistItem) => {
    console.log("Wishlist item clicked:", item);

    if (onProductClick) {
      // Enhanced product format conversion with more complete data
      const product = {
        id: item.productId,
        productId: item.productId, // Keep both for compatibility
        name: item.productName,
        price: item.price.toString(),
        compareAtPrice: item.originalPrice?.toString(),
        image: item.productImage,
        imageUrl: item.productImage,
        images: item.productImages || [item.productImage], // Convert to array format
        shopId: item.shopId,
        description:
          item.description || `Product details for ${item.productName}`, // Add description
        category: { name: item.category || "Wishlist Item" }, // Add category
        createdAt: item.createdAt,
        stockQuantity: item.stockQuantity,
        brandName: item.brandName,
        discountPercentage: item.discountPercentage,
      };

      console.log("Converted product for navigation:", product);
      onProductClick(product);
      handleClose(); // Close wishlist sidebar
    }
  };

  const handleAddToCart = async (item: WishlistItem, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent product click when clicking add to cart

    try {
      await addItemToCart({
        productId: item.productId,
        quantity: 1,
      }).unwrap();

      // Refresh cart after adding
      fetchCartItems();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleMoveAllToCart = async () => {
    setAddingAllToCart(true);

    try {
      // Add all items to cart sequentially
      for (const item of items) {
        await addItemToCart({
          productId: item.productId,
          quantity: 1,
        }).unwrap();
      }

      // Refresh cart after adding all items
      fetchCartItems();
    } catch (error) {
      console.error("Failed to add all items to cart:", error);
    } finally {
      setAddingAllToCart(false);
    }
  };

  // Show loading state
  if (loading && items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Wishlist
            </SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading your wishlist...</span>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Show error state
  if (error && items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Wishlist
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <p className="text-red-600 mb-4">Error loading wishlist: {error}</p>
            <Button onClick={() => fetchItems()}>Try Again</Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Wishlist ({items.length})
            </SheetTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearWishlist}
                disabled={clearingWishlist}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {clearingWishlist ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  "Clear All"
                )}
              </Button>
            )}
          </div>
          <SheetDescription>
            {items.length === 0
              ? "Your wishlist is empty"
              : `${items.length} item${
                  items.length > 1 ? "s" : ""
                } in your wishlist`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <Heart className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Save your favorite products for later
            </p>
            <Button
              onClick={handleClose}
              className="bg-red-600 hover:bg-red-700"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleProductClick(item)}
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.productImage || "/placeholder.svg"}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=64&width=64";
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate mb-1 hover:text-blue-600 transition-colors">
                        {item.productName}
                      </h4>

                      {/* Brand */}
                      {item.brandName && (
                        <p className="text-xs text-gray-500 mb-1">
                          Brand: {item.brandName}
                        </p>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-red-600">
                          Rs. {item.price}
                        </span>
                        {item.originalPrice &&
                          item.originalPrice > item.price && (
                            <span className="text-xs text-gray-500 line-through">
                              Rs. {item.originalPrice}
                            </span>
                          )}
                        {item.discountPercentage && (
                          <span className="text-xs text-green-600">
                            -{item.discountPercentage}% off
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="text-xs mb-2">
                        {item.stockQuantity > 0 ? (
                          <span className="text-green-600">
                            In Stock ({item.stockQuantity} available)
                          </span>
                        ) : (
                          <span className="text-red-600">Out of Stock</span>
                        )}
                      </div>

                      {/* Added Date */}
                      <p className="text-xs text-gray-500 mb-3">
                        Added {new Date(item.createdAt).toLocaleDateString()}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-8"
                          onClick={(e) => handleAddToCart(item, e)}
                          disabled={
                            isAddingToCart(item.productId) ||
                            item.stockQuantity <= 0
                          }
                        >
                          {isAddingToCart(item.productId) ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add to Cart
                            </>
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(item.productId);
                          }}
                          disabled={isRemovingFromWishlist(item.productId)}
                        >
                          {isRemovingFromWishlist(item.productId) ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Wishlist Footer */}
            <div className="border-t pt-4 space-y-4">
              <Separator />

              <Button
                onClick={handleMoveAllToCart}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold"
                size="lg"
                disabled={
                  addingAllToCart ||
                  items.some((item) => item.stockQuantity <= 0)
                }
              >
                {addingAllToCart ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Adding All to Cart...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add All to Cart
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full bg-transparent"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistSidebar;
