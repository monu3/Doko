import React from "react";
import { ArrowRight, Star } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-pink-50 to-rose-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Discover Your
              <span className="text-pink-600 block animate-pulse">
                Natural Beauty
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Premium cosmetics and skincare products that enhance your natural
              radiance and confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-600 hover:text-white transition-all duration-300">
                Beauty Tips
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348"
                alt="Premium Cosmetics"
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Luxury Lipstick Set
                  </h3>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <span className="text-2xl font-bold text-pink-600">$89</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
