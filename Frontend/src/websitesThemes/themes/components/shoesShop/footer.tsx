import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Facebook,
  Instagram,
} from "lucide-react";
import {
  useFooterData,
  handleSocialClick,
  handleMapClick,
} from "@/websitesThemes/themes/components/helper/FooterHelper";

const Footer: React.FC = () => {
  const { shop, activeCategories, socialLinks, contactInfo } = useFooterData();
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-3xl font-bold mb-4">Stay in Step</h3>
            <p className="text-slate-300 text-lg mb-6">
              Get the latest drops, exclusive offers, and style inspiration
              delivered to your inbox.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-4 py-3 rounded-xl text-slate-800 outline-none"
              />
              <button className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Follow Our Journey</h4>
              <div className="flex space-x-4">
                {socialLinks.instagram && (
                  <div
                    className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                    onClick={() => handleSocialClick(socialLinks.instagram)}
                  >
                    <Instagram className="w-5 h-5" />
                  </div>
                )}
                {socialLinks.tiktok && (
                  <div
                    className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                    onClick={() => handleSocialClick(socialLinks.tiktok)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="hover:text-black"
                    >
                      <path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z" />
                    </svg>
                  </div>
                )}
                {socialLinks.facebook && (
                  <div
                    className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                    onClick={() => handleSocialClick(socialLinks.facebook)}
                  >
                    <Facebook className="w-5 h-5" />
                  </div>
                )}
                {socialLinks.youtube && (
                  <div
                    className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                    onClick={() => handleSocialClick(socialLinks.youtube)}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      className="hover:text-red-700"
                    >
                      <path
                        fill="currentColor"
                        d="M14.712 4.633a1.754 1.754 0 00-1.234-1.234C12.382 3.11 8 3.11 8 3.11s-4.382 0-5.478.289c-.6.161-1.072.634-1.234 1.234C1 5.728 1 8 1 8s0 2.283.288 3.367c.162.6.635 1.073 1.234 1.234C3.618 12.89 8 12.89 8 12.89s4.382 0 5.478-.289a1.754 1.754 0 001.234-1.234C15 10.272 15 8 15 8s0-2.272-.288-3.367z"
                      />
                      <path
                        fill="#ffffff"
                        d="M6.593 10.11l3.644-2.098-3.644-2.11v4.208z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-slate-700 to-slate-500 p-3 rounded-2xl">
                <img
                  src={
                    shop?.logoUrl ||
                    "https://images.unsplash.com/photo-1635151947209-b60373e4ccc5"
                  }
                  alt="shop Logo"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{shop?.businessName}</h2>
                <p className="text-slate-400 text-sm">PREMIUM FOOTWEAR</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Curating the world's finest footwear since 1995. From street-ready
              sneakers to boardroom-worthy dress shoes, we help you step forward
              in style.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold mb-6 text-lg">Shop</h3>
            <ul className="space-y-3 text-slate-300">
              {activeCategories.slice(0, 4).map((category) => (
                <li key={category.id}>
                  <a href="#" className="hover:text-white transition-colors">
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-6 text-lg">Support</h3>
            <ul className="space-y-3 text-slate-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
              {contactInfo.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-300" />
                  <span className="text-sm">{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-300" />
                  <span className="text-sm">{contactInfo.email}</span>
                </div>
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-6 text-lg">Company</h3>
            <ul className="space-y-3 text-slate-300">
              {(contactInfo.street || contactInfo.city) && (
                <div className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors">
                  <MapPin className="w-4 h-4 text-green-300" />
                  <span className="text-sm">
                    {contactInfo.street && `${contactInfo.street}, `}
                    {contactInfo.city}
                    {contactInfo.province && `, ${contactInfo.province}`}
                    {contactInfo.postalCode && ` ${contactInfo.postalCode}`}
                  </span>
                  {contactInfo.mapUrl && (
                    <ExternalLink
                      className="w-9 h-9 ml-1 text-green-300"
                      onClick={() => handleMapClick(contactInfo.mapUrl)}
                    />
                  )}
                </div>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400">
            &copy; 2024 StepStyle. All rights reserved. | Designed with Doko
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
