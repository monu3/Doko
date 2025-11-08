"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CheckoutSettings } from "../settings"

export function CheckoutForm() {
  const [settings, setSettings] = useState<CheckoutSettings>({
    guestCheckout: true,
    requireAccount: false,
    showTaxes: true,
    showShipping: true,
    termsRequired: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Checkout settings updated:", settings)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Checkout</h2>
        <p className="text-muted-foreground">Configure your checkout process and requirements.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Options</CardTitle>
            <CardDescription>Control how customers can complete their purchase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="guest-checkout">Allow Guest Checkout</Label>
                <p className="text-sm text-muted-foreground">Let customers checkout without creating an account</p>
              </div>
              <Switch
                id="guest-checkout"
                checked={settings.guestCheckout}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, guestCheckout: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-account">Require Account Creation</Label>
                <p className="text-sm text-muted-foreground">Force customers to create an account before checkout</p>
              </div>
              <Switch
                id="require-account"
                checked={settings.requireAccount}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, requireAccount: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display Options</CardTitle>
            <CardDescription>Choose what information to show during checkout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-taxes">Show Taxes</Label>
                <p className="text-sm text-muted-foreground">Display tax breakdown in checkout summary</p>
              </div>
              <Switch
                id="show-taxes"
                checked={settings.showTaxes}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showTaxes: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-shipping">Show Shipping Costs</Label>
                <p className="text-sm text-muted-foreground">Display shipping costs in checkout summary</p>
              </div>
              <Switch
                id="show-shipping"
                checked={settings.showShipping}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showShipping: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legal Requirements</CardTitle>
            <CardDescription>Set legal and compliance requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="terms-required">Require Terms Acceptance</Label>
                <p className="text-sm text-muted-foreground">Customers must accept terms and conditions</p>
              </div>
              <Switch
                id="terms-required"
                checked={settings.termsRequired}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, termsRequired: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Checkout Settings</Button>
        </div>
      </form>
    </div>
  )
}
