"use client";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { updateShopTheme } from "@/shop/slice/shopSlice";
import type { RootState } from "@/store";
import ThemeRegistry, { type ThemeKey } from "@/websitesThemes/themeRegistry";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Sparkles } from "lucide-react";

const themeData = {
  default: {
    name: "Default",
    image: "/defaultTheme.png",
  },
  fashion: {
    name: "Fashion",
    image: "/fashionTheme.jpeg",
  },
  fashion1: {
    name: "Fashion1",
    image: "/fashionTheme.jpeg",
  },
  electronic: {
    name: "Electronic",
    image: "/electronic.jpg",
  },
  cosmetics: {
    name: "Cosmetics",
    image: "/cosmetic.jpeg",
  },
  plant: {
    name: "Plant",
    image: "/plant.jpg",
  },
  shoes: {
    name: "shoes",
    image: "/shoes.jpg",
  },
  earring: {
    name: "earring",
    image: "/earring.jpg",
  },
};

export const ThemeSelector = () => {
  const shop = useAppSelector((state: RootState) => state.shop.shop);
  const dispatch = useAppDispatch();
  const currentTheme = shop?.theme;

  const handleThemeChange = (theme: ThemeKey) => {
    if (shop) {
      dispatch(updateShopTheme({ shopId: shop.id, theme }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4 text-balance">
                Elevate your store's look with Doko Themes
              </h1>
              <p className="text-xl text-blue-100 text-pretty">
                Discover the perfect theme for your Doko store – style,
                efficiency, and customization at your fingertips.
              </p>
              <div className="mt-4">
                <Badge className="bg-blue-500/20 text-blue-100 border-blue-400">
                  {Object.keys(ThemeRegistry).length} Premium Themes Available
                </Badge>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Palette className="w-16 h-16 text-blue-200" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-yellow-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Object.keys(ThemeRegistry).map((themeKey) => {
            const theme = themeData[themeKey as keyof typeof themeData];
            const isActive = currentTheme === themeKey;

            if (!theme) return null;

            return (
              <Card
                key={themeKey}
                className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  isActive ? "ring-2 ring-blue-500 shadow-lg" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={theme.image || "/placeholder.svg"}
                    alt={`${theme.name} theme preview`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {isActive && (
                      <Badge className="bg-blue-500 text-white">Active</Badge>
                    )}
                  </div>
                </div>

                <CardContent
                  className={`p-3 ${isActive ? "bg-green-100" : "bg-gray-100"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {theme.name}
                    </h3>
                    <Button
                      onClick={() => handleThemeChange(themeKey as ThemeKey)}
                      className={`${
                        isActive
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      disabled={isActive}
                    >
                      {isActive ? "Customize" : "Apply"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
