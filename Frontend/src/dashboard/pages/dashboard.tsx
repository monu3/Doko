"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"
import { DashboardCharts } from "../components/dashboard-charts"
import { DashboardMetrics } from "../components/dashboard-metrics"
import { DashboardTables } from "../components/dashboard-tables"
import { ThemeCustomizer } from "../components/theme-customizer"

export default function Dashboard() {
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false)

  const salesByLocation = [
    { district: "Kathmandu", percentage: 85, change: "+5.2%" },
    { district: "Surkhet", percentage: 80, change: "+7.8%" },
    { district: "Dang", percentage: 63, change: "-2.1%" },
    { district: "Pokhara", percentage: 60, change: "+3.4%" },
    { district: "Jhapa", percentage: 45, change: "+1.2%" },
    { district: "Humla", percentage: 40, change: "+1%" },
  ]

  return (
    <div className="flex h-screen bg-background">

      <div className="flex-1 flex flex-col overflow-hidden">

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Congratulations Card */}
          {/* <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground">Congratulations John! 🎉</h2>
                  <p className="text-muted-foreground mt-1">Best seller of the month</p>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-primary">$42,379</div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Badge variant="default">+2.5%</Badge>
                      <span className="text-muted-foreground">from last month</span>
                    </div>
                  </div>
                  <Button className="mt-4">View Sales</Button>
                </div>
                <div className="hidden md:block">
                  <img src="/celebration-trophy.png" alt="Trophy" className="h-24 w-24" />
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Metrics Cards */}
          <DashboardMetrics />

          {/* Charts Section */}
          <DashboardCharts />

          {/* Revenue Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <CardDescription>Income in the last 28 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Desktop</div>
                    <div className="text-2xl font-bold">24,828</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Mobile</div>
                    <div className="text-2xl font-bold">25,010</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sales by Location</CardTitle>
                <CardDescription>Income in the last 28 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {salesByLocation.map((location) => (
                    <div key={location.district} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{location.district}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">{location.percentage}%</span>
                          <Badge
                            variant={location.change.startsWith("+") ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {location.change}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={location.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Customer Reviews</CardTitle>
                <CardDescription>Based on 5,500 verified purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-2xl font-bold">4.5</span>
                    </div>
                    <span className="text-sm text-muted-foreground">out of 5</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { stars: 5, count: 4000 },
                      { stars: 4, count: 2100 },
                      { stars: 3, count: 800 },
                      { stars: 2, count: 631 },
                      { stars: 1, count: 344 },
                    ].map((rating) => (
                      <div key={rating.stars} className="flex items-center space-x-2 text-sm">
                        <span className="w-2">{rating.stars}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <Progress value={(rating.count / 5500) * 100} className="flex-1 h-2" />
                        <span className="text-muted-foreground w-12 text-right">{rating.count}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">March 12, 2025</span>
                    </div>
                    <p className="text-sm font-medium">Exceeded my expectations!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      I was skeptical at first, but this product has completely changed my daily routine.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <span className="font-medium">Sarah J.</span> • Verified Purchase
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tables Section */}
          <DashboardTables />
        </main>
      </div>

      <ThemeCustomizer isOpen={isThemeCustomizerOpen} onClose={() => setIsThemeCustomizerOpen(false)} />
    </div>
  )
}
