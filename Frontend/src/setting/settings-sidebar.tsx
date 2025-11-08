"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Store, Bell, CreditCard, ShoppingCart, Truck, Globe, MessageCircle, FileText, MapPin } from "lucide-react"
import type { SettingsSection } from "./settings"

interface SettingsSidebarProps {
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
}

const settingsItems = [
  {
    id: "store-details" as SettingsSection,
    label: "Store details",
    icon: Store,
    description: "Basic store information",
  },
  {
    id: "store-address" as SettingsSection,
    label: "Store Address",
    icon: MapPin,
    description: "Store Address information",
  },
  {
    id: "notifications" as SettingsSection,
    label: "Notifications",
    icon: Bell,
    description: "Email and push notifications",
  },
  {
    id: "payments" as SettingsSection,
    label: "Payments",
    icon: CreditCard,
    description: "Payment methods and settings",
  },
  {
    id: "checkout" as SettingsSection,
    label: "Checkout",
    icon: ShoppingCart,
    description: "Checkout process settings",
  },
  {
    id: "shipping" as SettingsSection,
    label: "Shipping",
    icon: Truck,
    description: "Shipping zones and rates",
  },
  {
    id: "languages" as SettingsSection,
    label: "Languages",
    icon: Globe,
    description: "Language and localization",
  },
  {
    id: "support-social" as SettingsSection,
    label: "Support & Social",
    icon: MessageCircle,
    description: "Support contacts and social media",
  },
  {
    id: "policies" as SettingsSection,
    label: "Policies",
    icon: FileText,
    description: "Terms, privacy, and policies",
  },
]

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <Card className="p-4">
      <nav className="space-y-2">
        {settingsItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3 text-left",
                isActive && "bg-blue-50 text-blue-700 border-blue-200",
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <div className="flex items-start space-x-3">
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                </div>
              </div>
            </Button>
          )
        })}
      </nav>
    </Card>
  )
}
