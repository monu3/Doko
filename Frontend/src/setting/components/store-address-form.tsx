"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import type { StoreAddress } from "../settings";
import { useDispatch, useSelector } from "react-redux";
import { updateStoreAddress } from "@/shop/slice/shopSlice";
import type { RootState, AppDispatch } from "@/store";
import { toast } from "react-toastify";

export function StoreAddressForm() {
  const [formData, setFormData] = useState<StoreAddress>({
    street: "",
    city: "",
    tole: "",
    mapUrl: "",
    postalCode: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const { shop, status } = useSelector((state: RootState) => state.shop);

  // Load existing address data when component mounts
  useEffect(() => {
    if (shop?.address) {
      setFormData({
        street: shop.address.street || "",
        city: shop.address.city || "",
        tole: shop.address.tole || "",
        mapUrl: shop.address.mapUrl || "",
        postalCode: shop.address.postalCode || "",
      });
    }
  }, [shop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop?.id) {
      toast.error("Shop ID is required");
      return;
    }

    try {
      await dispatch(
        updateStoreAddress({ shopId: shop.id, address: formData })
      ).unwrap();
      toast.success("Store address updated successfully!");
    } catch (error) {
      toast.error("Failed to update store address. Please try again.");
    }
  };

  const handleInputChange = (field: keyof StoreAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (shop?.address) {
      setFormData({
        street: shop.address.street || "",
        city: shop.address.city || "",
        tole: shop.address.tole || "",
        mapUrl: shop.address.mapUrl || "",
        postalCode: shop.address.postalCode || "",
      });
    } else {
      setFormData({
        street: "",
        city: "",
        tole: "",
        mapUrl: "",
        postalCode: "",
      });
    }
    toast.info("Form has been reset to original values.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Store Address
        </h2>
        <p className="text-muted-foreground">
          Manage your store's physical address and location details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>
            Enter your complete store address details for accurate delivery and
            customer visits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="street">
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  placeholder="Enter your street address"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter city name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tole">Tole/Area</Label>
                  <Input
                    id="tole"
                    value={formData.tole}
                    onChange={(e) => handleInputChange("tole", e.target.value)}
                    placeholder="Enter tole or area name"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) =>
                    handleInputChange("postalCode", e.target.value)
                  }
                  placeholder="Enter postal code"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mapUrl">Map URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="mapUrl"
                    value={formData.mapUrl}
                    onChange={(e) =>
                      handleInputChange("mapUrl", e.target.value)
                    }
                    placeholder="https://maps.google.com/..."
                    type="url"
                  />
                  {formData.mapUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(formData.mapUrl, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Add a Google Maps or similar map link for your store location
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Saving..." : "Save Address"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
