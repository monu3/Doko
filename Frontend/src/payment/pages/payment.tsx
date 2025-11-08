"use client"

import { useState } from "react"
import { CalendarIcon, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

// Dummy data for completed payouts
const completedPayouts = [
  {
    id: "TXN-20250217-001",
    payoutDate: new Date("2025-02-17"),
    orderAmount: 15000,
    payoutAmount: 14550, // 97% of order amount (3% fee)
  },
  {
    id: "TXN-20250216-002",
    payoutDate: new Date("2025-02-16"),
    orderAmount: 8500,
    payoutAmount: 8245,
  },
  {
    id: "TXN-20250215-003",
    payoutDate: new Date("2025-02-15"),
    orderAmount: 22000,
    payoutAmount: 21340,
  },
  {
    id: "TXN-20250214-004",
    payoutDate: new Date("2025-02-14"),
    orderAmount: 12500,
    payoutAmount: 12125,
  },
  {
    id: "TXN-20250213-005",
    payoutDate: new Date("2025-02-13"),
    orderAmount: 18750,
    payoutAmount: 18187.5,
  },
]

// Dummy data for customer refunds
const customerRefunds = [
  {
    id: "REF-20250217-001",
    refundDate: new Date("2025-02-17"),
    orderAmount: 4500,
    refundAmount: 4500,
  },
  {
    id: "REF-20250216-002",
    refundDate: new Date("2025-02-16"),
    orderAmount: 3200,
    refundAmount: 3000, // Partial refund
  },
  {
    id: "REF-20250215-003",
    refundDate: new Date("2025-02-15"),
    orderAmount: 7800,
    refundAmount: 7800,
  },
  {
    id: "REF-20250214-004",
    refundDate: new Date("2025-02-14"),
    orderAmount: 5500,
    refundAmount: 5500,
  },
]

// Calculate total amounts
const totalPayoutAmount = completedPayouts.reduce((sum, payout) => sum + payout.payoutAmount, 0)

export default function PaymentsPage() {
  const [dateFilter, setDateFilter] = useState("30")

  const formatAmount = (amount: number) => {
    return `NPR${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Transactions</h1>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[160px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last 365 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayouts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(totalPayoutAmount)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Tabs defaultValue="completed" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="completed">Completed payouts</TabsTrigger>
              <TabsTrigger value="refunds">Customer refunds</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <TabsContent value="completed">
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-300">
                  <TableRow>
                    <TableHead>Payout date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Total order amount</TableHead>
                    <TableHead className="text-right">Total payout amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedPayouts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    completedPayouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>{format(payout.payoutDate, "MMM d, yyyy")}</TableCell>
                        <TableCell className="font-medium">{payout.id}</TableCell>
                        <TableCell>{formatAmount(payout.orderAmount)}</TableCell>
                        <TableCell className="text-right">{formatAmount(payout.payoutAmount)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="refunds">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Refund date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Order amount</TableHead>
                    <TableHead className="text-right">Refund amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerRefunds.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                        No refunds found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    customerRefunds.map((refund) => (
                      <TableRow key={refund.id}>
                        <TableCell>{format(refund.refundDate, "MMM d, yyyy")}</TableCell>
                        <TableCell className="font-medium">{refund.id}</TableCell>
                        <TableCell>{formatAmount(refund.orderAmount)}</TableCell>
                        <TableCell className="text-right">{formatAmount(refund.refundAmount)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

