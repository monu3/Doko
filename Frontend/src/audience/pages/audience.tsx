"use client";

import { fetchAudience } from "@/shop/slice/shopSlice";
import type { AudienceData } from "@/shop/types";
import { RootState } from "@/store";
import { useState, useMemo, useEffect } from "react";
import { OrderTabs } from "../components/tabs";
import { AudienceTable } from "../components/table";
import { useAppDispatch, useAppSelector } from "@/hooks";

const tabs = [
  { id: "all", label: "All Customers" },
  { id: "active", label: "Active Customers" },
  { id: "new", label: "New Customers" },
  { id: "high-value", label: "High Value" },
];

export default function Audience() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField] = useState<string | null>(null);
  const [sortDirection] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("all");

  const { audience, audienceStatus, audienceError, shop } = useAppSelector(
    (state: RootState) => state.shop
  );

  useEffect(() => {
    if (shop?.id) {
      dispatch(fetchAudience(shop.id));
    }
  }, [dispatch, shop?.id]);

  const filteredAudiences = useMemo(() => {
    let filteredData = audience;

    switch (activeTab) {
      case "active":
        filteredData = audience.filter((customer) => customer.totalOrders > 0);
        break;
      case "new":
        filteredData = audience.filter(
          (customer) => customer.totalOrders === 1
        );
        break;
      case "high-value":
        filteredData = audience.filter((customer) => customer.totalSales > 500);
        break;
      default:
        filteredData = audience;
    }

    return filteredData
      .filter((customer) => {
        const matchesSearch =
          searchQuery === "" ||
          customer.customerName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.mobileNumber.includes(searchQuery) ||
          customer.city.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        if (!sortField) return 0;

        let aValue: any = a[sortField as keyof AudienceData];
        let bValue: any = b[sortField as keyof AudienceData];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [audience, activeTab, searchQuery, sortField, sortDirection]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  

  const handleAudienceClick = (customer: AudienceData) => {
    console.log("Customer clicked:", customer.customerName);
    // Handle customer click - could show details, etc.
  };

  if (audienceStatus === "loading") {
    return (
      <div className="p-4 max-w-[1400px] mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading audience data...</div>
        </div>
      </div>
    );
  }

  if (audienceStatus === "failed") {
    return (
      <div className="p-4 max-w-[1400px] mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {audienceError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-[1400px] mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Audience</h1>
        <div className="text-sm text-gray-600">
          Total Customers: {audience.length}
        </div>
      </div>

      <div className="flex justify-between items-center gap-4">
        <OrderTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search customers by name, email, mobile, or city..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <AudienceTable
        audiences={filteredAudiences}
        onAudienceClick={handleAudienceClick}
      />
    </div>
  );
}
