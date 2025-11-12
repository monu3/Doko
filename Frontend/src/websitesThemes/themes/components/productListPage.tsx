"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Heart,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Facebook,
  Twitter,
  Share,
  Loader2,
} from "lucide-react";
import { ProductCatalogProps } from "@/websitesThemes/types/header";
import { useCategory } from "@/hooks/useCategory";
import { useProduct1 } from "@/hooks/useProduct1";
import { useCustomer } from "@/hooks/useCustomer";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useProductList } from "@/hooks/useProductList";
import { Product, ProductWithVariants } from "@/product/types/product";
import { toast } from "react-toastify";

const ProductListPage: React.FC<ProductCatalogProps> = ({
  selectedCategoryId = "",
  selectedCategoryName = "All Products",
  onProductClick,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  productsPerPage,
  setProductsPerPage,
  isHomePage,
}) => {
  const { products, status: productStatus } = useProduct1();
  const { categories } = useCategory();

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
  const { isAuthenticated } = useCustomer();

  // Use the product list utilities
  const {
    getProductImages,
    getCurrentProductImage,
    getProductImage,
    generateVariants,
    getCategoryBannerImage,
    filterAndSortProducts,
    isWishlistActionLoading,
    handleVariantChange,
    handleProductHover,
    calculateProductDiscount,
  } = useProductList();

  // Quick view modal state
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithVariants | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});

  const [quickViewAddingToCart, setQuickViewAddingToCart] = useState(false);

  // Hover image state
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});

  // Image cycling effect for hovered products
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (hoveredProduct) {
      const product = products.find((p) => p.id === hoveredProduct);
      if (product) {
        const images = getProductImages(product);
        if (images.length > 1) {
          interval = setInterval(() => {
            setCurrentImageIndex((prev) => ({
              ...prev,
              [hoveredProduct]:
                ((prev[hoveredProduct] || 0) + 1) % images.length,
            }));
          }, 1500);
        }
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [hoveredProduct, products, getProductImages]);

  // Use the utility function for filtered products
  const filteredAndSortedProducts = filterAndSortProducts(
    products,
    selectedCategoryId,
    priceRange,
    sortBy,
    productsPerPage,
    selectedCategoryName
  );

  // Calculate category products count
  const categoryProducts = (() => {
    if (
      !selectedCategoryId ||
      selectedCategoryId === "" ||
      selectedCategoryName === "All Products" ||
      selectedCategoryName === "HOME"
    ) {
      return products;
    }

    return products.filter((product) => {
      return (
        String(product.categoryId).trim() === String(selectedCategoryId).trim()
      );
    });
  })();

  // Get category banner image using utility
  const categoryBannerImage = getCategoryBannerImage(
    selectedCategoryId,
    selectedCategoryName,
    categories
  );

  // Open quick view modal
  const openQuickView = (product: Product) => {
    setSelectedProduct({
      ...product,
      variants: generateVariants(product),
    });
    setSelectedImageIndex(0);
    setQuantity(1);
    setSelectedVariants({});
    setIsQuickViewOpen(true);
  };

  // Handle product hover end
  const handleProductHoverEnd = () => {
    setHoveredProduct(null);
  };

  // Handle product card click
  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  // Helper function to handle add to cart
  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info("Please sign in to add items to cart", { autoClose: 2000 });
      return;
    }

    try {
      const variantString = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

      optimisticAdd(product.id);

      await addItemToCart({
        productId: product.id,
        quantity: 1, // Use quantity 1 for quick add from product list
        selectedVariant: variantString || undefined,
      }).unwrap();

      toast.success("Item added to cart", { autoClose: 2000 });
      fetchGroupedItems();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart. Please try again.", {
        autoClose: 2000,
      });
    }
  };

  // Helper function to handle wishlist toggle
  const handleWishlistToggle = async (
    product: Product,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info("Please sign in to add items to wishlist", {
        autoClose: 2000,
      });
      return;
    }

    const productIsInWishlist = isInWishlist(product.id);

    try {
      if (productIsInWishlist) {
        optimisticRemoveFromWishlist(product.id);
        await removeItem(product.id).unwrap();
        toast.success("Item removed from wishlist", { autoClose: 2000 });
      } else {
        optimisticAddToWishlist(product.id);
        await addItemToWishlist(product.id).unwrap();
        toast.success("Item added to wishlist", { autoClose: 2000 });
      }

      fetchWishlistItems();
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      toast.error("Failed to update wishlist. Please try again.", {
        autoClose: 2000,
      });
    }
  };

  // Quick view add to cart with loading state
  const handleQuickViewAddToCart = async (
    product: Product,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated || !product) {
      toast.info("Please sign in to add items to cart", { autoClose: 2000 });
      return;
    }

    setQuickViewAddingToCart(true);

    try {
      const variantString = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

      optimisticAdd(product.id);

      await addItemToCart({
        productId: product.id,
        quantity: quantity,
        selectedVariant: variantString || undefined,
      }).unwrap();

      toast.success("Item added to cart", { autoClose: 2000 });
      fetchGroupedItems();
      setIsQuickViewOpen(false);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart. Please try again.", {
        autoClose: 2000,
      });
    } finally {
      setQuickViewAddingToCart(false);
    }
  };

  // Quick view wishlist toggle
  const handleQuickViewWishlistToggle = async () => {
    if (!isAuthenticated || !selectedProduct) {
      toast.info("Please sign in to add items to wishlist", {
        autoClose: 2000,
      });
      return;
    }

    const productIsInWishlist = isInWishlist(selectedProduct.id);

    try {
      if (productIsInWishlist) {
        optimisticRemoveFromWishlist(selectedProduct.id);
        await removeItem(selectedProduct.id).unwrap();
        toast.success("Item removed from wishlist", { autoClose: 2000 });
      } else {
        optimisticAddToWishlist(selectedProduct.id);
        await addItemToWishlist(selectedProduct.id).unwrap();
        toast.success("Item added to wishlist", { autoClose: 2000 });
      }

      fetchWishlistItems();
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      toast.error("Failed to update wishlist. Please try again.", {
        autoClose: 2000,
      });
    }
  };

  // Loading skeleton
  if (productStatus === "loading") {
    return (
      <div className="bg-gray-50">
        <div className="relative">
          <Skeleton className="h-80 w-full" />
        </div>

        <div className="py-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-3">
                <Skeleton className="h-96 w-full rounded-2xl" />
              </div>
              <div className="col-span-9">
                <Skeleton className="h-8 w-32 mb-8" />
                <div className="grid grid-cols-3 gap-6">
                  {[...Array(6)].map((_, idx) => (
                    <Skeleton key={idx} className="h-96 w-full rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Category Banner - Only show on non-home pages */}
      {!isHomePage && (
        <div
          className="relative h-64 bg-gradient-to-r from-black/70 to-black/50 flex items-center"
          style={{
            backgroundImage: `url(${categoryBannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-white">
              <div className="flex items-center text-white/80 mb-4 space-x-2">
                <span>🏠</span> <span>›</span> <span>Products</span>
                {selectedCategoryName !== "All Products" &&
                  selectedCategoryName !== "HOME" && (
                    <>
                      <span>›</span> <span>{selectedCategoryName}</span>
                    </>
                  )}
              </div>
              <h1 className="text-5xl font-bold mb-4">
                {selectedCategoryName}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="py-8">
        <div className="container mx-auto px-6">
          {/* Grid layout */}
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="col-span-3 bg-white p-6 rounded-2xl shadow-sm h-fit">
              {/* Filter by price */}
              <h3 className="text-lg font-semibold mb-4">Filter by price</h3>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={1000000}
                step={1}
                className="mb-4"
              />
              <p className="text-sm text-center my-3 text-gray-700">
                Price: NPR{priceRange[0]} — NPR{priceRange[1]}
              </p>

              <div className="border-t my-6" />

              {/* Sort Options */}
              <h3 className="text-lg font-semibold mb-4">Sort by</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="price-low-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high-low">
                    Price: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="border-t my-6" />

              {/* Products per page */}
              <h3 className="text-lg font-semibold mb-4">Show</h3>
              <Select
                value={productsPerPage.toString()}
                onValueChange={(value) =>
                  setProductsPerPage(Number.parseInt(value))
                }
              >
                <SelectTrigger className="w-full mb-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Products</SelectItem>
                  <SelectItem value="12">12 Products</SelectItem>
                  <SelectItem value="24">24 Products</SelectItem>
                </SelectContent>
              </Select>

              <div className="border-t my-6" />

              {/* Category Info */}
              <h3 className="text-lg font-semibold mb-4">Category</h3>
              <div className="text-sm">
                <p className="font-semibold">{selectedCategoryName}</p>
                <p className="text-gray-600">
                  {categoryProducts.length} products found
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-9">
              {/* Page Title - Only show on non-home pages */}
              {!isHomePage && (
                <div className="mb-8">
                  <h2 className="text-3xl font-bold">{selectedCategoryName}</h2>
                  <p className="text-gray-600 mt-2">
                    Showing {filteredAndSortedProducts.length} of{" "}
                    {categoryProducts.length} products
                  </p>
                </div>
              )}

              {/* Authentication Notice */}
              {!isAuthenticated && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Sign in</strong> to add items to your cart and
                    wishlist.
                  </p>
                </div>
              )}

              {/* Products */}
              {filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {selectedCategoryId && selectedCategoryId !== ""
                      ? `No products found in "${selectedCategoryName}".`
                      : "No products available."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product) => {
                    // Use the utility function for discount calculation
                    const { hasDiscount, discountPercentage } =
                      calculateProductDiscount(product);

                    const images = getProductImages(product);
                    const hasMultipleImages = images.length > 1;
                    const productImage =
                      hoveredProduct === product.id && hasMultipleImages
                        ? getCurrentProductImage(product, currentImageIndex)
                        : getProductImage(product);

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden cursor-pointer"
                        onMouseEnter={() =>
                          handleProductHover(
                            setHoveredProduct,
                            setCurrentImageIndex,
                            products,
                            product.id
                          )
                        }
                        onMouseLeave={handleProductHoverEnd}
                        onClick={() => handleProductClick(product)}
                      >
                        {/* Product Image Container */}
                        <div className="relative overflow-hidden rounded-t-3xl">
                          {hasDiscount && (
                            <Badge className="absolute top-4 left-4 bg-red-500 text-white z-10 px-3 py-1">
                              -{discountPercentage}%
                            </Badge>
                          )}

                          {/* Stock Status Badge */}
                          {product.stock !== undefined &&
                            product.stock <= 0 && (
                              <Badge className="absolute top-4 right-4 bg-gray-500 text-white z-10 px-3 py-1">
                                Out of Stock
                              </Badge>
                            )}

                          {/* Product Image */}
                          <img
                            src={productImage}
                            alt={product.name}
                            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "/placeholder.svg?height=400&width=300";
                            }}
                          />

                          {/* Hover Actions */}
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex flex-col gap-2">
                              {/* Add to Wishlist */}
                              <Button
                                size="icon"
                                variant="secondary"
                                className={`rounded-full shadow-lg transition-all duration-200 ${
                                  isInWishlist(product.id)
                                    ? "bg-red-500 text-white hover:bg-red-600 scale-110"
                                    : "bg-white/90 hover:bg-white hover:scale-105"
                                }`}
                                onClick={(e) =>
                                  handleWishlistToggle(product, e)
                                }
                                title={
                                  isInWishlist(product.id)
                                    ? "Remove from Wishlist"
                                    : "Add to Wishlist"
                                }
                                disabled={isWishlistActionLoading(
                                  product.id,
                                  isAddingToWishlist,
                                  isRemovingFromWishlist
                                )}
                              >
                                {isWishlistActionLoading(
                                  product.id,
                                  isAddingToWishlist,
                                  isRemovingFromWishlist
                                ) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Heart
                                    className={`h-4 w-4 ${
                                      isInWishlist(product.id)
                                        ? "fill-current"
                                        : ""
                                    }`}
                                  />
                                )}
                              </Button>

                              {/* Quick View */}
                              <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full bg-white/90 hover:bg-white shadow-lg hover:scale-105 transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openQuickView(product);
                                }}
                                title="Quick View"
                              >
                                <Search className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-blue-600">
                              {product.name || "Unnamed Product"}
                            </h3>
                            <div className="flex items-center gap-2">
                              {hasDiscount && product.discountPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  Rs. {product.discountPrice}
                                </span>
                              )}
                              <span className="text-lg font-semibold text-red-600">
                                Rs. {product.price || "0"}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-4">
                            {selectedCategoryName}
                          </p>

                          {/* Add to Cart Button */}
                          <Button
                            className="w-2/5 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 font-semibold flex items-center justify-center gap-2"
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={
                              isAddingToCart(product.id) ||
                              (product.stock !== undefined &&
                                product.stock <= 0)
                            }
                          >
                            {isAddingToCart(product.id) ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4" />
                                Add to cart
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick View Modal */}
          <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
              {selectedProduct && (
                <div className="grid grid-cols-2 gap-0">
                  {/* Left side - Product Images */}
                  <div className="p-6">
                    <div className="relative mb-4">
                      <img
                        src={
                          getProductImages(selectedProduct)[
                            selectedImageIndex
                          ] || "/placeholder.svg"
                        }
                        alt={selectedProduct.name}
                        className="w-full h-96 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=400&width=400";
                        }}
                      />
                    </div>

                    {/* Thumbnail Images */}
                    {getProductImages(selectedProduct).length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {getProductImages(selectedProduct).map(
                          (image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                selectedImageIndex === index
                                  ? "border-blue-500"
                                  : "border-gray-200"
                              }`}
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`${selectedProduct.name} ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "/placeholder.svg?height=80&width=80";
                                }}
                              />
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right side - Product Details */}
                  <div className="p-6 border-l">
                    <DialogHeader className="mb-6">
                      <DialogTitle className="text-2xl font-bold text-left">
                        {selectedProduct.name}
                      </DialogTitle>
                    </DialogHeader>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-bold text-red-600">
                        Rs. {selectedProduct.price || "0"}
                      </span>
                      {selectedProduct.discountPrice &&
                        selectedProduct.discountPrice >
                          selectedProduct.price && (
                          <span className="text-lg text-gray-500 line-through">
                            Rs. {selectedProduct.discountPrice}
                          </span>
                        )}
                    </div>

                    {/* Description instead of rating */}
                    {selectedProduct.description && (
                      <div className="mb-6">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {selectedProduct.description}
                        </p>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-sm font-medium">Quantity:</span>
                      <div className="flex items-center border rounded-full">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-4 py-2 min-w-[3rem] text-center">
                          {quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => setQuantity(quantity + 1)}
                          disabled={
                            selectedProduct.stock !== undefined &&
                            selectedProduct.stock > 0 &&
                            quantity >= selectedProduct.stock
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {selectedProduct.stock &&
                        quantity >= selectedProduct.stock && (
                          <span className="text-sm text-red-600">
                            Maximum quantity reached
                          </span>
                        )}
                    </div>

                    {/* Product Variants - Row-wise with Proper Selection */}
                    {selectedProduct.variants &&
                      selectedProduct.variants.length > 0 && (
                        <div className="mb-6 space-y-4">
                          {selectedProduct.variants.map((variant, index) => (
                            <div key={index} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 capitalize">
                                {variant.label || variant.name}
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {variant.values.map((value, valueIndex) => {
                                  // This should now work correctly - only one value per variant type can be selected
                                  const isSelected =
                                    selectedVariants[variant.name] === value;
                                  return (
                                    <button
                                      key={valueIndex}
                                      type="button"
                                      onClick={() =>
                                        handleVariantChange(
                                          setSelectedVariants,
                                          variant.name,
                                          value
                                        )
                                      }
                                      className={`px-3 py-2 text-xs border rounded-md transition-colors ${
                                        isSelected
                                          ? "bg-blue-600 text-white border-blue-600"
                                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                                      }`}
                                    >
                                      {value}
                                    </button>
                                  );
                                })}
                              </div>
                              {selectedVariants[variant.name] && (
                                <p className="text-xs text-green-600">
                                  Selected: {selectedVariants[variant.name]}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Add to Cart Button */}
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 mb-4"
                      onClick={(e) =>
                        handleQuickViewAddToCart(selectedProduct, e)
                      }
                      disabled={
                        quickViewAddingToCart ||
                        (selectedProduct.stock !== undefined &&
                          selectedProduct.stock <= 0)
                      }
                    >
                      {quickViewAddingToCart ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding to Cart...
                        </>
                      ) : (
                        "Add To Cart"
                      )}
                    </Button>

                    {/* Add to Wishlist */}
                    <Button
                      variant="outline"
                      className={`w-full mb-4 flex items-center justify-center gap-2 ${
                        isInWishlist(selectedProduct.id)
                          ? "bg-red-50 border-red-300 text-red-600"
                          : "bg-transparent"
                      }`}
                      onClick={handleQuickViewWishlistToggle}
                      disabled={isWishlistActionLoading(
                        selectedProduct.id,
                        isAddingToWishlist,
                        isRemovingFromWishlist
                      )}
                    >
                      {isWishlistActionLoading(
                        selectedProduct.id,
                        isAddingToWishlist,
                        isRemovingFromWishlist
                      ) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart
                          className={`h-4 w-4 ${
                            isInWishlist(selectedProduct.id)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                      )}
                      {isWishlistActionLoading(
                        selectedProduct.id,
                        isAddingToWishlist,
                        isRemovingFromWishlist
                      )
                        ? "Updating..."
                        : isInWishlist(selectedProduct.id)
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"}
                    </Button>

                    {/* Authentication Notice */}
                    {!isAuthenticated && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Sign in</strong> to add items to your cart and
                          wishlist.
                        </p>
                      </div>
                    )}

                    {/* Social Share */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Social Share:</span>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Facebook className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full bg-blue-400 text-white hover:bg-blue-500"
                        >
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full bg-red-500 text-white hover:bg-red-600"
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
