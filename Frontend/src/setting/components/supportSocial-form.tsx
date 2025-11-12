"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Facebook, Music, Instagram, Youtube, Phone, Mail } from "lucide-react";
import { toast } from "react-toastify";
import {
  getSocialAccount,
  updateSocialAccount,
  createSocialAccount,
} from "../slice/settingSlice";

export function SupportSocialForm() {
  const dispatch = useAppDispatch();
  const { shop } = useAppSelector((state) => state.shop);
  const { socialAccount, status } = useAppSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    supportEmail: "",
    supportPhone: "",
    facebookLink: "",
    tiktokLink: "",
    instagramLink: "",
    youtubeLink: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    supportEmail: "",
    supportPhone: "",
    facebookLink: "",
    tiktokLink: "",
    instagramLink: "",
    youtubeLink: "",
  });

  // const [socialAccountExists, setSocialAccountExists] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Try to load existing data on mount (only once)
  useEffect(() => {
    if (shop?.id) {
      if (socialAccount && socialAccount.shopId === shop.id) {
        // Use existing Redux data
        setFormData({
          supportEmail: socialAccount.supportEmail || "",
          supportPhone: socialAccount.supportPhone || "",
          facebookLink: socialAccount.facebookLink || "",
          tiktokLink: socialAccount.tiktokLink || "",
          instagramLink: socialAccount.instagramLink || "",
          youtubeLink: socialAccount.youtubeLink || "",
        });
        setIsInitialized(true);
      } else {
        // Fetch data if not in Redux or different shop
        dispatch(getSocialAccount(shop.id))
          .unwrap()
          .then((data) => {
            setFormData({
              supportEmail: data.supportEmail || "",
              supportPhone: data.supportPhone || "",
              facebookLink: data.facebookLink || "",
              tiktokLink: data.tiktokLink || "",
              instagramLink: data.instagramLink || "",
              youtubeLink: data.youtubeLink || "",
            });
            setIsInitialized(true);
          })
          .catch(() => {
            setFormData({
              supportEmail: "",
              supportPhone: "",
              facebookLink: "",
              tiktokLink: "",
              instagramLink: "",
              youtubeLink: "",
            });
            setIsInitialized(true);
          });
      }
    }
  }, [dispatch, shop?.id, socialAccount]);

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Please enter a valid email address";
  };

  const validatePhone = (phone: string): string => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone)
      ? ""
      : "Phone number must be exactly 10 digits";
  };

  const validateUrl = (url: string): string => {
    if (!url) return ""; // Optional field
    try {
      new URL(url);
      return "";
    } catch {
      return "Please enter a valid URL";
    }
  };

  // Handle input changes with validation
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation
    let error = "";
    switch (field) {
      case "supportEmail":
        error = validateEmail(value);
        break;
      case "supportPhone":
        error = validatePhone(value);
        break;
      case "facebookLink":
      case "tiktokLink":
      case "instagramLink":
      case "youtubeLink":
        error = validateUrl(value);
        break;
    }

    setValidationErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const errors = {
      supportEmail: validateEmail(formData.supportEmail),
      supportPhone: validatePhone(formData.supportPhone),
      facebookLink: validateUrl(formData.facebookLink),
      tiktokLink: validateUrl(formData.tiktokLink),
      instagramLink: validateUrl(formData.instagramLink),
      youtubeLink: validateUrl(formData.youtubeLink),
    };

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shop?.id) {
      toast.error("Shop ID is required", { autoClose: 2000 });
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix validation errors", { autoClose: 2000 });
      return;
    }

    try {
      if (socialAccount && socialAccount.shopId === shop.id) {
        // Update existing social account
        await dispatch(
          updateSocialAccount({
            shopId: shop.id,
            socialAccountData: formData,
          })
        ).unwrap();
        toast.success("Support & Social settings updated successfully!", {
          autoClose: 2000,
        });
      } else {
        // Create new social account
        await dispatch(
          createSocialAccount({
            shopId: shop.id,
            socialAccountData: formData,
          })
        ).unwrap();
        toast.success("Support & Social settings created successfully!", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Failed to save settings. Please try again.", {
        autoClose: 2000,
      });
    }
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Support & Social</h2>
          <p className="text-muted-foreground">Loading your settings...</p>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }
  const socialAccountExists =
    socialAccount && socialAccount.shopId === shop?.id;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Support & Social</h2>
        <p className="text-muted-foreground">
          {socialAccountExists
            ? "Update your customer support contacts and social media links."
            : "Set up your customer support contacts and social media links for the first time."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Support Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Customer Support</span>
            </CardTitle>
            <CardDescription>
              Provide contact information for customer support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="supportEmail"
                  className="flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>
                    Support Email <span className="text-red-500">*</span>
                  </span>
                </Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) =>
                    handleInputChange("supportEmail", e.target.value)
                  }
                  placeholder="support@yourstore.com"
                  className={
                    validationErrors.supportEmail ? "border-red-500" : ""
                  }
                  disabled={status === "loading"}
                />
                {validationErrors.supportEmail && (
                  <p className="text-sm text-red-500">
                    {validationErrors.supportEmail}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="supportEmail"
                  className="flex items-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>
                    Phone <span className="text-red-500">*</span>
                  </span>
                </Label>
                <Input
                  id="supportPhone"
                  type="tel"
                  value={formData.supportPhone}
                  onChange={(e) =>
                    handleInputChange("supportPhone", e.target.value)
                  }
                  placeholder="9876543210"
                  maxLength={10}
                  className={
                    validationErrors.supportPhone ? "border-red-500" : ""
                  }
                  disabled={status === "loading"}
                />
                {validationErrors.supportPhone && (
                  <p className="text-sm text-red-500">
                    {validationErrors.supportPhone}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Section */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
              Add links to your social media profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Horizontal Grid Layout for Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Facebook */}
              <div className="space-y-2">
                <Label
                  htmlFor="facebookLink"
                  className="flex items-center space-x-2"
                >
                  <Facebook className="h-4 w-4 text-blue-600" />
                  <span>Facebook</span>
                </Label>
                <Input
                  id="facebookLink"
                  type="url"
                  value={formData.facebookLink}
                  onChange={(e) =>
                    handleInputChange("facebookLink", e.target.value)
                  }
                  placeholder="https://facebook.com/yourstore"
                  className={
                    validationErrors.facebookLink ? "border-red-500" : ""
                  }
                  disabled={status === "loading"}
                />
                {validationErrors.facebookLink && (
                  <p className="text-sm text-red-500">
                    {validationErrors.facebookLink}
                  </p>
                )}
              </div>

              {/* TikTok */}
              <div className="space-y-2">
                <Label
                  htmlFor="tiktokLink"
                  className="flex items-center space-x-2"
                >
                  <Music className="h-4 w-4 text-black" />
                  <span>TikTok</span>
                </Label>
                <Input
                  id="tiktokLink"
                  type="url"
                  value={formData.tiktokLink}
                  onChange={(e) =>
                    handleInputChange("tiktokLink", e.target.value)
                  }
                  placeholder="https://tiktok.com/@yourstore"
                  className={
                    validationErrors.tiktokLink ? "border-red-500" : ""
                  }
                  disabled={status === "loading"}
                />
                {validationErrors.tiktokLink && (
                  <p className="text-sm text-red-500">
                    {validationErrors.tiktokLink}
                  </p>
                )}
              </div>

              {/* Instagram */}
              <div className="space-y-2">
                <Label
                  htmlFor="instagramLink"
                  className="flex items-center space-x-2"
                >
                  <Instagram className="h-4 w-4 text-pink-600" />
                  <span>Instagram</span>
                </Label>
                <Input
                  id="instagramLink"
                  type="url"
                  value={formData.instagramLink}
                  onChange={(e) =>
                    handleInputChange("instagramLink", e.target.value)
                  }
                  placeholder="https://instagram.com/yourstore"
                  className={
                    validationErrors.instagramLink ? "border-red-500" : ""
                  }
                  disabled={status === "loading"}
                />
                {validationErrors.instagramLink && (
                  <p className="text-sm text-red-500">
                    {validationErrors.instagramLink}
                  </p>
                )}
              </div>

              {/* YouTube */}
              <div className="space-y-2">
                <Label
                  htmlFor="youtubeLink"
                  className="flex items-center space-x-2"
                >
                  <Youtube className="h-4 w-4 text-red-600" />
                  <span>YouTube</span>
                </Label>
                <Input
                  id="youtubeLink"
                  type="url"
                  value={formData.youtubeLink}
                  onChange={(e) =>
                    handleInputChange("youtubeLink", e.target.value)
                  }
                  placeholder="https://youtube.com/@yourstore"
                  className={
                    validationErrors.youtubeLink ? "border-red-500" : ""
                  }
                  disabled={status === "loading"}
                />
                {validationErrors.youtubeLink && (
                  <p className="text-sm text-red-500">
                    {validationErrors.youtubeLink}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-self-end">
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading"
              ? "Saving..."
              : socialAccountExists
              ? "Update Support & Social Settings"
              : "Create Support & Social Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
