import React from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { useHeaderData, useHeaderHandlers } from "../helper/HeaderHelper";
import { HeaderProps } from "@/websitesThemes/types/header";
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
    <header className="bg-gradient-to-r from-rose-50 to-amber-50 border-b-2 border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Luxury Banner */}
        <div className="text-center py-3 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-sm font-medium -mx-4 sm:-mx-6 lg:-mx-8">
          ✨ Exclusive Holiday Collection - Up to 40% Off Selected Pieces ✨
        </div>

        <div className="py-6">
          <div className="flex items-center justify-between">
            {/* Logo Section - Centered Design */}
            <div className="flex-1">
              <div className="flex items-center">
                <div className="relative">
                  <div
                    className="w-16 h-16 bg-gradient-to-br from-rose-400 via-pink-400 to-amber-400 rounded-full p-1"
                    onClick={() => handleHomeClick(onHomeSelect)}
                  >
                    <img
                      src={
                        shop?.logoUrl ||
                        "https://images.unsplash.com/photo-1676496220343-1585b0cdcc3f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxlbGVnYW50JTIwZWFycmluZ3N8ZW58MHx8fHwxNzU3OTU4MTkzfDA&ixlib=rb-4.1.0&q=85"
                      }
                      alt="Shop Logo"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                    {shop?.businessName || "Earring Shop"}
                  </h1>
                  <p className="text-sm text-rose-500 font-medium tracking-wider">
                    FINE JEWELRY
                  </p>
                </div>
              </div>
            </div>

            {/* Center Navigation - Elegant Style */}
            <nav className="hidden lg:flex items-center space-x-12 flex-1 justify-center">
              <div
                onClick={() => handleHomeClick(onHomeSelect)}
                className={`relative cursor-pointer font-medium transition-colors
    ${!selectedCategory ? "text-rose-800" : "text-rose-600 hover:text-rose-700"}
  `}
              >
                Home
                {!selectedCategory && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-rose-600"></span>
                )}
              </div>

              {/* Visible Categories */}
              {visibleCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() =>
                    handleCategoryClick(
                      category.id,
                      category.name,
                      onCategorySelect
                    )
                  }
                  className={`relative cursor-pointer font-medium transition-colors
    ${
      selectedCategory === category.id
        ? "text-rose-800"
        : "text-rose-600 hover:text-rose-700"
    }
  `}
                >
                  {category.name}

                  {/* underline effect */}
                  {selectedCategory === category.id && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-rose-600"></span>
                  )}
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
                          ? "text-rose-800 border-rose-800"
                          : "text-rose-600 border-transparent hover:text-rose-800 hover:border-rose-300"
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
                            ? "bg-rose-50 text-rose-800"
                            : "bg-rose-50 text-rose-800"
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

            {/* Right Actions */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              {/* Elegant Search */}
              <div className="hidden md:flex items-center bg-white border-2 border-rose-200 rounded-full px-4 py-2 w-72 focus-within:border-rose-400 transition-colors">
                <Search className="w-4 h-4 text-rose-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search luxury jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-gray-700 placeholder-rose-300"
                />
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-full hover:bg-rose-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-rose-600" />
                ) : (
                  <Menu className="w-6 h-6 text-rose-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-rose-100">
            <div className="space-y-4">
              <div className="flex items-center bg-white border border-rose-200 rounded-lg px-3 py-2">
                <Search className="w-5 h-5 text-rose-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-gray-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Home Link */}
                <div
                  className={`text-rose-700 font-medium py-3 text-center bg-rose-50 rounded-lg cursor-pointer ${
                    !selectedCategory ? "text-rose-800" : "text-rose-600"
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
                    className={`cursor-pointer "text-gray-700 font-medium py-3 text-center hover:bg-rose-50 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? "text-rose-800"
                        : "text-rose-600"
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
