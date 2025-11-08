// src/pages/settings/payments/[method].tsx (or your route structure)
"use client";

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks";
import type { RootState } from "@/store";
import {
  getPaymentConfigDetail,
  updatePaymentConfig,
} from "@/setting/slice/paymentSlice";

export default function PaymentMethodPage() {
  const params = useParams();
  const dispatch = useAppDispatch();

  const method = params.method as string;
  const shopId = useAppSelector((state: RootState) => state.shop.shop?.id);
  const { currentConfig, loading } = useAppSelector(
    (state: RootState) => state.payment
  );

  const methodId = method.toUpperCase();

  useEffect(() => {
    if (shopId && methodId) {
      dispatch(getPaymentConfigDetail({ shopId, paymentMethod: methodId }));
    }
  }, [shopId, methodId, dispatch]);

  const handleUpdateConfig = (updates: {
    active?: boolean;
    credentials?: any;
  }) => {
    if (currentConfig?.id) {
      dispatch(
        updatePaymentConfig({ configId: currentConfig.id, data: updates })
      );
    }
  };

  const handleInputChange = (key: string, value: string) => {
    const newCredentials = { ...currentConfig?.credentials, [key]: value };
    handleUpdateConfig({ credentials: newCredentials });
  };

  const renderCredentialFields = () => {
    if (!currentConfig?.credentials) return null;

    return Object.entries(currentConfig.credentials).map(([key, value]) => (
      <div key={key} className="space-y-2">
        <Label htmlFor={key}>
          {key.charAt(0).toUpperCase() +
            key.slice(1).replace(/([A-Z])/g, " $1")}
        </Label>
        <Input
          id={key}
          type={
            key.toLowerCase().includes("key") ||
            key.toLowerCase().includes("secret")
              ? "password"
              : "text"
          }
          value={value as string}
          onChange={(e) => handleInputChange(key, e.target.value)}
          placeholder={`Enter ${key}`}
        />
      </div>
    ));
  };

  if (!currentConfig) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p>Payment configuration not found.</p>
          <Link to="/settings/payments">
            <Button className="mt-4">Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{methodId} Configuration</h1>
          <p className="text-muted-foreground">
            Manage your {methodId} payment settings
          </p>
        </div>
        <Link to="/settings/payments">
          <Button variant="outline">Back to Payments</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>
            Enable or disable this payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              checked={currentConfig.active}
              onCheckedChange={(checked) =>
                handleUpdateConfig({ active: checked })
              }
              disabled={loading}
            />
            <Label>{currentConfig.active ? "Active" : "Inactive"}</Label>
          </div>
        </CardContent>
      </Card>

      {Object.keys(currentConfig.credentials || {}).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Credentials</CardTitle>
            <CardDescription>
              Update your payment gateway credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderCredentialFields()}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-2">
        <Link to="/settings/payments">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
