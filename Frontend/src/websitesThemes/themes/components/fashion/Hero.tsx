"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAppSelector } from "@/hooks";
import type { RootState } from "@/store";

// Type for each hero slide
interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const Hero: React.FC = () => {
  const [currentSlide] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { shop } = useAppSelector((state: RootState) => state.shop);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const heroSlides: HeroSlide[] = [
    {
      title: "Timeless",
      subtitle: "Elegance",
      description:
        "Discover our curated collection of luxury fashion. Where sophistication meets contemporary style.",
      image:"https://images.unsplash.com/photo-1613909671501-f9678ffc1d33?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBmYXNoaW9ufGVufDB8fHx8MTc1NTY0MDA2NHww&ixlib=rb-4.1.0&q=85",
    },
  ];

  return (
    <section className="relative bg-animated-hero overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-stone-200/30 to-stone-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-100/20 to-stone-100/10 rounded-full blur-2xl animate-bounce slow"></div>
        <div className="absolute inset-0 bg-texture-paper opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20">
          {/* Content */}
          <div
            className={`text-center lg:text-left space-y-8 transition-all duration-1000 transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 glass-luxury px-6 py-3 rounded-full text-amber-800 text-sm font-medium animate-in slide-in-from-left duration-1000 delay-300 shadow-lg">
                <Sparkles className="w-4 h-4 animate-spin slow" />
                <span>New Collection Available</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-stone-900 leading-tight">
                <span className="animate-in slide-in-from-left duration-1000 delay-500 block">
                  {heroSlides[currentSlide].title}
                </span>
                <span className="block bg-luxury-accent bg-clip-text text-transparent font-medium animate-in slide-in-from-left duration-1000 delay-700">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-in slide-in-from-left duration-1000 delay-900">
                {heroSlides[currentSlide].description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in slide-in-from-left duration-1000 delay-1100">
              <Link to="/shop">
                <Button
                  size="lg"
                  className="group bg-luxury-accent hover:shadow-2xl text-white px-8 py-4 text-base font-medium transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-lg"
                >
                  <span className="mr-2">Shop Now</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/categories">
                <Button
                  variant="outline"
                  size="lg"
                  className="group glass-luxury text-stone-700 hover:bg-white/20 px-8 py-4 text-base font-medium transition-all duration-500 hover:border-amber-600 hover:text-amber-700 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  <span className="mr-2">Browse Categories</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 animate-in slide-in-from-bottom duration-1000 delay-1300">
              <div className="text-center bg-luxury-card p-4 rounded-xl shadow-sm">
                <div className="text-2xl md:text-3xl font-light text-stone-900 mb-1 counter">
                  10K+
                </div>
                <div className="text-sm text-stone-600">Happy Customers</div>
              </div>
              <div className="text-center bg-luxury-card p-4 rounded-xl shadow-sm">
                <div className="text-2xl md:text-3xl font-light text-stone-900 mb-1 counter">
                  500+
                </div>
                <div className="text-sm text-stone-600">Premium Products</div>
              </div>
              <div className="text-center bg-luxury-card p-4 rounded-xl shadow-sm">
                <div className="text-2xl md:text-3xl font-light text-stone-900 mb-1 counter">
                  50+
                </div>
                <div className="text-sm text-stone-600">Global Brands</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div
            className={`relative transition-all duration-1000 delay-500 transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            <div className="aspect-square lg:aspect-[4/5] relative overflow-hidden rounded-3xl shadow-2xl group bg-luxury-card">
              <img
                src={heroSlides[currentSlide].image}
                alt={shop?.businessName || "Luxury Fashion"}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg?height=600&width=400";
                }}
              />
              <div className="absolute inset-0 bg-luxury-overlay transition-all duration-700 group-hover:opacity-70"></div>

              <div className="absolute bottom-8 left-8 right-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <Link to="/shop">
                  <Button
                    variant="outline"
                    className="w-full glass-luxury text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    Explore Collection
                  </Button>
                </Link>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-amber-200/40 to-amber-300/30 rounded-full blur-xl opacity-80 animate-float"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-stone-200/40 to-stone-300/30 rounded-full blur-2xl opacity-60 animate-float delay-1000"></div>
            <div className="absolute top-1/2 -right-4 w-16 h-16 bg-gradient-to-br from-amber-400/50 to-amber-500/30 rounded-full blur-lg opacity-50 animate-bounce delay-500"></div>

            <div className="absolute inset-0 rounded-3xl border border-amber-200/30 shadow-inner"></div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 opacity-[0.015] animate-pulse slow">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.08'%3E%3Ccircle cx='40' cy='40' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-amber-400/60 rounded-full flex justify-center bg-luxury-card shadow-lg">
          <div className="w-1 h-3 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
