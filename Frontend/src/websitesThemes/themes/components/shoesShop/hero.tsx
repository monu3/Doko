import React from "react";
import { ArrowRight, Star, Heart, Truck } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-slate-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gray-400 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                New Collection 2024
              </div>

              <h1 className="text-7xl font-bold text-slate-900 leading-tight">
                Step Into
                <span className="block text-slate-600 relative">
                  Style
                  <svg
                    className="absolute -bottom-3 left-0 w-full h-4"
                    viewBox="0 0 300 12"
                    fill="none"
                  >
                    <path
                      d="M2 6C30 2 90 2 150 6C210 10 270 10 298 6"
                      stroke="#64748b"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Discover premium footwear that combines comfort, style, and
                performance. From everyday classics to statement pieces.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-slate-800">500+</div>
                <div className="text-slate-600 text-sm">Styles</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-slate-800">50+</div>
                <div className="text-slate-600 text-sm">Brands</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-slate-800">24/7</div>
                <div className="text-slate-600 text-sm">Support</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg">
                Shop Collection <ArrowRight className="ml-3 w-5 h-5" />
              </button>
              <button className="border-2 border-slate-800 text-slate-800 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 hover:text-white transition-all duration-300">
                View Lookbook
              </button>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="lg:col-span-5 relative">
            {/* Main Product Card */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl transform hover:-rotate-2 transition-transform duration-500">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Best Seller
                </span>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="relative mb-6">
                <img
                  src="https://images.unsplash.com/photo-1592670587543-f409a95839e0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzdHlsaXNoJTIwc2hvZXN8ZW58MHx8fHwxNzU3OTU4MTg3fDA&ixlib=rb-4.1.0&q=85"
                  alt="Premium Sneakers"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-slate-800">
                  -30%
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    Urban Runner Pro
                  </h3>
                  <p className="text-slate-600">Premium Athletic Sneakers</p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-slate-600 text-sm">
                    (4.8) • 1.2k reviews
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-slate-800">
                        $129.99
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        $185.99
                      </span>
                    </div>
                    <p className="text-green-600 font-semibold text-sm">
                      Free shipping & returns
                    </p>
                  </div>
                  <button className="bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors">
                    Add to Cart
                  </button>
                </div>

                {/* Size Selection */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-slate-600 mb-3">
                    Available Sizes:
                  </p>
                  <div className="flex space-x-2">
                    {["7", "8", "9", "10", "11"].map((size) => (
                      <button
                        key={size}
                        className="w-10 h-10 border-2 border-gray-200 rounded-lg text-sm font-semibold hover:border-slate-800 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 bg-gradient-to-r from-slate-800 to-slate-600 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
              Limited Time!
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    Fast Delivery
                  </div>
                  <div className="text-xs text-slate-600">
                    2-3 Business Days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
