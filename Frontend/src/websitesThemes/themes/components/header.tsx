"use client";

import type React from "react";
import { Input } from "@/components/ui/input";

import { Search, User, Facebook, Instagram } from "lucide-react";
import { HeaderProps } from "@/websitesThemes/types/header";
import { useHeaderData, useHeaderHandlers } from "./helper/HeaderHelper";
import {
  handleSocialClick,
  useFooterData,
} from "@/websitesThemes/themes/components/helper/FooterHelper";

const HeaderDefault: React.FC<HeaderProps> = ({
  onHomeSelect,
  selectedCategory,
}) => {
  const { shop, activeCategories } = useHeaderData();
  const { socialLinks } = useFooterData();

  const { handleCategoryClick, handleHomeClick } = useHeaderHandlers();

  return (
    <div className="shadow-md">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 px-6 bg-white">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-tight">
            <img
              src={shop?.logoUrl || "/placeholder.svg"}
              alt="Shop Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-2xl font-bold text-black">
              <span className="text-blue-600">{shop?.businessName}</span>
            </span>
            <span className="text-sm text-gray-500 -mt-1">Online Store</span>
          </div>
        </div>

        {/* Center: Search bar */}
        <div className="flex items-center w-1/2">
          <Input
            type="text"
            placeholder="Product, brand, name, keyword, ..."
            className="rounded-r-none"
          />
          <button className="bg-white border border-l-0 px-4 py-2 rounded-r-md">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-700 border-r pr-4">
            Track Order
          </span>
          <User className="w-5 h-5" color="#0000FF" />
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <div className="bg-white border-t">
        <nav className="flex justify-between items-center px-6 py-2">
          <ul className="flex items-center gap-6 text-sm font-bold">
            {/* HOME - Always clickable */}
            <li
              className={`hover:text-blue-600 cursor-pointer transition-colors px-2 py-1 rounded ${
                !selectedCategory || selectedCategory === ""
                  ? "text-blue-600 underline underline-offset-4 bg-blue-50"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleHomeClick(onHomeSelect)}
            >
              home
            </li>

            {/* Dynamic active categories */}
            {shop?.id &&
              activeCategories.length > 0 &&
              activeCategories.map((category) => (
                <li
                  key={`${shop.id}-${category.id}`}
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
                </li>
              ))}
          </ul>

          <div className="flex items-center gap-4 text-gray-700">
            {socialLinks.facebook && (
              <div onClick={() => handleSocialClick(socialLinks.facebook)}>
                <Facebook className="w-4 h-4 hover:text-blue-600 cursor-pointer" />
              </div>
            )}
            <svg
              width="16"
              height="16"
              viewBox="0 0 512 512"
              id="icons"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="hover:text-black cursor-pointer"
              onClick={() => handleSocialClick(socialLinks.tiktok)}
            >
              <path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z" />
            </svg>
            <Instagram
              className="w-4 h-4 hover:text-red-400 cursor-pointer"
              onClick={() => handleSocialClick(socialLinks.instagram)}
            />
            <svg
              width="16"
              height="16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              className="hover:text-red-700 cursor-pointer"
              onClick={() => handleSocialClick(socialLinks.youtube)}
            >
              <path
                fill="red"
                d="M14.712 4.633a1.754 1.754 0 00-1.234-1.234C12.382 3.11 8 3.11 8 3.11s-4.382 0-5.478.289c-.6.161-1.072.634-1.234 1.234C1 5.728 1 8 1 8s0 2.283.288 3.367c.162.6.635 1.073 1.234 1.234C3.618 12.89 8 12.89 8 12.89s4.382 0 5.478-.289a1.754 1.754 0 001.234-1.234C15 10.272 15 8 15 8s0-2.272-.288-3.367z"
              />
              <path
                fill="#ffffff"
                d="M6.593 10.11l3.644-2.098-3.644-2.11v4.208z"
              />
            </svg>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default HeaderDefault;
