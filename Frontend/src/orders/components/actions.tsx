"use client"

import { Search, Plus, Download, ArrowUpDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface OrderActionsProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onSort: (field: string) => void
  onDateRangeChange: (range: string | null) => void
  onDownload: (format: "pdf" | "excel") => void
}

export function OrderActions({
  searchQuery,
  onSearchChange,
  onSort,
  onDateRangeChange,
  onDownload,
}: OrderActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Order ID, phone or a name..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onDownload("pdf")}>Download as PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload("excel")}>Download as Excel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSort("date")}>Date</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("customer")}>Customer</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("amount")}>Amount</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("status")}>Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Lifetime
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDateRangeChange("today")}>Today</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDateRangeChange("yesterday")}>Yesterday</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDateRangeChange("last7days")}>Last 7 days</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDateRangeChange("last30days")}>Last 30 days</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDateRangeChange(null)}>All time</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="customer">Customer Name</label>
                <Input id="customer" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="items">Number of Items</label>
                <Input id="items" type="number" min="1" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="amount">Amount</label>
                <Input id="amount" type="number" min="0" />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

