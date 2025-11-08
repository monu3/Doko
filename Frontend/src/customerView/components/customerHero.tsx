"use client";

import type React from "react";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CustomerHero() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
  };

  // Sample product images for the mosaic layout
  const productImages = [
    {
      id: 1,
      src: "/sampleimg.jpg?height=200&width=200",
      alt: "Ceremonia Hair Product",
      category: "Beauty",
    },
    {
      id: 2,
      src: "/sampleimg.jpg?height=200&width=200",
      alt: "Blue Bowl",
      category: "Home",
    },
    {
      id: 3,
      src: "/sampleimg.jpg?height=200&width=200",
      alt: "Orange Bottle",
      category: "Beauty",
    },
    {
      id: 4,
      src: "/sampleimg.jpg?height=200&width=200",
      alt: "Face Mask",
      category: "Beauty",
    },
    {
      id: 5,
      src: "/sampleimg.jpg?height=200&width=200",
      alt: "Baby Toy",
      category: "Kids",
    },
    {
      id: 6,
      src: "/sampleimg.jpg?height=200&width=200",
      alt: "Art Supplies",
      category: "Art",
    },
    {
      id: 7,
      src: "/sampleimg.jpg?height=200&width=200",
      alt: "Kitchen Utensils",
      category: "Kitchen",
    },
    {
      id: 8,
      src: "/sampleimg.jpg?height=200&width=200",
      alt: "Colorful Bowls",
      category: "Home",
    },
    {
      id: 9,
      src: "/sampleimg.jpg?height=200&width=200",
      alt: "T-Shirt",
      category: "Fashion",
    },
    {
      id: 10,
      src: "/sampleimg.jpg?height=200&width=200",
      alt: "Baby Portrait",
      category: "Kids",
    },
    {
      id: 11,
      src: "/sampleimg.jpg?height=200&width=200",
      alt: "Cooking Pot",
      category: "Kitchen",
    },
    {
      id: 12,
      src: "/sampleimg.jpg?height=200&width=200",
      alt: "Hot Dog Fingers",
      category: "Food",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Images Mosaic */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="grid grid-cols-6 gap-4 opacity-20 transform rotate-3 scale-110">
            {productImages.map((product, index) => (
              <div
                key={product.id}
                className={`rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 ${
                  index % 3 === 0 ? "mt-8" : index % 3 === 1 ? "mt-16" : "mt-4"
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <img
                  src={product.src || "/placeholder.svg"}
                  alt={product.alt}
                  className="w-full h-32 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center pt-20">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold text-blue-600 mb-8 tracking-tight">
            DoKo
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Plant-based protein powders"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-lg"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
