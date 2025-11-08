"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Heart,
  ShoppingCart,
  Menu,
  User,
  LogOut,
  Settings,
  Package,
  Loader2,
} from "lucide-react";
import SignupDialog from "./signupDialog";
import WishlistSidebar from "./wishlistSidebar";
import { useCustomer } from "@/hooks/useCustomer";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

interface CustomerHeaderProps {
  onCategorySelect?: (categoryId: string, categoryName: string) => void;
  onHomeSelect?: () => void;
  onCartClick?: () => void; // New prop for cart navigation
  selectedCategory?: string;
  signupDialogOpen?: boolean;
  onSignupDialogChange?: (open: boolean) => void;
}

export default function CustomerHeader({
  onHomeSelect,
  onCartClick, // New prop
  signupDialogOpen = false,
  onSignupDialogChange,
}: CustomerHeaderProps) {
  // const dispatch = useAppDispatch();

  const { user, isAuthenticated, logoutUser, logoutLoading, loadCounts } =
    useCustomer();
  const { summary: cartSummary } = useCart();
  const { items: wishlistItems, fetchCount } = useWishlist();

  // const { user, isAuthenticated, logoutLoading } = useAppSelector(
  //   (state) => state.customerHeader
  // );

  // const { summary: cartSummary } = useAppSelector((state) => state.cart);
  // const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  // const [signupDialogOpen, setSignupDialogOpen] = useState(false);
  const [internalSignupDialogOpen, setInternalSignupDialogOpen] =
    useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistSidebarOpen, setWishlistSidebarOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isSignupDialogOpen = signupDialogOpen || internalSignupDialogOpen;
  const setSignupDialogOpen =
    onSignupDialogChange || setInternalSignupDialogOpen;

  // Load cart and wishlist counts when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCounts();
      fetchCount();
    }
  }, [isAuthenticated, user, loadCounts, fetchCount]);

  // Refresh counts periodically when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const interval = setInterval(() => {
        loadCounts();
        fetchCount();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, loadCounts, fetchCount]);

  const handleSignInClick = () => {
    setSignupDialogOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logoutUser(); // logout is the thunk returned by useCustomerAuth()
    } catch (err) {
      // optional: show toast or console.log
      console.error("Logout failed", err);
    } finally {
      // close any open UI states after logout
      setMobileMenuOpen(false);
      setWishlistSidebarOpen(false);
      setInternalSignupDialogOpen(false);
    }
  };

  const getUserAvatar = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const navigationItems = [
    { name: "Home", href: "#", onClick: onHomeSelect },
    { name: "Explore", href: "#" },
  ];

  // Get cart and wishlist counts with fallbacks
  const cartCount = cartSummary?.totalItems || 0;
  const wishlistCount = wishlistItems?.length || 0;

  const handleCartClick = () => {
    onCartClick?.();
  };

  const handleWishlistClick = () => {
    if (isAuthenticated) {
      setWishlistSidebarOpen(true);
    } else {
      setSignupDialogOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">Doko</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="sm"
                className="relative cursor-pointer"
                onClick={handleWishlistClick}
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="relative cursor-pointer"
                onClick={handleCartClick}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* User Authentication */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                          {getUserAvatar(user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.email}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          Customer Account
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={logoutLoading}
                    >
                      {logoutLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                      )}
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={handleSignInClick} size="sm">
                  Sign in
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4">
                    {navigationItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          item.onClick?.();
                          setMobileMenuOpen(false);
                        }}
                        className="text-left text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        {item.name}
                      </button>
                    ))}

                    {/* Mobile Cart and Wishlist Links */}
                    {isAuthenticated && (
                      <>
                        <button
                          onClick={() => {
                            handleCartClick();
                            setMobileMenuOpen(false);
                          }}
                          className="text-left text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2"
                        >
                          <ShoppingCart className="h-5 w-5" />
                          Cart ({cartCount})
                        </button>
                        <button
                          onClick={() => {
                            handleWishlistClick();
                            setMobileMenuOpen(false);
                          }}
                          className="text-left text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Heart className="h-5 w-5" />
                          Wishlist ({wishlistCount})
                        </button>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Signup Dialog */}
      <SignupDialog
        open={isSignupDialogOpen}
        onOpenChange={setSignupDialogOpen}
      />

      {/* Wishlist Sidebar */}
      <WishlistSidebar
        isOpen={wishlistSidebarOpen}
        onOpenChange={setWishlistSidebarOpen}
        onProductClick={(product) => {
          // Handle product click if needed
          console.log("Product clicked from wishlist:", product);
        }}
      />
    </>
  );
}
