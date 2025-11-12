"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, X, Camera } from "lucide-react";
import { updateStoreDetails } from "@/shop/slice/shopSlice";
import { uploadImage } from "@/images/slice/imageSlice";
import type { RootState, AppDispatch } from "@/store";
import {
  Province,
  District,
  PROVINCE_TO_DISTRICTS,
} from "@/shop/enums/districtAndProvince";
import { toast } from "react-toastify";

export function StoreDetailsForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { shop, status } = useSelector((state: RootState) => state.shop);

  const [formData, setFormData] = useState({
    shopUrl: "",
    businessName: "",
    district: District.KATHMANDU, // Default district
    province: Province.PROVINCE_1, // Default province
    logoUrl: "",
  });

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    if (shop) {
      setFormData({
        shopUrl: shop.shopUrl || "",
        businessName: shop.businessName || "",
        district: (shop.district as District) || District.KATHMANDU,
        province: (shop.province as Province) || Province.PROVINCE_1,
        logoUrl: shop.logoUrl || "",
      });
    }
  }, [shop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop?.id) {
      toast.error("Shop ID is required", { autoClose: 2000 });
      return;
    }

    try {
      await dispatch(
        updateStoreDetails({
          shopId: shop.id,
          storeDetails: {
            ...formData,
            district: formData.district.toString(),
            province: formData.province.toString(),
          },
        })
      ).unwrap();
      toast.success("Store details updated successfully!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Failed to update store details. Please try again.", {
        autoClose: 2000,
      });
    }
  };

  // Updated image upload logic using Cloudinary
  const handleLogoUpload = (file: File) => {
    setIsUploadingLogo(true);
    dispatch(uploadImage({ file }))
      .unwrap()
      .then((url) => {
        setFormData((prev) => ({ ...prev, logoUrl: url }));
        toast.success("Logo uploaded successfully!", { autoClose: 2000 });
      })
      .catch((error) => {
        console.error("Logo upload failed:", error);
        toast.error("Failed to upload logo. Please try again.", {
          autoClose: 2000,
        });
      })
      .finally(() => {
        setIsUploadingLogo(false);
      });
  };

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
    toast.info("Store logo has been removed.", { autoClose: 2000 });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProvinceChange = (selectedProvince: Province) => {
    setFormData((prev) => ({
      ...prev,
      province: selectedProvince,
      district: PROVINCE_TO_DISTRICTS[selectedProvince][0], // Reset district when province changes
    }));
  };

  const handleDistrictChange = (selectedDistrict: District) => {
    setFormData((prev) => ({ ...prev, district: selectedDistrict }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Store details</h2>
        <p className="text-muted-foreground">
          Update and customize your store's information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="shopUrl">Store Link</Label>
            <Input
              id="shopUrl"
              value={formData.shopUrl}
              onChange={(e) => handleInputChange("shopUrl", e.target.value)}
              placeholder="mydukaan.io/your-store"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName">
              Store Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) =>
                handleInputChange("businessName", e.target.value)
              }
              placeholder="Enter store name"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="province">
              Province <span className="text-red-500">*</span>
            </Label>
            <select
              id="province"
              value={formData.province}
              onChange={(e) => handleProvinceChange(e.target.value as Province)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              {Object.values(Province).map((prov) => (
                <option key={prov} value={prov}>
                  {prov.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">
              District <span className="text-red-500">*</span>
            </Label>
            <select
              id="district"
              value={formData.district}
              onChange={(e) => handleDistrictChange(e.target.value as District)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              {PROVINCE_TO_DISTRICTS[formData.province].map((dist) => (
                <option key={dist} value={dist}>
                  {dist.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Store Logo</CardTitle>
            <CardDescription>
              Upload your store logo (recommended size: 200x200px)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Store Logo</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    isUploadingLogo ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    if (isUploadingLogo) return;
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleLogoUpload(file);
                    };
                    input.click();
                  }}
                >
                  {formData.logoUrl ? (
                    <div className="relative aspect-square w-40 mx-auto">
                      <img
                        src={formData.logoUrl || "/placeholder.svg"}
                        alt="Store logo preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLogo();
                        }}
                        disabled={isUploadingLogo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      {isUploadingLogo ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <span className="text-sm font-medium">
                            Uploading logo...
                          </span>
                        </>
                      ) : (
                        <>
                          <Camera className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Upload store logo
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="destructive"
            className="flex items-center space-x-2"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Delete my store</span>
          </Button>

          <Button
            type="submit"
            disabled={status === "loading" || isUploadingLogo}
          >
            {status === "loading" ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
