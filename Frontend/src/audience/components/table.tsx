"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface Audience {
  customerName: string
  mobileNumber: string
  email: string
  city: string
  totalOrders: number
  totalSales: number
}

interface AudienceTableProps {
  audiences: Audience[]
  onAudienceClick?: (audience: Audience) => void
}

export function AudienceTable({ audiences, onAudienceClick }: AudienceTableProps) {
  if (!audiences || audiences.length === 0) {
    return (
      <Card>
        <div className="p-4 text-center text-muted-foreground">No audience data found matching your criteria.</div>
      </Card>
    )
  }

  const handleRowClick = (audience: Audience, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    console.log("Audience clicked:", audience.customerName)
    if (onAudienceClick && typeof onAudienceClick === "function") {
      onAudienceClick(audience)
    }
  }

  return (
    <Card>
      <div className="rounded-md border">
        <div className="grid grid-cols-6 gap-4 p-4 text-sm font-medium text-muted-foreground border-b">
          <div>Customer Name</div>
          <div>Mobile Number</div>
          <div>Email</div>
          <div>City</div>
          <div>Total Orders</div>
          <div>Total Sales</div>
        </div>
        <div className="divide-y">
          {audiences.map((audience, index) => (
            <div
              key={`${audience.email}-${index}`}
              className="grid grid-cols-6 gap-4 p-4 text-sm items-center hover:bg-gray-100 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-sm active:bg-gray-200"
              onClick={(event) => handleRowClick(audience, event)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  handleRowClick(audience, event as any)
                }
              }}
            >
              <div className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                {audience.customerName}
              </div>
              <div className="text-gray-700">{audience.mobileNumber}</div>
              <div className="text-gray-700">{audience.email}</div>
              <div className="text-gray-700">{audience.city}</div>
              <div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {audience.totalOrders}
                </Badge>
              </div>
              <div className="font-medium">NPR {audience.totalSales.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
