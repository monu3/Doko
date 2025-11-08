"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ShippingSettings } from "../settings"

export function ShippingForm() {
  const [settings, setSettings] = useState<ShippingSettings>({
    freeShippingThreshold: 50,
    shippingZones: ["domestic", "international"],
    defaultShippingRate: 5.99,
    expeditedShipping: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Shipping settings updated:", settings)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Shipping</h2>
        <p className="text-muted-foreground">Configure shipping zones, rates, and delivery options.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Rates</CardTitle>
            <CardDescription>Set your default shipping rates and thresholds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultShippingRate">Default Shipping Rate</Label>
                <Input
                  id="defaultShippingRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.defaultShippingRate}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultShippingRate: Number.parseFloat(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.freeShippingThreshold}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      freeShippingThreshold: Number.parseFloat(e.target.value),
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground">Minimum order value for free shipping</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Options</CardTitle>
            <CardDescription>Configure available shipping methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="expedited-shipping">Expedited Shipping</Label>
                <p className="text-sm text-muted-foreground">Offer faster delivery options for additional cost</p>
              </div>
              <Switch
                id="expedited-shipping"
                checked={settings.expeditedShipping}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, expeditedShipping: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Zones</CardTitle>
            <CardDescription>Manage your shipping coverage areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Current shipping zones: {settings.shippingZones.join(", ")}
              </p>
              <Button variant="outline" type="button">
                Manage Shipping Zones
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Shipping Settings</Button>
        </div>
      </form>
    </div>
  )
}
