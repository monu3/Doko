"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useFooterData,
  handleSocialClick,
  handleMapClick,
} from "@/websitesThemes/themes/components/helper/FooterHelper";

const Footer: React.FC = () => {
  const { shop, socialLinks, contactInfo } = useFooterData();

  return (
    <footer className="bg-luxury-footer text-white relative overflow-hidden">
      {/* Luxury background texture */}
      <div className="absolute inset-0 bg-texture-luxury opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="text-3xl font-bold bg-luxury-accent bg-clip-text text-transparent">
                  {shop?.businessName}
                </div>
              </Link>
              <p className="text-stone-300 max-w-md leading-relaxed">
                Discover timeless elegance with our curated collection of luxury
                fashion. Where sophistication meets contemporary style.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-6">Shop</h3>
            <ul className="space-y-3">
              {[
                { name: "Women's Collection", path: "/women" },
                { name: "Men's Collection", path: "/men" },
                { name: "Accessories", path: "/accessories" },
                { name: "Sale", path: "/sale" },
                { name: "New Arrivals", path: "/new-arrivals" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-stone-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-medium mb-6">Customer Care</h3>
            <ul className="space-y-3">
              {[
                { name: "Contact Us", path: "/contact" },
                { name: "Size Guide", path: "/size-guide" },
                { name: "Shipping & Returns", path: "/shipping" },
                { name: "FAQ", path: "/faq" },
                { name: "Privacy Policy", path: "/privacy" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-stone-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-stone-700" />

        {/* Enhanced Contact Info & Social */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Get in Touch</h3>
            <div className="space-y-3 text-stone-300">
              {contactInfo.phone && (
                <div className="flex items-center space-x-3 hover:text-amber-400 transition-colors duration-200">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo.email && (
                <div className="flex items-center space-x-3 hover:text-amber-400 transition-colors duration-200">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">{contactInfo.email}</span>
                </div>
              )}
              {(contactInfo.street || contactInfo.city) && (
                <div className="flex items-center space-x-3 hover:text-amber-400 transition-colors duration-200 cursor-pointer">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">
                    {contactInfo.street && `${contactInfo.street}, `}
                    {contactInfo.city}
                    {contactInfo.province && `, ${contactInfo.province}`}
                    {contactInfo.postalCode && ` ${contactInfo.postalCode}`}
                  </span>
                  {contactInfo.mapUrl && (
                    <ExternalLink
                      className="w-3 h-3 ml-1"
                      onClick={() => handleMapClick(contactInfo.mapUrl)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.facebook && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 text-stone-300 hover:text-amber-400 hover:bg-stone-800/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  onClick={() => handleSocialClick(socialLinks.facebook)}
                >
                  <Facebook className="w-5 h-5" />
                </Button>
              )}
              {socialLinks.instagram && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 text-stone-300 hover:text-amber-400 hover:bg-stone-800/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  onClick={() => handleSocialClick(socialLinks.instagram)}
                >
                  <Instagram className="w-5 h-5" />
                </Button>
              )}
              {socialLinks.tiktok && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 text-stone-300 hover:text-amber-400 hover:bg-stone-800/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
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
                </Button>
              )}
              {socialLinks.youtube && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 text-stone-300 hover:text-amber-400 hover:bg-stone-800/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
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
                </Button>
              )}
            </div>
            <p className="text-stone-400 text-sm">
              Stay connected for the latest fashion trends and exclusive offers.
            </p>
          </div>
        </div>

        <Separator className="bg-stone-700" />

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center text-sm text-stone-400">
          <div className="mb-4 md:mb-0">
            <p>
              &copy; 2024 {shop?.businessName || "LUXE Fashion"}. All rights
              reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            {[
              { name: "Terms of Service", path: "/terms" },
              { name: "Privacy Policy", path: "/privacy" },
              { name: "Cookie Policy", path: "/cookies" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-amber-400 transition-colors duration-200 hover:underline"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
