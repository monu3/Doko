"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getOrdersByShop, updateOrderStatus } from "../slice/orderSlice";

export function OrderDetails({
  orderId,
  onBack,
}: {
  orderId: string;
  onBack: () => void;
}) {
  const dispatch = useAppDispatch();
  const { updatingStatus, orders } = useAppSelector((state) => state.orders);
  const shopId = useAppSelector((state) => state.shop.shop?.id);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  // Find the current order from Redux store
  const order = orders.find((o) => o.id === orderId);

  // If order is not found, try to fetch it
  useEffect(() => {
    if (!order && shopId) {
      // You might need to implement a fetchOrderById action
      dispatch(getOrdersByShop(shopId));
    }
  }, [order, orderId]);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await dispatch(
        updateOrderStatus({
          orderId: orderId,
          status: newStatus,
        })
      ).unwrap();
      // Status is now updated in Redux, and this component will re-render
    } catch (error) {
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getNextStatusAction = (currentStatus: string) => {
    switch (currentStatus.toLowerCase()) {
      case "pending":
        return {
          label: "Accept Order",
          status: "ACCEPTED",
          variant: "default" as const,
        };
      case "accepted":
        return {
          label: "Ship Order",
          status: "SHIPPED",
          variant: "default" as const,
        };
      case "shipped":
        return {
          label: "Mark as Delivered",
          status: "DELIVERED",
          variant: "default" as const,
        };
      default:
        return null;
    }
  };

  if (!order) {
    return <div className="text-red-600">Order not found</div>;
  }
  const nextAction = getNextStatusAction(order.status);

  const nextItem = () => {
    setCurrentItemIndex((prev) =>
      prev < order.items.length - 1 ? prev + 1 : 0
    );
  };

  const prevItem = () => {
    setCurrentItemIndex((prev) =>
      prev > 0 ? prev - 1 : order.items.length - 1
    );
  };

  const currentItem = order.items[currentItemIndex];

  const handleBackClick = () => {
    if (onBack && typeof onBack === "function") {
      onBack();
    } else {
    }
  };

  return (
    <div className="min-h-fit bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="hidden sm:block w-px h-6 bg-gray-300" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Order Details{" "}
                <span className="mt-1 text-sm text-green-600">
                  {order.orderNumber}
                </span>
              </h1>
            </div>
          </div>
          <Badge
            className={`gap-2 px-4 py-2 text-sm font-medium border ${getStatusColor(
              order.status
            )}`}
          >
            {getStatusIcon(order.status)}
            {order.status.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Items Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-xl font-semibold">
                    Order Items ({order.items.length})
                  </CardTitle>
                  {order.items.length > 1 && (
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" onClick={prevItem}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-600 font-medium">
                        {currentItemIndex + 1} of {order.items.length}
                      </span>
                      <Button variant="outline" size="sm" onClick={nextItem}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentItem && (
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {currentItem.productImage ? (
                        <img
                          src={currentItem.productImage || "/placeholder.svg"}
                          alt={currentItem.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {currentItem.productName}
                        </h3>
                        {currentItem.variant && (
                          <p className="text-gray-600 mt-1">
                            Variant: {currentItem.variant}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Quantity:</span>
                          <span className="ml-2 font-medium">
                            {currentItem.quantity}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Unit Price:</span>
                          <span className="ml-2 font-medium">
                            NPR{currentItem.unitPrice.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          {currentItem.discountPercentage > 0 && (
                            <Badge
                              variant="secondary"
                              className="bg-red-100 text-red-800"
                            >
                              {currentItem.discountPercentage}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <span className="text-lg font-semibold text-gray-900">
                          Total: NPR{currentItem.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {order.items.length > 1 && (
                  <div className="pt-4 border-t">
                    <div className="flex flex-wrap gap-3">
                      {order.items.map((item, index) => (
                        <button
                          key={item.productId}
                          onClick={() => setCurrentItemIndex(index)}
                          className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                            index === currentItemIndex
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {item.productImage ? (
                            <img
                              src={item.productImage || "/placeholder.svg"}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">
                        {order.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-gray-600">Customer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.shippingAddress.mobile}
                      </p>
                      <p className="text-sm text-gray-600">Phone</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.shippingAddress.email}
                      </p>
                      <p className="text-sm text-gray-600">Email</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.shippingAddress.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order Date</span>
                    <span className="font-medium">
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method</span>
                    <Badge variant="outline" className="font-medium">
                      {order.paymentMethod}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Channel</span>
                    <span className="font-medium">{order.channel}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      NPR{order.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      NPR{order.deliveryFee.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      NPR{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {nextAction && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full h-12 text-base font-medium"
                    variant={nextAction.variant}
                    onClick={() => handleStatusUpdate(nextAction.status)}
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? "Updating..." : nextAction.label}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
