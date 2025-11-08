"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: React.ReactNode
}

function MetricCard({ title, value, change, changeType, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs">
          {changeType === "positive" ? (
            <TrendingUp className="h-3 w-3 text-primary" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive" />
          )}
          <Badge variant={changeType === "positive" ? "default" : "destructive"} className="text-xs">
            {change}
          </Badge>
          <span className="text-muted-foreground">from last month</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value="NRP 45,231.89"
        change="+20.1%"
        changeType="positive"
        icon={<DollarSign className="h-4 w-4" />}
      />
      <MetricCard
        title="Sales"
        value="2,350"
        change="+15.3%"
        changeType="positive"
        icon={<ShoppingCart className="h-4 w-4" />}
      />
      <MetricCard
        title="New Customers"
        value="1,234"
        change="+8.2%"
        changeType="positive"
        icon={<Users className="h-4 w-4" />}
      />
      <MetricCard
        title="Products Sold"
        value="573"
        change="-2.4%"
        changeType="negative"
        icon={<Package className="h-4 w-4" />}
      />
    </div>
  )
}
