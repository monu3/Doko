"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Facebook,
  Instagram,
  Music,
  Youtube,
  MapPin,
  ExternalLink,
} from "lucide-react";
import {
  useFooterData,
  handleSocialClick,
  handleMapClick,
} from "./helper/FooterHelper";

function FooterDefault() {
  const { shop, socialLinks, contactInfo } = useFooterData();

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Map Preview Section */}
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight flex items-center gap-2">
              <MapPin className="h-8 w-8" />
              Find Us
            </h2>
            <p className="mb-6 text-muted-foreground">
              Visit our store location{" "}
              <ExternalLink
                className="text-blue-400"
                onClick={() => handleMapClick(contactInfo.mapUrl)}
              />
            </p>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <a
                href="#"
                className="block transition-colors hover:text-primary"
              >
                Home
              </a>
              <a
                href="#"
                className="block transition-colors hover:text-primary"
              >
                About Us
              </a>
              <a
                href="#"
                className="block transition-colors hover:text-primary"
              >
                Services
              </a>
              <a
                href="#"
                className="block transition-colors hover:text-primary"
              >
                Products
              </a>
              <a
                href="#"
                className="block transition-colors hover:text-primary"
              >
                Contact
              </a>
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic">
              {contactInfo.street && <p>{contactInfo.street}</p>}
              {(contactInfo.city || contactInfo.province) && (
                <p>
                  {contactInfo.city}
                  {contactInfo.city && contactInfo.province && ", "}
                  {contactInfo.postalCode && ` ${contactInfo.postalCode}`}
                </p>
              )}
              {contactInfo.district && <p>District: {contactInfo.district}</p>}
              {contactInfo.phone && <p>Phone: {contactInfo.phone}</p>}
              {contactInfo.email && <p>Email: {contactInfo.email}</p>}
            </address>
          </div>

          {/* Social Media Links */}
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="mb-6 flex flex-wrap gap-3">
              {/* Facebook */}
              {socialLinks.facebook && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => handleSocialClick(socialLinks.facebook)}
                      >
                        <Facebook className="h-4 w-4 text-blue-600" />
                        <span className="sr-only">Facebook</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on Facebook</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Instagram */}
              {socialLinks.instagram && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:bg-pink-50 hover:border-pink-400"
                        onClick={() => handleSocialClick(socialLinks.instagram)}
                      >
                        <Instagram className="h-4 w-4 text-pink-600" />
                        <span className="sr-only">Instagram</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on Instagram</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* TikTok */}
              {socialLinks.tiktok && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:bg-gray-50 hover:border-gray-800"
                        onClick={() => handleSocialClick(socialLinks.tiktok)}
                      >
                        <Music className="h-4 w-4 text-black" />
                        <span className="sr-only">TikTok</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on TikTok</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* YouTube */}
              {socialLinks.youtube && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:bg-red-50 hover:border-red-600"
                        onClick={() => handleSocialClick(socialLinks.youtube)}
                      >
                        <Youtube className="h-4 w-4 text-red-600" />
                        <span className="sr-only">YouTube</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Subscribe to our YouTube</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t pt-4 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 {shop?.businessName || "Your Company"}. All rights reserved.
            Powered by Doko.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Cookie Settings
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export { FooterDefault };
