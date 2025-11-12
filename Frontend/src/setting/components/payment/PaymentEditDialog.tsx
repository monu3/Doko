// src/components/payments/PaymentEditDialog.tsx
"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/hooks";
import type { RootState } from "@/store";
import { updatePaymentConfig } from "@/setting/slice/paymentSlice";
import { toast } from "react-toastify";

interface PaymentEditDialogProps {
  open: boolean;
  methodId: string;
  onClose: () => void;
}

const paymentMethodIcons: { [key: string]: string } = {
  ESEWA: "/esewa.png",
  KHALTI: "/khalti.png",
  COD: "/cod1.png",
  BANK_TRANSFER: "/banktransfer.png",
};

interface EditFormState {
  active: boolean;
  credentials: { [key: string]: string };
}

export function PaymentEditDialog({
  open,
  methodId,
  onClose,
}: PaymentEditDialogProps) {
  const dispatch = useAppDispatch();
  const { currentConfig, loading } = useAppSelector(
    (state: RootState) => state.payment
  );

  const [formState, setFormState] = useState<EditFormState>({
    active: false,
    credentials: {},
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form state when dialog opens or config changes
  useEffect(() => {
    if (open && currentConfig && currentConfig.paymentMethod === methodId) {
      const initialCredentials = currentConfig.credentials || {};
      setFormState({
        active: currentConfig.active,
        credentials: { ...initialCredentials },
      });
      setHasChanges(false);
      setIsInitialized(true);
    } else if (!open) {
      setIsInitialized(false);
    }
  }, [open, currentConfig, methodId]);

  // Check if there are changes compared to original config
  useEffect(() => {
    if (
      isInitialized &&
      currentConfig &&
      currentConfig.paymentMethod === methodId
    ) {
      const hasActiveChanged = formState.active !== currentConfig.active;

      // Safely check credential changes
      const currentCredentials = currentConfig.credentials || {};
      const formCredentials = formState.credentials || {};

      const hasCredentialChanges =
        // Check if keys are different
        Object.keys(formCredentials).length !==
          Object.keys(currentCredentials).length ||
        // Check if any values are different
        Object.keys(formCredentials).some(
          (key) => formCredentials[key] !== currentCredentials[key]
        ) ||
        // Check if any keys are missing in form
        Object.keys(currentCredentials).some(
          (key) => formCredentials[key] !== currentCredentials[key]
        );

      setHasChanges(hasActiveChanged || hasCredentialChanges);
    }
  }, [formState, currentConfig, methodId, isInitialized]);

  const handleActiveChange = (active: boolean) => {
    setFormState((prev) => ({
      ...prev,
      active,
    }));
  };

  const handleCredentialChange = (key: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [key]: value,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentConfig?.id || !hasChanges) {
      onClose();
      return;
    }

    try {
      const updateData: { active?: boolean; credentials?: any } = {};

      // Only include fields that have changed
      if (formState.active !== currentConfig.active) {
        updateData.active = formState.active;
      }

      // Safely check if credentials have changed
      const currentCredentials = currentConfig.credentials || {};
      const credentialsChanged =
        Object.keys(formState.credentials).length !==
          Object.keys(currentCredentials).length ||
        Object.keys(formState.credentials).some(
          (key) => formState.credentials[key] !== currentCredentials[key]
        ) ||
        Object.keys(currentCredentials).some(
          (key) => formState.credentials[key] !== currentCredentials[key]
        );

      if (credentialsChanged) {
        updateData.credentials = formState.credentials;
      }

      if (Object.keys(updateData).length > 0) {
        await dispatch(
          updatePaymentConfig({
            configId: currentConfig.id,
            data: updateData,
          })
        ).unwrap();
      }

      toast.success("Payment configuration updated successfully!", {
        autoClose: 2000,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update configuration:", error);
      toast.error("Failed to update payment configuration", {
        autoClose: 2000,
      });
    }
  };

  const handleCancel = () => {
    // Reset form state to original values
    if (currentConfig) {
      const currentCredentials = currentConfig.credentials || {};
      setFormState({
        active: currentConfig.active,
        credentials: { ...currentCredentials },
      });
    }
    setHasChanges(false);
    onClose();
  };

  const renderCredentialFields = () => {
    if (
      !formState.credentials ||
      Object.keys(formState.credentials).length === 0
    ) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          No credentials configured for this payment method.
        </div>
      );
    }

    return Object.entries(formState.credentials).map(([key, value]) => (
      <div key={key} className="space-y-2">
        <Label htmlFor={key}>
          {key.charAt(0).toUpperCase() +
            key.slice(1).replace(/([A-Z])/g, " $1")}
        </Label>
        <Input
          id={key}
          type={
            key.toLowerCase().includes("key") ||
            key.toLowerCase().includes("secret") ||
            key.toLowerCase().includes("password")
              ? "password"
              : "text"
          }
          value={(value as string) || ""}
          onChange={(e) => handleCredentialChange(key, e.target.value)}
          placeholder={`Enter ${key}`}
        />
      </div>
    ));
  };

  if (!currentConfig || currentConfig.paymentMethod !== methodId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <span className="w-10 h-10">
              {paymentMethodIcons[methodId] ? (
                <img
                  src={paymentMethodIcons[methodId]}
                  alt={methodId}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                "💳"
              )}
            </span>
            <div>
              <DialogTitle>{methodId} Configuration</DialogTitle>
              <DialogDescription>
                Manage your {methodId} payment settings
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Status Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Status</h3>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="active-status" className="text-base">
                  Payment Method Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formState.active
                    ? "Active - Accepting payments"
                    : "Inactive - Not accepting payments"}
                </p>
              </div>
              <Switch
                id="active-status"
                checked={formState.active}
                onCheckedChange={handleActiveChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Credentials Section */}
          {Object.keys(formState.credentials).length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Credentials</h3>
              <div className="space-y-4 p-3 border rounded-lg">
                {renderCredentialFields()}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !hasChanges}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
