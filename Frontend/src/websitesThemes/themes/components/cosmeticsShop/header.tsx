import React from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { HeaderProps } from "@/websitesThemes/types/header";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useHeaderData,
  useHeaderHandlers,
} from "@/websitesThemes/themes/components/helper/HeaderHelper";

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
    <header className="bg-white shadow-sm border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleHomeClick(onHomeSelect)}
          >
            <img
              src={
                shop?.logoUrl ||
                "https://images.unsplash.com/photo-1561408564-99cd1624ccac"
              }
              alt="shop logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-pink-800">
              {shop?.businessName}
            </span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {/* Home Link */}
            <div
              className={`text-pink-700 hover:text-pink-600 font-medium transition-colors cursor-pointer ${
                !selectedCategory ? "text-pink-800 underline" : "text-gray-600"
              }`}
              onClick={() => handleHomeClick(onHomeSelect)}
            >
              Home
            </div>

            {/* Visible Categories */}
            {visibleCategories.map((category) => (
              <div
                key={category.id}
                className={`hover:text-pink-600 font-medium transition-colors cursor-pointer ${
                  selectedCategory === category.id
                    ? "text-pink-800 underline"
                    : "text-gray-600"
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
                    className={`hover:text-pink-600 font-medium transition-colors p-0 h-auto ${
                      dropdownCategories.some(
                        (cat) => selectedCategory === cat.id
                      )
                        ? "text-pink-800 underline"
                        : "text-gray-600"
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
                          ? "bg-pink-50 text-pink-800"
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

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 w-80">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <Input
              type="text"
              placeholder="Search beauty products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none text-gray-700"
            />
          </div>

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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-pink-100">
            <div className="flex flex-col space-y-3">
              {/* Home Link */}
              <div
                className={`text-pink-700 font-medium cursor-pointer ${
                  !selectedCategory ? "text-pink-800 underline" : ""
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
                  className={`text-gray-600 font-medium cursor-pointer ${
                    selectedCategory === category.id
                      ? "text-pink-800 underline"
                      : ""
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

              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 mt-3">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <Input
                  type="text"
                  placeholder="Search beauty products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-gray-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
