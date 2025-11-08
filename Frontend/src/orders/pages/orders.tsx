"use client";

import { useState, useMemo, useCallback } from "react";
import { OrderTabs } from "../components/tabs";
import { OrderActions } from "../components/actions";
import { OrderTable } from "../components/table";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { useOrders } from "../../hooks/useOrders";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setSelectedOrder } from "@/orders/slice/orderSlice";
import { Order } from "@/orders/types";
import { OrderDetails } from "./orderDetails";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc"); // Changed to desc to show newest first
  const [dateRange, setDateRange] = useState<string | null>(null);

  const { orders, loading, error, selectedOrder } = useAppSelector(
    (state) => state.orders
  );

  const [selectedOrderForDetails] = useState<Order | null>(null);

  // Get orders from Redux store
  // const { orders } = useAppSelector((state) => state.orders);
  const { refetch } = useOrders();

  // Use the selectedOrder from Redux instead of local state
  const handleOrderClick = useCallback(
    (order: Order) => {
      dispatch(setSelectedOrder(order));
    },
    [dispatch]
  );

  const handleBackToOrders = useCallback(() => {
    dispatch(setSelectedOrder(null));
    // Refresh orders when returning to the list
    refetch();
  }, [dispatch, refetch]);

  const isWithinDateRange = (dateString: string, range: string | null) => {
    if (!range) return true;
    const now = new Date();
    const orderDate = new Date(dateString);
    switch (range) {
      case "today":
        return orderDate.toDateString() === now.toDateString();
      case "yesterday":
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return orderDate.toDateString() === yesterday.toDateString();
      case "last7days":
        const last7Days = new Date(now);
        last7Days.setDate(last7Days.getDate() - 7);
        return orderDate >= last7Days;
      case "last30days":
        const last30Days = new Date(now);
        last30Days.setDate(last30Days.getDate() - 30);
        return orderDate >= last30Days;
      default:
        return true;
    }
  };

  const filterOrders = (
    tabId: string,
    query: string,
    sortField: string | null,
    sortDirection: "asc" | "desc",
    dateRange: string | null
  ) => {
    return orders
      .filter((order) => {
        const matchesTab =
          tabId === "all" || order.status.toLowerCase() === tabId.toLowerCase();
        const matchesSearch =
          query === "" ||
          order.id.toLowerCase().includes(query.toLowerCase()) ||
          order.customerName.toLowerCase().includes(query.toLowerCase()) ||
          order.shippingAddress.mobile
            .toLowerCase()
            .includes(query.toLowerCase());
        const matchesDateRange = isWithinDateRange(order.createdAt, dateRange);
        return matchesTab && matchesSearch && matchesDateRange;
      })
      .sort((a, b) => {
        // Default sort by date (newest first) if no sortField is specified
        const field = sortField || "date";
        let aValue: any = a[field as keyof typeof a];
        let bValue: any = b[field as keyof typeof b];

        // Convert date strings to Date objects for proper sorting
        if (field === "date") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  };

  const filteredOrders = useMemo(() => {
    return filterOrders(
      activeTab,
      searchQuery,
      sortField,
      sortDirection,
      dateRange
    );
  }, [activeTab, searchQuery, sortField, sortDirection, dateRange, orders]);

  const tabs = [
    { id: "all", label: "All", count: orders.length },
    {
      id: "pending",
      label: "Pending",
      count: orders.filter((order) => order.status === "Pending").length,
    },
    {
      id: "accepted",
      label: "Accepted",
      count: orders.filter((order) => order.status === "Accepted").length,
    },
    {
      id: "shipped",
      label: "Shipped",
      count: orders.filter((order) => order.status === "Shipped").length,
    },
    {
      id: "delivered",
      label: "Delivered",
      count: orders.filter((order) => order.status === "Delivered").length,
    },
    {
      id: "others",
      label: "Others",
      count: orders.filter(
        (order) =>
          !["Pending", "Accepted", "Shipped", "Delivered"].includes(
            order.status
          )
      ).length,
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDateRangeChange = (range: string | null) => {
    setDateRange(range);
  };

  const handleDownload = (format: "pdf" | "excel") => {
    if (format === "pdf") {
      const doc = new jsPDF();
      (doc as any).autoTable({
        head: [
          [
            "Order ID",
            "Date",
            "Customer",
            "Items",
            "Payment",
            "Status",
            "Amount",
            "Channel",
          ],
        ],
        body: filteredOrders.map((order) => [
          order.orderNumber,
          new Date(order.createdAt).toLocaleDateString(),
          order.customerName,
          order.items,
          order.paymentMethod,
          order.status,
          order.total,
          order.channel,
        ]),
      });
      doc.save("orders.pdf");
    } else {
      const ws = XLSX.utils.json_to_sheet(
        filteredOrders.map((order) => ({
          ...order,
          date: new Date(order.createdAt).toLocaleDateString(),
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");
      XLSX.writeFile(wb, "orders.xlsx");
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error fetching orders: {error}
      </div>
    );
  }

  console.log(
    "selectedOrderForDetails:",
    selectedOrderForDetails?.orderNumber || "none"
  );
  // Show order details if an order is selected
  if (selectedOrder) {
    return (
      <OrderDetails orderId={selectedOrder.id} onBack={handleBackToOrders} />
    );
  }

  console.log("Passing onOrderClick to OrderTable:", typeof handleOrderClick);

  return (
    <div className="p-4 max-w-[1400px] mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="text-sm text-gray-600">
          Total Orders: {orders.length}
        </div>
      </div>
      <OrderTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <OrderActions
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSort={handleSort}
        onDateRangeChange={handleDateRangeChange}
        onDownload={handleDownload}
      />
      <OrderTable
        orders={filteredOrders.map((order) => ({
          ...order,
          orderNumber: order.orderNumber ?? "",
        }))}
        onOrderClick={handleOrderClick}
      />
    </div>
  );
}
