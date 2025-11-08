// src/pages/ShopDetailPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { createShop } from "@/shop/slice/shopSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Province,
  District,
  PROVINCE_TO_DISTRICTS,
} from "../enums/districtAndProvince";
import { fetchOwnerId } from "@/auth/slice/authSlice";

export function ShopDetail() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.shop);
  const { ownerId, status: authStatus } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    businessName: "",
    shopUrl: "",
    province: Province.PROVINCE_1,
    district: PROVINCE_TO_DISTRICTS[Province.PROVINCE_1][0],
  });

  // Memoized function to generate shop URL
  const generateShopUrl = useCallback((businessName: string) => {
    return businessName.trim() !== ""
      ? `${businessName.replace(/\s+/g, "").toLowerCase()}.com`
      : "";
  }, []);

  // Update shop URL when business name changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      shopUrl: generateShopUrl(prev.businessName),
    }));
  }, [formData.businessName, generateShopUrl]);

  // Fetch ownerId only once
  useEffect(() => {
    if (!ownerId && authStatus === "idle") {
      dispatch(fetchOwnerId());
    }
  }, [dispatch, ownerId, authStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ownerId) {
      console.error("Owner ID is not available");
      return;
    }

    const shopDTO = {
      shopUrl: formData.shopUrl,
      businessName: formData.businessName,
      province: formData.province,
      district: formData.district,
    };

    dispatch(createShop({ shopDTO, ownerId }))
      .unwrap()
      .then(() => navigate("/"))
      .catch((err) => console.error("Error:", err));
  };

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  if (!ownerId && authStatus === "loading") {
    return <div>Loading shop details...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Card className="max-w-md w-full">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-center">Shop Details</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Business Name */}
            <div>
              <Label htmlFor="businessName" className="mb-1 block">
                Business Name
              </Label>
              <Input
                id="businessName"
                type="text"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={(e) =>
                  handleInputChange("businessName", e.target.value)
                }
                required
                className="w-full"
              />
            </div>

            {/* Shop URL (Generated) */}
            <div>
              <Label htmlFor="shopUrl" className="mb-1 block">
                Shop URL
              </Label>
              <Input
                id="shopUrl"
                type="text"
                value={generateShopUrl(formData.businessName)}
                disabled
                className="w-full bg-gray-100"
              />
            </div>

            {/* Province Select */}
            <div>
              <Label htmlFor="province" className="mb-1 block">
                Province
              </Label>
              <select
                id="province"
                value={formData.province}
                onChange={(e) => {
                  const selectedProvince = e.target.value as Province;
                  setFormData((prev) => ({
                    ...prev,
                    province: selectedProvince,
                    district: PROVINCE_TO_DISTRICTS[selectedProvince][0], // reset district
                  }));
                }}
                className="border border-gray-300 rounded p-2 w-full"
                required
              >
                {Object.values(Province).map((prov) => (
                  <option key={prov} value={prov}>
                    {prov.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* District Select */}
            <div>
              <Label htmlFor="district" className="mb-1 block">
                District
              </Label>
              <select
                id="district"
                value={formData.district}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    district: e.target.value as District,
                  }))
                }
                className="border border-gray-300 rounded p-2 w-full"
                required
              >
                {PROVINCE_TO_DISTRICTS[formData.province].map((dist) => (
                  <option key={dist} value={dist}>
                    {dist.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Submitting..." : "Submit"}
            </Button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ShopDetail;
