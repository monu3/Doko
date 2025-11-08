"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Order } from "@/orders/types";

interface OrderTableProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
}

export function OrderTable({ orders, onOrderClick }: OrderTableProps) {
  if (!onOrderClick) {
    return <div>Error: Missing onOrderClick handler</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <div className="p-4 text-center text-muted-foreground">
          No orders found matching your criteria.
        </div>
      </Card>
    );
  }
  const handleRowClick = (order: Order, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (onOrderClick && typeof onOrderClick === "function") {
      onOrderClick(order);
    } else {
    }
  };

  // Optional: Filter out invalid orders
  const validOrders = orders.filter((order) => order && order.id);

  return (
    <Card>
      <div className="rounded-md border">
        <div className="grid grid-cols-8 gap-4 p-4 text-sm font-medium text-muted-foreground border-b">
          <div>Order ID</div>
          <div>Date</div>
          <div>Customer</div>
          <div>Items</div>
          <div>Payment</div>
          <div>Status</div>
          <div>Amount</div>
          <div>Channel</div>
        </div>
        <div className="divide-y">
          {validOrders.map((order) => (
            <div
              key={order.id}
              // className="grid grid-cols-8 gap-4 p-4 text-sm items-center"
              className="grid grid-cols-8 gap-4 p-4 text-sm items-center hover:bg-gray-100 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-sm active:bg-gray-200"
              onClick={(event) => handleRowClick(order, event)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleRowClick(order, event as any);
                }
              }}
            >
              <div className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                {order.orderNumber}
              </div>
              <div className="text-gray-700">
                {order.createdAt
                  ? format(new Date(order.createdAt), "MMM d yyyy, h:mm a")
                  : "N/A"}
              </div>
              <div className="text-gray-700">{order.customerName || "N/A"}</div>
              <div className="text-gray-700">{order.items?.length ?? 0}</div>
              <div>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                >
                  {order.paymentMethod || "N/A"}
                </Badge>
              </div>
              <div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-100"
                >
                  {order.status || "N/A"}
                </Badge>
              </div>
              <div>NPR {order.total?.toLocaleString() ?? "0"}</div>
              <div>{order.channel || "N/A"}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
