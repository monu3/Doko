import React from "react";
import {
  Search,
  Menu,
  X,
  Truck,
  ShoppingBag,
  Heart,
  User,
  Filter,
  ChevronDown,
} from "lucide-react";
import { HeaderProps } from "@/websitesThemes/types/header";
import { useHeaderData, useHeaderHandlers } from "../helper/HeaderHelper";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Header: React.FC<HeaderProps> = ({
  onCategorySelect,
  onHomeSelect,
  selectedCategory,
}) => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    searchQuery,
    setSearchQuery,
    shop,
    visibleCategories,
    activeCategories,
    dropdownCategories,
  } = useHeaderData();

  const { handleCategoryClick, handleHomeClick } = useHeaderHandlers();

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Banner */}
        <div className="bg-slate-900 text-white py-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center text-sm">
            <Truck className="w-4 h-4 mr-2" />
            <span>
              Free Shipping on Orders Over NRP 750 | 30-Day Easy Returns
            </span>
          </div>
        </div>

        {/* Main Header */}
        <div className="py-4">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleHomeClick(onHomeSelect)}
            >
              <div className="bg-gradient-to-br from-slate-800 to-slate-600 p-3 rounded-2xl">
                <img
                  src={
                    shop?.logoUrl ||
                    "https://images.unsplash.com/photo-1554235676-64bb6cc8136a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxzdHlsaXNoJTIwc2hvZXN8ZW58MHx8fHwxNzU3OTU4MTg3fDA&ixlib=rb-4.1.0&q=85"
                  }
                  alt="shop Logo"
                  className="w-8 h-8 rounded-lg object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {shop?.businessName}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  PREMIUM FOOTWEAR
                </p>
              </div>
            </div>

            {/* Center - Search Bar (Prominent) */}
            <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-slate-500 focus:ring-slate-500 text-gray-900"
                  placeholder="Search shoes, brands, styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="search"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Filter className="h-5 w-5 text-gray-400 hover:text-slate-600 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center space-x-4">
              <button className="hidden lg:flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">Wishlist</span>
              </button>
              <button className="hidden lg:flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Account</span>
              </button>
              <button className="bg-slate-800 text-white px-4 py-2 rounded-xl font-medium hover:bg-slate-700 transition-colors flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Cart</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  3
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation Bar - Replaced with Categories */}
          <nav className="hidden md:flex items-center justify-center space-x-12 mt-6 pt-6 border-t border-gray-100">
            {/* Home Link */}
            <div
              className={`cursor-pointer font-medium transition-colors pb-2 border-b-2 ${
                !selectedCategory
                  ? "text-slate-800 border-slate-800"
                  : "text-slate-600 border-transparent hover:text-slate-800 hover:border-slate-300"
              }`}
              onClick={() => handleHomeClick(onHomeSelect)}
            >
              Home
            </div>

            {/* Visible Categories */}
            {visibleCategories.map((category) => (
              <div
                key={category.id}
                className={`cursor-pointer font-medium transition-colors pb-2 border-b-2 ${
                  selectedCategory === category.id
                    ? "text-slate-800 border-slate-800"
                    : "text-slate-600 border-transparent hover:text-slate-800 hover:border-slate-300"
                }`}
                onClick={() =>
                  handleCategoryClick(
                    category.id,
                    category.name,
                    onCategorySelect
                  )
                }
              >
                {category.name}
              </div>
            ))}

            {/* Dropdown for remaining categories */}
            {dropdownCategories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`font-medium transition-colors p-0 h-auto pb-2 border-b-2 ${
                      dropdownCategories.some(
                        (cat) => selectedCategory === cat.id
                      )
                        ? "text-slate-800 border-slate-800"
                        : "text-slate-600 border-transparent hover:text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    More
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {dropdownCategories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      className={`cursor-pointer ${
                        selectedCategory === category.id
                          ? "bg-slate-50 text-slate-800"
                          : ""
                      }`}
                      onClick={() =>
                        handleCategoryClick(
                          category.id,
                          category.name,
                          onCategorySelect
                        )
                      }
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <Input
                  type="text"
                  placeholder="Search shoes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-gray-700"
                />
              </div>

              {/* Mobile Categories */}
              <div className="grid grid-cols-2 gap-3">
                {/* Home Link */}
                <div
                  className={`cursor-pointer font-medium py-2 ${
                    !selectedCategory ? "text-slate-800" : "text-slate-600"
                  }`}
                  onClick={() => {
                    handleHomeClick(onHomeSelect);
                    setIsMenuOpen(false);
                  }}
                >
                  Home
                </div>

                {/* All categories in mobile view */}
                {activeCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`cursor-pointer font-medium py-2 ${
                      selectedCategory === category.id
                        ? "text-slate-800"
                        : "text-slate-600"
                    }`}
                    onClick={() => {
                      handleCategoryClick(
                        category.id,
                        category.name,
                        onCategorySelect
                      );
                      setIsMenuOpen(false);
                    }}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
