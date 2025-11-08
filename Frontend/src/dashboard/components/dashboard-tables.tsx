"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, ArrowUpRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentOrders = [
  {
    id: "#3210",
    customer: "Olivia Martin",
    email: "olivia.martin@email.com",
    product: "Wireless Headphones",
    amount: "$79.00",
    status: "Processing",
  },
  {
    id: "#3209",
    customer: "Jackson Lee",
    email: "jackson.lee@email.com",
    product: "Smart Watch",
    amount: "$199.00",
    status: "Shipped",
  },
  {
    id: "#3208",
    customer: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    product: "Laptop Stand",
    amount: "$39.00",
    status: "Delivered",
  },
  {
    id: "#3207",
    customer: "William Kim",
    email: "will@email.com",
    product: "Bluetooth Speaker",
    amount: "$99.00",
    status: "Processing",
  },
  {
    id: "#3206",
    customer: "Sofia Davis",
    email: "sofia.davis@email.com",
    product: "Phone Case",
    amount: "$19.00",
    status: "Delivered",
  },
];

const topProducts = [
  {
    name: "Wireless Headphones",
    sales: 1234,
    revenue: "$98,720",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Smart Watch",
    sales: 987,
    revenue: "$196,230",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Laptop Stand",
    sales: 756,
    revenue: "$29,484",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Bluetooth Speaker",
    sales: 543,
    revenue: "$53,757",
    image: "/placeholder.svg?height=40&width=40",
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "Processing":
      return <Badge variant="secondary">{status}</Badge>;
    case "Shipped":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          {status}
        </Badge>
      );
    case "Delivered":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          {status}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function DashboardTables() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest customer orders and their status
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>
                          {order.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {order.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.name} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10 rounded-md">
                    <AvatarImage
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                    />
                    <AvatarFallback className="rounded-md">
                      {product.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.sales} sales
                  </p>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {product.revenue}
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
