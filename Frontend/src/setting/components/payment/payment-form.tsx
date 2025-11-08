// src/components/payments/PaymentsForm.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentSetupDialog } from "./PaymentSetupDialog";
import type { RootState } from "@/store";
import {
  getPaymentConfigsByShop,
  openSetupDialog,
  togglePaymentConfigActive,
  getPaymentConfigDetail,
} from "@/setting/slice/paymentSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { PaymentEditDialog } from "./PaymentEditDialog";

interface PaymentSettings {
  paymentMethods: string[];
  currency: string;
  taxRate: number;
  processingFee: number;
}

interface PaymentMethod {
  id: string;
  label: string;
  description: string;
  requiresSetup: boolean;
  icon: string;
}

export function PaymentsForm() {
  const dispatch = useAppDispatch();
  const shopId = useAppSelector((state: RootState) => state.shop.shop?.id);
  const { configs,  } = useAppSelector(
    (state: RootState) => state.payment
  );

  const [settings] = useState<PaymentSettings>({
    paymentMethods: ["COD"],
    currency: "NPR",
    taxRate: 13,
    processingFee: 2.5,
  });

  const [editDialog, setEditDialog] = useState({
    open: false,
    methodId: "",
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: "ESEWA",
      label: "E-sewa",
      description: "Digital wallet payment",
      requiresSetup: true,
      icon: "/esewa.png", // You can replace with actual image URLs
    },
    {
      id: "KHALTI",
      label: "Khalti",
      description: "Digital wallet payment",
      requiresSetup: true,
      icon: "/khalti.png",
    },
    {
      id: "COD",
      label: "Cash on Delivery",
      description: "Receive payments in cash upon delivery",
      requiresSetup: false,
      icon: "/cod1.png",
    },
    {
      id: "BANK_TRANSFER",
      label: "Bank Transfer",
      description: "Direct bank transfer",
      requiresSetup: true,
      icon: "/banktransfer.png",
    },
  ];

  // Fetch all configurations for the shop
  useEffect(() => {
    if (shopId) {
      dispatch(getPaymentConfigsByShop(shopId));
    }
  }, [shopId, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Payment settings updated:", settings);
    // TODO: Save general payment settings to backend
  };

  const getConfigForMethod = (methodId: string) => {
    return configs.find((config) => config.paymentMethod === methodId);
  };

  const isMethodConfigured = (methodId: string) => {
    return !!getConfigForMethod(methodId);
  };

  const handleSetupClick = (methodId: string) => {
    dispatch(openSetupDialog(methodId));
  };

  const handleToggleActive = async (configId: string) => {
    const config = getConfigForMethodById(configId);
    if (config) {
      dispatch(togglePaymentConfigActive(configId));
    }
  };

  const getConfigForMethodById = (configId: string) => {
    return configs.find((config) => config.id === configId);
  };

  const handleEditClick = async (methodId: string) => {
    if (!shopId) return;

    try {
      await dispatch(
        getPaymentConfigDetail({ shopId, paymentMethod: methodId })
      ).unwrap();
      setEditDialog({ open: true, methodId });
    } catch (error) {
      console.error("Failed to fetch config details:", error);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialog({ open: false, methodId: "" });
  };

  const renderPaymentMethodCard = (method: PaymentMethod) => {
    const config = getConfigForMethod(method.id);
    const isConfigured = isMethodConfigured(method.id);
    // const isChecked = settings.paymentMethods.includes(method.id);
    const isActive = config?.active ?? false;

    return (
      <div
        key={method.id}
        className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
          isConfigured ? "border-l-4 border-l-blue-500" : ""
        }`}
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className="text-2xl">
            {method.icon.startsWith("/") ? (
              <img
                src={method.icon}
                alt={method.label}
                className="w-20 h-20 object-contain"
              />
            ) : (
              method.icon
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor={method.id} className="text-base font-medium">
              {method.label}
            </Label>
            <p className="text-sm text-muted-foreground">
              {method.description}
            </p>
            {isConfigured && (
              <div className="flex items-center space-x-2 mt-1">
                <Switch
                  checked={isActive}
                  onCheckedChange={() => {
                    if (config?.id) {
                      handleToggleActive(config.id);
                    }
                  }}
                />
                <span className="text-xs text-muted-foreground">
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {method.requiresSetup && !isConfigured && (
            <span className="text-xs text-muted-foreground">
              Not configured
            </span>
          )}
          <Button
            type="button"
            variant={isConfigured ? "outline" : "default"}
            size="sm"
            onClick={() => {
              if (isConfigured) {
                handleEditClick(method.id);
              } else {
                handleSetupClick(method.id);
              }
            }}
          >
            {isConfigured ? "Edit" : "Set up"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Payments</h2>
        <p className="text-muted-foreground">
          Configure payment methods and processing settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Select which payment methods to accept
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((method) => renderPaymentMethodCard(method))}
          </CardContent>
        </Card>
      </form>

      <PaymentSetupDialog />
      <PaymentEditDialog
        open={editDialog.open}
        methodId={editDialog.methodId}
        onClose={handleCloseEditDialog}
      />
    </div>
  );
}
