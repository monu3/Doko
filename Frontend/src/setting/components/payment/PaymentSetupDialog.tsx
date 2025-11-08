// src/components/payments/PaymentSetupDialog.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CredentialField } from "@/setting/settings";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/store";
import {
  closeSetupDialog,
  createPaymentConfig,
} from "@/setting/slice/paymentSlice";

const paymentMethodConfigs: {
  [key: string]: {
    title: string;
    description: string;
    fields: CredentialField[];
  };
} = {
  ESEWA: {
    title: "Set up E-sewa",
    description: "Enter your E-sewa merchant credentials",
    fields: [
      {
        key: "merchantCode",
        label: "Merchant Code",
        type: "text",
        placeholder: "Enter merchant code",
      },
      {
        key: "secretKey",
        label: "Secret Key",
        type: "password",
        placeholder: "Enter secret key",
      },
    ],
  },
  KHALTI: {
    title: "Set up Khalti",
    description: "Enter your Khalti payment credentials",
    fields: [
      {
        key: "publicKey",
        label: "Public Key",
        type: "text",
        placeholder: "Enter public key",
      },
      {
        key: "secretKey",
        label: "Secret Key",
        type: "password",
        placeholder: "Enter secret key",
      },
    ],
  },
  COD: {
    title: "Set up Cash on Delivery",
    description: "Configure cash on delivery settings",
    fields: [
      {
        key: "instructions",
        label: "Delivery Instructions",
        type: "text",
        placeholder: "Enter delivery instructions",
      },
    ],
  },
  BANK_TRANSFER: {
    title: "Set up Bank Transfer",
    description: "Enter your bank account details",
    fields: [
      {
        key: "accountNumber",
        label: "Account Number",
        type: "text",
        placeholder: "Enter account number",
      },
      {
        key: "accountName",
        label: "Account Holder Name",
        type: "text",
        placeholder: "Enter account holder name",
      },
      {
        key: "bankName",
        label: "Bank Name",
        type: "text",
        placeholder: "Enter bank name",
      },
      {
        key: "ifscCode",
        label: "IFSC Code",
        type: "text",
        placeholder: "Enter IFSC code",
      },
    ],
  },
};

export function PaymentSetupDialog() {
  const dispatch = useAppDispatch();
  const { setupDialog, loading } = useAppSelector(
    (state: RootState) => state.payment
  );
  const shopId = useAppSelector((state: RootState) => state.shop.shop?.id);

  const [credentials, setCredentials] = useState<{ [key: string]: string }>({});

  const currentConfig = setupDialog.paymentMethod
    ? paymentMethodConfigs[setupDialog.paymentMethod]
    : null;

  useEffect(() => {
    if (setupDialog.open && setupDialog.paymentMethod) {
      // Reset credentials when dialog opens
      const initialCredentials: { [key: string]: string } = {};
      currentConfig?.fields.forEach((field) => {
        initialCredentials[field.key] = "";
      });
      setCredentials(initialCredentials);
    }
  }, [setupDialog.open, setupDialog.paymentMethod, currentConfig]);

  const handleInputChange = (key: string, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shopId || !setupDialog.paymentMethod) return;

    dispatch(
      createPaymentConfig({
        shopId,
        paymentMethod: setupDialog.paymentMethod,
        credentials,
      })
    );
  };

  const handleClose = () => {
    dispatch(closeSetupDialog());
  };

  if (!currentConfig || !setupDialog.paymentMethod) return null;

  return (
    <Dialog open={setupDialog.open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{currentConfig.title}</DialogTitle>
          <DialogDescription>{currentConfig.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentConfig.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type={field.type}
                placeholder={field.placeholder}
                value={credentials[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                required
              />
            </div>
          ))}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Setting up..." : "Set up"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
