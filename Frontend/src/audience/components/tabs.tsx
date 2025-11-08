"use client"

import { Button } from "@/components/ui/button"

interface Tab {
  id: string
  label: string
  count?: number
}

interface OrderTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function OrderTabs({ tabs, activeTab, onTabChange }: OrderTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "secondary" : "outline"}
          className="gap-2"
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.count && <span className="bg-white rounded px-1.5 text-sm">{tab.count}</span>}
        </Button>
      ))}
    </div>
  )
}

