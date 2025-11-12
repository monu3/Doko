"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  MapPin,
  CreditCard,
  BadgeCheck,
  ArrowLeft,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import { useCustomerAuth } from "@/hooks/useCustomer";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "../types";
import { useShopPaymentMethods } from "@/hooks/useShopPaymentMethods";

interface CheckoutFlowProps {
  shopData: {
    shopId: string;
    shopItems: CartItem[];
  };
  onBack: () => void;
  onOrderComplete: () => void;
}

interface ProgressStep {
  id: number;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface OrderData {
  orderId: string;
  orderNumber: string;
  items: CartItem[];
  address: AddressData;
  paymentMethod: string;
  paymentStatus: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED";
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderDate: Date;
}

interface AddressData {
  name: string;
  email: string;
  mobile: string;
  country: string;
  address: string;
  city: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobile?: string;
  country?: string;
  address?: string;
  city?: string;
}

const steps: ProgressStep[] = [
  {
    id: 1,
    label: "Address",
    icon: <MapPin className="w-4 h-4" />,
    description: "Shipping information",
  },
  {
    id: 2,
    label: "Payment",
    icon: <CreditCard className="w-4 h-4" />,
    description: "Payment details",
  },
  {
    id: 3,
    label: "Confirmation",
    icon: <BadgeCheck className="w-4 h-4" />,
    description: "Order confirmation",
  },
];

const basePaymentOptions = [
  {
    id: "COD",
    name: "Cash on Delivery",
    description: "Pay in cash at the time of delivery.",
    icon: "💵",
  },
  {
    id: "ESEWA",
    name: "eSewa",
    description: "Pay securely with eSewa digital wallet.",
    icon: "📱",
  },
  {
    id: "KHALTI",
    name: "Khalti",
    description: "Pay securely with Khalti digital wallet.",
    icon: "💳",
  },
];

export default function CheckoutFlow({
  shopData,
  onBack,
  onOrderComplete,
}: CheckoutFlowProps) {
  const { user } = useCustomerAuth();
  const {
    createOrder,
    clearErrors,
    orderLoading,
    initiatePaymentProcess,
    paymentLoading,
    clearAllItems,
  } = useCart();

  const { paymentMethods, loading: paymentMethodsLoading } =
    useShopPaymentMethods(shopData.shopId);

  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [addressData, setAddressData] = useState<AddressData>({
    name: "",
    email: user?.email || "",
    mobile: "",
    country: "Nepal",
    address: "",
    city: "",
  });

  // Calculate totals
  const subtotal = shopData.shopItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;
  const amountMinor = Math.round(total * 100);

  const availablePaymentOptions = basePaymentOptions.filter((option) =>
    paymentMethods.includes(option.id)
  );

  // Reset state when component mounts or shopData changes
  useEffect(() => {
    setActiveStep(1);
    setOrderData(null);
    setPaymentMethod("COD");
    setIsProcessing(false);
    setErrors({});
    setAddressData({
      name: "",
      email: user?.email || "",
      mobile: "",
      country: "Nepal",
      address: "",
      city: "",
    });
  }, [shopData.shopId, user?.email]);

  // Handle payment return from gateway
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("paymentStatus");
    const orderIdParam = urlParams.get("orderId");

    if (paymentStatus && orderIdParam) {
      if (paymentStatus === "success") {
        toast.success("Payment completed successfully!", {
          position: "top-right",
        });
      } else {
        toast.error("Payment failed. Please try again.", {
          position: "top-right",
        });
      }

      // Clean up URL parameters
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const createOrderFirst = async (): Promise<{
    id: string;
    orderNumber: string;
  }> => {
    const orderPayload = {
      shopId: shopData.shopId,
      shippingAddress: {
        name: addressData.name,
        email: addressData.email,
        mobile: addressData.mobile,
        country: addressData.country,
        address: addressData.address,
        city: addressData.city,
      },
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
      items: shopData.shopItems,
    };

    const result = await createOrder(orderPayload);

    if (result.meta.requestStatus === "fulfilled" && result.payload) {
      const orderResponse = result.payload as {
        id: string;
        orderNumber: string;
      };
      return orderResponse;
    } else {
      const errorMessage =
        (result.payload as string) || "Failed to create order";
      throw new Error(errorMessage);
    }
  };

  // Function to submit eSewa payment form
  const submitEsewaForm = (formData: {
    formUrl: string;
    fields: {
      amount: string;
      tax_amount: string;
      total_amount: string;
      transaction_uuid: string;
      product_code: string;
      product_service_charge: string;
      product_delivery_charge: string;
      success_url: string;
      failure_url: string;
      signed_field_names: string;
      signature: string;
    };
  }) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = formData.formUrl;
    form.style.display = "none";

    Object.entries(formData.fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  // Handle payment submission
  const handlePaymentSubmit = async (): Promise<void> => {
    setIsProcessing(true);

    try {
      if (!user) {
        toast.error("You must be logged in to place an order.", {
          position: "top-right",
        });
        setIsProcessing(false);
        return;
      }

      // Step 1: Always create order first
      const createdOrder = await createOrderFirst();
      const orderId = createdOrder.id;
      const orderNumber = createdOrder.orderNumber;

      // Step 2: Handle payment based on payment method
      if (paymentMethod === "COD") {
        const initialOrderData: OrderData = {
          orderId: orderId,
          orderNumber: orderNumber,
          items: shopData.shopItems,
          address: addressData,
          paymentMethod,
          paymentStatus: "COMPLETED",
          subtotal,
          deliveryFee,
          total,
          orderDate: new Date(),
        };

        setOrderData(initialOrderData);
        setActiveStep(3);
        setIsProcessing(false);

        const paymentMethodName =
          basePaymentOptions.find((p) => p.id === paymentMethod)?.name ||
          paymentMethod;
        toast.success(`Order placed successfully with ${paymentMethodName}!`, {
          position: "top-right",
        });
      } else {
        // Online payment
        const frontendBaseUrl = window.location.origin;
        const frontendRedirectUrl = `${frontendBaseUrl}/customerView`;

        const returnUrl = `http://localhost:8080/api/payments/esewa/success?frontendRedirect=${encodeURIComponent(
          frontendRedirectUrl
        )}`;
        const failureUrl = `http://localhost:8080/api/payments/esewa/failure?frontendRedirect=${encodeURIComponent(
          frontendRedirectUrl
        )}`;

        // Initiate payment
        const paymentResult = await initiatePaymentProcess({
          shopId: shopData.shopId,
          paymentMethod: paymentMethod,
          orderId: orderId,
          amountMinor: amountMinor,
          returnUrl: returnUrl,
          failureUrl: failureUrl,
        });

        if (
          paymentResult.meta.requestStatus === "fulfilled" &&
          paymentResult.payload
        ) {
          const paymentData = paymentResult.payload as any;

          // Submit the payment form
          submitEsewaForm({
            formUrl: paymentData.formUrl,
            fields: paymentData.fields,
          });
        } else {
          const errorMessage =
            (paymentResult.payload as string) || "Failed to initiate payment";
          throw new Error(errorMessage);
        }
      }
    } catch (error: any) {
      toast.error(
        error.message || "There was an error processing your order.",
        { position: "top-right" }
      );
      setIsProcessing(false);
    }
  };

  const originalTotal = shopData.shopItems.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  const savings = originalTotal - subtotal;
  const savingsPercentage =
    originalTotal > 0 ? Math.round((savings / originalTotal) * 100) : 0;

  const handleStepChange = (step: number) => {
    if (step <= activeStep) {
      setActiveStep(step);
    }
  };

  const handlePreviousClick = () => {
    if (activeStep === 1) {
      onBack();
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const validateAddressForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!addressData.name.trim() || addressData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!addressData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addressData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!addressData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(addressData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    if (!addressData.country.trim() || addressData.country.length < 2) {
      newErrors.country = "Country is required";
    }

    if (!addressData.address.trim() || addressData.address.length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }

    if (!addressData.city.trim() || addressData.city.length < 2) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddressForm()) {
      setActiveStep(2);
    }
  };

  const handleInputChange = (field: keyof AddressData, value: string) => {
    if (field === "mobile") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setAddressData((prev) => ({ ...prev, [field]: numericValue }));
    } else {
      setAddressData((prev) => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const generatePDFReceipt = () => {
    if (!orderData) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Doko - Order Receipt", 20, 20);

    // Order Info
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderData.orderId}`, 20, 40);
    doc.text(`Order Number: ${orderData.orderNumber}`, 20, 50);
    doc.text(`Date: ${orderData.orderDate.toLocaleDateString()}`, 20, 60);
    doc.text(`Payment Status: ${orderData.paymentStatus}`, 20, 70);
    doc.text(
      `Payment Method: ${
        basePaymentOptions.find((p) => p.id === orderData.paymentMethod)?.name
      }`,
      20,
      80
    );

    // Customer Info
    doc.text("Shipping Address:", 20, 100);
    doc.text(`${orderData.address.name}`, 20, 110);
    doc.text(`${orderData.address.email}`, 20, 120);
    doc.text(`${orderData.address.mobile}`, 20, 130);
    doc.text(`${orderData.address.address}`, 20, 140);
    doc.text(
      `${orderData.address.city}, ${orderData.address.country}`,
      20,
      150
    );

    // Items
    doc.text("Items:", 20, 170);
    let yPos = 180;
    orderData.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.productName}`, 20, yPos);
      doc.text(
        `Qty: ${item.quantity} x Rs. ${item.price} = Rs. ${item.totalPrice}`,
        30,
        yPos + 10
      );
      yPos += 20;
    });

    // Totals
    yPos += 10;
    doc.text(`Subtotal: Rs. ${orderData.subtotal}`, 20, yPos);
    doc.text(`Delivery Fee: Rs. ${orderData.deliveryFee}`, 20, yPos + 10);
    doc.text(`Total: Rs. ${orderData.total}`, 20, yPos + 20);

    doc.save(`receipt-${orderData.orderNumber}.pdf`);
    toast.success("Receipt downloaded successfully!", {
      position: "top-right",
    });
  };

  const handleOrderComplete = async () => {
    clearErrors();

    // Clear cart now that order is complete
    try {
      await clearAllItems().unwrap();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }

    onOrderComplete();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-100";
      case "FAILED":
        return "text-red-600 bg-red-100";
      case "INITIATED":
      case "PENDING":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Render functions
  const renderAddressStep = () => (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleAddressSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={addressData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={addressData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              value={addressData.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              placeholder="Enter 10-digit mobile number"
              className={errors.mobile ? "border-red-500" : ""}
              maxLength={10}
            />
            {errors.mobile && (
              <p className="text-sm text-red-500">{errors.mobile}</p>
            )}
            <p className="text-xs text-gray-500">Enter exactly 10 digits</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              value={addressData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              placeholder="Enter your country"
              className={errors.country ? "border-red-500" : ""}
            />
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={addressData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter your complete address"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={addressData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Enter your city"
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Options */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Choose payment mode</h3>

          {paymentMethodsLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading payment methods...</span>
            </div>
          ) : availablePaymentOptions.length > 0 ? (
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-2">
                {availablePaymentOptions.map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors",
                      paymentMethod === option.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-2xl">{option.icon}</span>
                      <div className="flex-1">
                        <Label
                          htmlFor={option.id}
                          className="cursor-pointer font-medium"
                        >
                          {option.name}
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-gray-500">
                No payment methods available for this shop.
              </p>
            </div>
          )}

          {/* Payment Details */}
          <div className="mt-6 p-6 border rounded-lg">
            <h4 className="font-semibold mb-2">
              {
                availablePaymentOptions.find((p) => p.id === paymentMethod)
                  ?.name
              }
            </h4>
            <p className="text-gray-600 mb-4">
              {
                availablePaymentOptions.find((p) => p.id === paymentMethod)
                  ?.description
              }
            </p>

            {paymentMethod !== "COD" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-blue-800 text-sm">
                  You will be redirected to{" "}
                  {paymentMethod === "ESEWA" ? "eSewa" : paymentMethod} payment
                  gateway to complete your payment.
                </p>
              </div>
            )}

            <Button
              onClick={handlePaymentSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isProcessing || orderLoading || paymentLoading}
            >
              {isProcessing || orderLoading || paymentLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {paymentMethod === "COD"
                    ? "Placing Order..."
                    : "Processing Payment..."}
                </>
              ) : paymentMethod === "COD" ? (
                "Place Order"
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Item total</span>
              <div className="text-right">
                {savings > 0 && (
                  <span className="text-gray-500 line-through text-sm">
                    NPR{originalTotal}
                  </span>
                )}
                <div>NPR{subtotal}</div>
              </div>
            </div>

            <div className="flex justify-between">
              <span>Delivery fee</span>
              <div className="text-right">
                <span className="text-gray-500 line-through text-sm">NPR0</span>
                <div className="text-green-600">FREE</div>
              </div>
            </div>

            <hr />

            <div className="flex justify-between font-semibold text-lg">
              <span>Grand total</span>
              <span>NPR{total}</span>
            </div>

            <p className="text-sm text-gray-600">Inclusive of all taxes</p>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Average delivery time: 3-5 days
              </p>
            </div>

            {savings > 0 && (
              <div className="bg-green-100 p-3 rounded-lg mt-4">
                <p className="text-green-700 text-sm">
                  You have saved total {savingsPercentage}% (NPR{savings}) on
                  your order! Yay!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => {
    if (!orderData) {
      return (
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Processing Order...
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your order.
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          {/* Success Icon and Message */}
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Order Confirmed!
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Thank you for your purchase! Your order has been successfully
                placed and is being processed.
              </p>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h3 className="text-lg font-semibold text-white text-center">
                Order Summary
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Order Number
                    </span>
                    <p className="text-lg font-semibold text-gray-900">
                      {orderData.orderNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Order Date
                    </span>
                    <p className="text-gray-900">
                      {orderData.orderDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Payment Method
                    </span>
                    <p className="text-gray-900">
                      {
                        basePaymentOptions.find(
                          (p) => p.id === orderData.paymentMethod
                        )?.name
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Total Amount
                    </span>
                    <p className="text-2xl font-bold text-gray-900">
                      NPR {orderData.total}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Payment Status
                    </span>
                    <div
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                        getStatusColor(orderData.paymentStatus)
                      )}
                    >
                      {orderData.paymentStatus}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Shipping Address
                </h4>
                <div className="text-left bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    {orderData.address.name}
                  </p>
                  <p className="text-gray-600">{orderData.address.email}</p>
                  <p className="text-gray-600">{orderData.address.mobile}</p>
                  <p className="text-gray-600">{orderData.address.address}</p>
                  <p className="text-gray-600">
                    {orderData.address.city}, {orderData.address.country}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Order Items ({orderData.items.length})
                </h4>
                <div className="space-y-3">
                  {orderData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {item.quantity}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-600">
                            NPR {item.price} each
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        NPR {item.totalPrice}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="border-t pt-6">
                <div className="space-y-2 max-w-xs ml-auto">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      NPR {orderData.subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold">
                      NPR {orderData.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              onClick={generatePDFReceipt}
              variant="outline"
              className="gap-2 bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
              size="lg"
            >
              <Download className="h-5 w-5" />
              Download Receipt
            </Button>

            <Button
              onClick={handleOrderComplete}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
              size="lg"
            >
              <Check className="h-5 w-5" />
              Continue Shopping
            </Button>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-blue-800 font-medium">What's Next?</p>
                <p className="text-blue-700 text-sm mt-1">
                  You will receive an order confirmation email shortly. For any
                  questions about your order, please contact our customer
                  support team.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handlePreviousClick}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="relative mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative z-10"
                >
                  <motion.button
                    onClick={() => handleStepChange(step.id)}
                    className={cn(
                      "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer",
                      step.id < activeStep
                        ? "bg-green-500 border-green-500 text-white"
                        : step.id === activeStep
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={step.id > activeStep}
                  >
                    {step.id < activeStep ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      step.icon
                    )}
                  </motion.button>

                  <div className="mt-3 text-center">
                    <div
                      className={cn(
                        "text-sm font-medium transition-colors duration-300",
                        step.id <= activeStep
                          ? "text-gray-900"
                          : "text-gray-400"
                      )}
                    >
                      {step.label}
                    </div>
                    {step.description && (
                      <div
                        className={cn(
                          "text-xs mt-1 transition-colors duration-300",
                          step.id <= activeStep
                            ? "text-gray-600"
                            : "text-gray-400"
                        )}
                      >
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Step Content */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
          >
            {activeStep === 1 && renderAddressStep()}
            {activeStep === 2 && renderPaymentStep()}
            {activeStep === 3 && renderConfirmationStep()}
          </motion.div>

          {/* Navigation Buttons */}
          {activeStep < 3 && (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousClick}
                className="px-6 bg-transparent"
              >
                {activeStep === 1 ? "Back to Cart" : "Previous"}
              </Button>

              <div className="flex items-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors duration-300",
                      index + 1 <= activeStep ? "bg-blue-500" : "bg-gray-300"
                    )}
                  />
                ))}
              </div>

              {activeStep === 1 && (
                <Button onClick={handleAddressSubmit} className="px-6">
                  Continue to Payment
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
