"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Facebook,
  Twitter,
  Share,
  ArrowLeft,
  Star,
  Loader2,
} from "lucide-react";
import { ProductDetailPageProps } from "@/websitesThemes/types/header";
import { useCustomer } from "@/hooks/useCustomer";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useProductDetail } from "@/hooks/useProductDetail";

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
}) => {
  // Use the customer hook
  const { isAuthenticated } = useCustomer();

  const { addItemToCart, fetchGroupedItems, isAddingToCart, optimisticAdd } =
    useCart();

  const {
    isInWishlist,
    addItemToWishlist,
    removeItem,
    fetchItems: fetchWishlistItems,
    isAddingToWishlist,
    isRemovingFromWishlist,
    optimisticAdd: optimisticAddToWishlist,
    optimisticRemove: optimisticRemoveFromWishlist,
  } = useWishlist();

  // Use the product detail utilities
  const {
    getProductImages,
    generateVariants,
    calculateDiscount,
    isWishlistActionLoading,
  } = useProductDetail();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});

  // Loading states
  const [buyingNow, setBuyingNow] = useState(false);

  // Get product data using utilities
  const productImages = getProductImages(product);
  const variants = generateVariants(product);
  const { hasDiscount, discountPercentage } = calculateDiscount(product);

  // Helper function to handle add to cart with loading state
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      console.log("Please sign in to add items to cart");
      return;
    }

    try {
      // Build selected variant string
      const variantString = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

      // Use optimistic update for immediate UI feedback
      optimisticAdd(product.id);

      await addItemToCart({
        productId: product.id,
        quantity: quantity,
        selectedVariant: variantString || undefined,
      }).unwrap();

      // Refresh cart after adding
      fetchGroupedItems();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // Helper function to handle buy now with loading state
  const handleBuyNow = async () => {
    setBuyingNow(true);

    try {
      // First add to cart
      await handleAddToCart();

      // Simulate navigation to checkout
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Proceeding to checkout...");
      // TODO: Redirect to checkout

      setBuyingNow(false);
    } catch (error) {
      setBuyingNow(false);
    }
  };

  // In your ProductDetailPage component, update the handler
  const handleVariantSelection = (variantType: string, option: string) => {
    setSelectedVariants((prev) => {
      // If the same value is clicked again, deselect it
      if (prev[variantType] === option) {
        const newVariants = { ...prev };
        delete newVariants[variantType];
        return newVariants;
      }
      // Otherwise, select the new value
      return {
        ...prev,
        [variantType]: option,
      };
    });
  };

  // Helper function to handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      console.log("Please sign in to add items to wishlist");
      return;
    }

    const productIsInWishlist = isInWishlist(product.id);

    try {
      // Use optimistic update for immediate UI feedback
      if (productIsInWishlist) {
        optimisticRemoveFromWishlist(product.id);
        await removeItem(product.id).unwrap();
      } else {
        optimisticAddToWishlist(product.id);
        await addItemToWishlist(product.id).unwrap();
      }

      // Refresh wishlist after update
      fetchWishlistItems();
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  const isAddingToCartForThisProduct = isAddingToCart(product.id);
  const isWishlistLoadingForThisProduct = isWishlistActionLoading(
    product.id,
    isAddingToWishlist,
    isRemovingFromWishlist
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-64 bg-gradient-to-r from-black/70 to-black/50 flex items-center"
        style={{
          backgroundImage: `url(${productImages[0]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center text-white text-sm space-x-2">
              <span>Home</span> <span>›</span> <span>Products</span>{" "}
              <span>›</span> <span>{product.category?.name || "Category"}</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">{product.name}</h1>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-12 gap-12">
          {/* Product Images */}
          <div className="col-span-6">
            <div className="sticky top-8">
              {/* Main Image */}
              <div className="relative mb-6">
                {hasDiscount && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white z-10 px-3 py-2 text-lg">
                    -{discountPercentage}%
                  </Badge>
                )}
                <img
                  src={productImages[selectedImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-2xl shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg?height=600&width=600";
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-blue-500 scale-105"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=80&width=80";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="col-span-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              {/* Product Title and Price */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4">{product.name}</h2>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-red-600">
                    Rs. {product.price}
                  </span>
                  {hasDiscount && product.discountPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      Rs. {product.discountPrice}
                    </span>
                  )}
                </div>

                {/* Star Rating Placeholder - Replace with Description */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">(4.5 out of 5)</span>
                </div>

                {product.description && (
                  <div className="mb-8">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Product Variants - Row-wise with Proper Selection */}
              <div className="mb-8 space-y-6">
                {Object.entries(variants).map(([variantType, options]) => (
                  <div key={variantType} className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-800 capitalize">
                      {variantType}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {options.map((option) => {
                        const isSelected =
                          selectedVariants[variantType] === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              handleVariantSelection(variantType, option)
                            }
                            className={`px-4 py-2 text-sm rounded-lg border-2 transition-all duration-200 font-medium ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {/* Show selected value for this variant */}
                    {selectedVariants[variantType] && (
                      <p className="text-sm text-green-600">
                        Selected:{" "}
                        <span className="font-medium">
                          {selectedVariants[variantType]}
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {/* Quantity Selector */}
              <div className="flex items-center gap-6 mb-8">
                <span className="font-semibold text-gray-800">Quantity:</span>
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 rounded-l-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 py-3 min-w-[4rem] text-center font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 rounded-r-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex mb-8 gap-5">
                <div>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white text-lg font-semibold"
                    onClick={handleAddToCart}
                    disabled={
                      isAddingToCartForThisProduct ||
                      (product.stock !== undefined && product.stock <= 0)
                    }
                  >
                    {isAddingToCartForThisProduct ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
                {/* Add to Wishlist */}
                <div>
                  <Button
                    className={`${
                      isInWishlist(product.id)
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-pink-600 hover:bg-pink-700 text-white"
                    } text-lg font-semibold`}
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoadingForThisProduct}
                  >
                    {isWishlistLoadingForThisProduct ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Heart
                        className={`h-5 w-5 mr-2 ${
                          isInWishlist(product.id) ? "fill-current" : ""
                        }`}
                      />
                    )}
                    {isWishlistLoadingForThisProduct
                      ? "Updating..."
                      : isInWishlist(product.id)
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                  </Button>
                </div>
              </div>

              {/* Buy it Now */}
              <Button
                className="w-full bg-red-700 hover:bg-red-800 text-white py-4 text-lg font-semibold"
                onClick={handleBuyNow}
                disabled={buyingNow}
              >
                {buyingNow ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Buy it now"
                )}
              </Button>

              {/* Social Share */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">
                    Social Share:
                  </span>
                  <div className="flex gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full bg-blue-400 text-white border-blue-400 hover:bg-blue-500"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full bg-red-500 text-white border-red-500 hover:bg-red-600"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg p-1 shadow-sm">
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold"
              >
                Product Reviews
              </TabsTrigger>
              <TabsTrigger
                value="additional"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold"
              >
                Additional Info
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold"
              >
                Custom Content
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent
                value="description"
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-bold mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description ||
                    "This is a high-quality product designed with attention to detail and crafted from premium materials. It offers excellent functionality and durability, making it perfect for everyday use. The design combines modern aesthetics with practical features to provide the best user experience."}
                </p>
              </TabsContent>

              <TabsContent
                value="reviews"
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="font-semibold">John Doe</span>
                      <span className="text-gray-500 text-sm">2 days ago</span>
                    </div>
                    <p className="text-gray-700">
                      Excellent product! Great quality and fast delivery. Highly
                      recommended.
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                      <span className="font-semibold">Jane Smith</span>
                      <span className="text-gray-500 text-sm">1 week ago</span>
                    </div>
                    <p className="text-gray-700">
                      Good product overall. The quality is as expected and it
                      arrived on time.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="additional"
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-bold mb-4">
                  Additional Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Weight:</span>
                    <span className="ml-2 text-gray-700">2.5 kg</span>
                  </div>
                  <div>
                    <span className="font-semibold">Dimensions:</span>
                    <span className="ml-2 text-gray-700">30 x 20 x 15 cm</span>
                  </div>
                  <div>
                    <span className="font-semibold">Material:</span>
                    <span className="ml-2 text-gray-700">Premium Quality</span>
                  </div>
                  <div>
                    <span className="font-semibold">Warranty:</span>
                    <span className="ml-2 text-gray-700">1 Year</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent
                value="custom"
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-bold mb-4">Custom Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  This section can be customized with any additional content
                  such as care instructions, shipping information, return
                  policy, or any other relevant details about the product.
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
