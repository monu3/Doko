"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PolicySettings } from "../settings"

export function PoliciesForm() {
  const [settings, setSettings] = useState<PolicySettings>({
    privacyPolicy: "",
    termsOfService: "",
    returnPolicy: "",
    shippingPolicy: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Policy settings updated:", settings)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Policies</h2>
        <p className="text-muted-foreground">Create and manage your store's legal policies and terms.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <CardDescription>Explain how you collect, use, and protect customer data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="privacyPolicy">Privacy Policy Content</Label>
              <Textarea
                id="privacyPolicy"
                value={settings.privacyPolicy}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    privacyPolicy: e.target.value,
                  }))
                }
                placeholder="Enter your privacy policy..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
            <CardDescription>Define the terms and conditions for using your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="termsOfService">Terms of Service Content</Label>
              <Textarea
                id="termsOfService"
                value={settings.termsOfService}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    termsOfService: e.target.value,
                  }))
                }
                placeholder="Enter your terms of service..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Return Policy</CardTitle>
            <CardDescription>Specify your return and refund policies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="returnPolicy">Return Policy Content</Label>
              <Textarea
                id="returnPolicy"
                value={settings.returnPolicy}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    returnPolicy: e.target.value,
                  }))
                }
                placeholder="Enter your return policy..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Policy</CardTitle>
            <CardDescription>Detail your shipping terms and delivery information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="shippingPolicy">Shipping Policy Content</Label>
              <Textarea
                id="shippingPolicy"
                value={settings.shippingPolicy}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    shippingPolicy: e.target.value,
                  }))
                }
                placeholder="Enter your shipping policy..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Policy Settings</Button>
        </div>
      </form>
    </div>
  )
}
