import React from "react";
import { ArrowRight, Star, Shield, Gift, Crown, Sparkles } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 py-24 relative overflow-hidden">
      {/* Elegant Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-rose-300 to-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-amber-300 to-yellow-300 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full blur-xl"></div>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-20 left-1/4 w-6 h-6 text-rose-300 animate-pulse" />
        <Sparkles className="absolute top-40 right-1/3 w-4 h-4 text-amber-300 animate-bounce" />
        <Sparkles className="absolute bottom-32 left-1/3 w-5 h-5 text-pink-300 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-gradient-to-r from-rose-100 to-amber-100 px-6 py-2 rounded-full">
                <Crown className="w-5 h-5 text-rose-600 mr-2" />
                <span className="text-rose-800 font-semibold">
                  Handcrafted Excellence
                </span>
              </div>

              <h1 className="text-7xl font-serif font-bold text-gray-900 leading-tight">
                Timeless
                <span className="block text-transparent bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text relative">
                  Elegance
                  <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-rose-300 to-amber-300 rounded-full"></div>
                </span>
              </h1>

              <p className="text-2xl text-gray-600 leading-relaxed font-light">
                Discover exquisite earrings crafted with precision, adorned with
                the finest gems, and designed to celebrate your unique beauty.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 py-8">
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-gray-600 font-medium">Authentic</div>
              </div>
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                  25+
                </div>
                <div className="text-gray-600 font-medium">Years</div>
              </div>
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                  ∞
                </div>
                <div className="text-gray-600 font-medium">Warranty</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-gradient-to-r from-rose-600 to-amber-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-rose-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-2xl">
                Explore Collection <ArrowRight className="ml-3 w-5 h-5" />
              </button>
              <button className="border-2 border-rose-600 text-rose-600 px-12 py-4 rounded-2xl font-bold text-lg hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-lg">
                Book Consultation
              </button>
            </div>
          </div>

          {/* Right Content - Luxury Product Display */}
          <div className="relative">
            {/* Main Product Showcase */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl transform hover:rotate-1 transition-transform duration-700 border border-rose-100">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-r from-rose-100 to-amber-100 px-4 py-2 rounded-full">
                  <span className="text-rose-800 font-semibold text-sm">
                    Featured Design
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-amber-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm font-medium">
                    (5.0)
                  </span>
                </div>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-amber-100 rounded-2xl transform rotate-1"></div>
                <img
                  src="https://images.unsplash.com/photo-1684439673104-f5d22791c71a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZWFycmluZ3N8ZW58MHx8fHwxNzU3OTU4MTkzfDA&ixlib=rb-4.1.0&q=85"
                  alt="Diamond Rose Gold Earrings"
                  className="w-full h-80 object-cover rounded-2xl relative z-10"
                />
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-rose-600 font-bold text-sm">
                      Limited Edition
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">
                    Diamond Rose Drops
                  </h3>
                  <p className="text-gray-600">
                    18K Rose Gold with Brilliant Cut Diamonds
                  </p>
                </div>

                {/* Materials & Certifications */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">
                      Certified
                    </span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-600">0.5 ct total</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-600">VS1 Clarity</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                        $2,890
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        $3,600
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-semibold text-sm">
                        Interest-free payments
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 text-sm">
                        From $241/mo
                      </span>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-rose-600 to-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-rose-700 hover:to-amber-700 transition-all duration-300 shadow-lg">
                    Add to Cart
                  </button>
                </div>

                {/* Size Guide */}
                <div className="pt-6 border-t border-rose-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Size Options:
                    </span>
                    <button className="text-rose-600 text-sm font-medium hover:underline">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    {["Small", "Medium", "Large"].map((size) => (
                      <button
                        key={size}
                        className="px-4 py-2 border-2 border-rose-200 rounded-lg text-sm font-medium hover:border-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Trust Badges */}
            <div className="absolute -top-6 -left-6 bg-gradient-to-r from-amber-400 to-rose-400 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
              <span className="flex items-center">
                <Crown className="w-4 h-4 mr-1" />
                Premium Quality
              </span>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-rose-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    Free Gift Box
                  </div>
                  <div className="text-xs text-gray-600">
                    With Every Purchase
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
