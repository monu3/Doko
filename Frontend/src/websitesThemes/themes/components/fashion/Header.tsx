"use client";

import React from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeaderProps } from "@/websitesThemes/types/header";
import { useHeaderData, useHeaderHandlers } from "../helper/HeaderHelper";

const Header: React.FC<HeaderProps> = ({ onHomeSelect, selectedCategory }) => {
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
    <header className="bg-white shadow-sm border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Reduced right margin */}
          <div
            className="flex items-center space-x-2 cursor-pointer mr-6 md:mr-8"
            onClick={() => handleHomeClick(onHomeSelect)}
          >
            <img
              src={shop?.logoUrl || "/placeholder.svg"}
              alt="Shop Logo"
              className="h-10 w-10 rounded-full"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-bold text-black">
                <span className="text-blue-600">{shop?.businessName}</span>
              </span>
              <span className="text-sm text-gray-500 -mt-1">Online Store</span>
            </div>
          </div>

          {/* Desktop Nav - Reduced gap and added flex-wrap */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 flex-wrap">
            {/* HOME - Always clickable */}
            <div
              className={`hover:text-blue-600 cursor-pointer transition-colors px-2 py-1 rounded ${
                !selectedCategory || selectedCategory === ""
                  ? "text-blue-600 underline underline-offset-4 bg-blue-50"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleHomeClick(onHomeSelect)}
            >
              home
            </div>

            {/* Dynamic active categories - Show first 4 */}
            {visibleCategories.length > 0 &&
              visibleCategories.map((category) => (
                <div
                  key={category.id}
                  className={`hover:text-blue-600 cursor-pointer lowercase transition-colors px-2 py-1 rounded ${
                    selectedCategory === category.id
                      ? "text-blue-600 underline underline-offset-4 bg-blue-50"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    handleCategoryClick(category.id, category.name)
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
                    className={`hover:text-blue-600 cursor-pointer lowercase transition-colors px-2 py-1 rounded ${
                      dropdownCategories.some(
                        (cat) => selectedCategory === cat.id
                      )
                        ? "text-blue-600 underline underline-offset-4 bg-blue-50"
                        : "hover:bg-gray-100"
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
                      className={`cursor-pointer lowercase ${
                        selectedCategory === category.id
                          ? "bg-blue-50 text-blue-600"
                          : ""
                      }`}
                      onClick={() =>
                        handleCategoryClick(category.id, category.name)
                      }
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Search - Added flex-1 and adjusted margins */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-stone-50 border-stone-200 focus:border-amber-600 focus:ring-amber-600"
              />
            </div>
          </div>

          {/* Wishlist / Cart / Menu - Reduced gap */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-stone-200 py-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-stone-50 border-stone-200"
              />
            </div>

            {/* Categories */}
            <nav className="space-y-2">
              {/* HOME - Always clickable */}
              <div
                className={`block py-2 text-stone-700 hover:text-amber-600 transition-colors duration-200 font-medium ${
                  !selectedCategory || selectedCategory === ""
                    ? "text-blue-600 underline"
                    : ""
                }`}
                onClick={() => {
                  handleHomeClick();
                  setIsMenuOpen(false);
                }}
              >
                Home
              </div>

              {/* All categories in mobile view (no limit) */}
              {activeCategories.length > 0 &&
                activeCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`block py-2 text-stone-700 hover:text-amber-600 transition-colors duration-200 font-medium ${
                      selectedCategory === category.id
                        ? "text-blue-600 underline"
                        : ""
                    }`}
                    onClick={() => {
                      handleCategoryClick(category.id, category.name);
                      setIsMenuOpen(false);
                    }}
                  >
                    {category.name}
                  </div>
                ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
