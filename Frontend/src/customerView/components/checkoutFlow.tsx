"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  MapPin,
  CreditCard,
  BadgeCheck,
  ArrowLeft,
  Download,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const { user } = useCustomerAuth();
  const {
    createOrder,
    clearErrors,
    orderLoading,
    initiatePayment,
    paymentLoading,
  } = useCart();

  const { paymentMethods, loading: paymentMethodsLoading } =
    useShopPaymentMethods(shopData.shopId);

  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [setPaymentRedirectData] = useState<any>(null);

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

  // Create order first (for both COD and online payments)
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
      return result.payload as { id: string; orderNumber: string };
    } else {
      const errorMessage =
        (result.payload as string) || "Failed to create order";
      throw new Error(errorMessage);
    }
  };

  // Initiate payment for online payment methods
  const initiateOnlinePayment = async (orderId: string): Promise<any> => {
    const paymentMethodLower = paymentMethod.toLowerCase();

    const paymentData = {
      shopId: shopData.shopId,
      paymentMethod: paymentMethod,
      orderId: orderId,
      amountMinor: amountMinor,
      returnUrl: `http://localhost:8080/api/payments/${paymentMethodLower}/success`,
      failureUrl: `http://localhost:8080/api/payments/${paymentMethodLower}/failure`,
    };

    console.log("Initiating payment with data:", paymentData);

    const paymentResult = await initiatePayment(paymentData);

    if (
      paymentResult.meta.requestStatus === "fulfilled" &&
      paymentResult.payload
    ) {
      return paymentResult.payload;
    } else {
      const errorMessage =
        (paymentResult.payload as string) || "Failed to initiate payment";
      throw new Error(errorMessage);
    }
  };

  // Redirect to payment gateway in same window
  const redirectToPaymentInSameWindow = (paymentData: any) => {
    console.log("Redirecting to payment in same window:", paymentData);

    if (!paymentData?.formUrl || !paymentData?.fields) {
      toast({
        title: "Payment Error",
        description:
          "Unable to redirect to payment gateway. Missing required data.",
        variant: "destructive",
      });
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = paymentData.formUrl;
    form.target = "_self"; // This makes it open in same window

    // Add all form fields
    Object.entries(paymentData.fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value as string;
      form.appendChild(input);
    });

    // Add the form to the page and submit it
    document.body.appendChild(form);

    // Show loading message
    toast({
      title: "Redirecting to Payment Gateway",
      description:
        "Please wait while we redirect you to the secure payment page...",
    });

    // Submit the form
    form.submit();
  };

  // Handle payment submission
  const handlePaymentSubmit = async (): Promise<void> => {
    setIsProcessing(true);

    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to place an order.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Step 1: Always create order first
      console.log("Creating order...");
      const createdOrder = await createOrderFirst();
      const orderId = createdOrder.id;
      const orderNumber = createdOrder.orderNumber;

      console.log("Order created successfully:", orderId);

      // Set initial order data for confirmation page
      const initialOrderData: OrderData = {
        orderId: orderId,
        orderNumber: orderNumber,
        items: shopData.shopItems,
        address: addressData,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "COMPLETED" : "INITIATED",
        subtotal,
        deliveryFee,
        total,
        orderDate: new Date(),
      };

      // Step 2: Handle based on payment method
      if (paymentMethod === "COD") {
        // For COD, set order data and move to confirmation step
        console.log("COD payment - setting order data:", initialOrderData);
        setOrderData(initialOrderData);
        setIsProcessing(false); // Stop processing before state change

        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          console.log("Moving to confirmation step (step 3)");
          setActiveStep(3);
          toast({
            title: "Order Placed Successfully!",
            description: `Your order ${orderNumber} has been placed successfully.`,
          });
        }, 100);
      } else {
        // For online payments, store order data before redirecting
        setOrderData(initialOrderData);

        // Store order data in sessionStorage before redirect (so we can retrieve it on return)
        sessionStorage.setItem(
          "pendingOrder",
          JSON.stringify(initialOrderData)
        );

        console.log("Initiating online payment for order:", orderId);
        const paymentResponse = await initiateOnlinePayment(orderId);

        if (paymentResponse) {
          setPaymentRedirectData(paymentResponse);
          // Don't set isProcessing to false - we're redirecting
          // Redirect immediately in same window
          redirectToPaymentInSameWindow(paymentResponse);
        } else {
          setIsProcessing(false);
          toast({
            title: "Payment Error",
            description: "Failed to initiate payment. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Order/payment process error:", error);
      toast({
        title: "Process Failed",
        description:
          error.message || "There was an error processing your order.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  // Rest of your existing functions (validateAddressForm, handleInputChange, etc.)
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
  };

  const handleOrderComplete = () => {
    clearErrors();
    onOrderComplete();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Check className="h-6 w-6 text-green-600" />;
      case "FAILED":
        return <X className="h-6 w-6 text-red-600" />;
      case "INITIATED":
      case "PENDING":
        return <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-600" />;
    }
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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Your order has been confirmed! You will receive a confirmation email shortly.";
      case "FAILED":
        return "There was an issue with your payment. The shop owner will contact you for alternative arrangements.";
      case "INITIATED":
        return paymentMethod === "COD"
          ? "Order has been placed successfully with Cash on Delivery."
          : "Your payment is being processed. You will receive an email confirmation once completed.";
      case "PENDING":
        return "Payment is being processed. Please check your email for updates.";
      default:
        return "Order processing in progress.";
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
                  You will be redirected to the payment gateway in this window
                  to complete your payment securely.
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
                    : "Redirecting to Payment..."}
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

  const renderConfirmationStep = () => (
    <div className="text-center space-y-6">
      {/* Status Icon */}
      <div
        className={cn(
          "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4",
          orderData?.paymentStatus === "COMPLETED"
            ? "bg-green-100"
            : orderData?.paymentStatus === "FAILED"
            ? "bg-red-100"
            : "bg-blue-100"
        )}
      >
        {orderData && getStatusIcon(orderData.paymentStatus)}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {orderData?.paymentStatus === "COMPLETED"
            ? "Order Confirmed!"
            : orderData?.paymentStatus === "FAILED"
            ? "Payment Failed"
            : "Order Received!"}
        </h2>
        <p className="text-gray-600 mb-4">
          {orderData ? getStatusMessage(orderData.paymentStatus) : ""}
        </p>

        {/* Status Badge */}
        {orderData && (
          <div
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
              getStatusColor(orderData.paymentStatus)
            )}
          >
            {orderData.paymentStatus}
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Order Number:</span>
            <span className="font-medium">{orderData?.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-medium text-xs">{orderData?.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span>Items:</span>
            <span>{orderData?.items.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span className="font-medium">NPR {orderData?.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span>
              {
                basePaymentOptions.find(
                  (p) => p.id === orderData?.paymentMethod
                )?.name
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span>Payment Status:</span>
            <span
              className={cn(
                "font-medium",
                orderData?.paymentStatus === "COMPLETED"
                  ? "text-green-600"
                  : orderData?.paymentStatus === "FAILED"
                  ? "text-red-600"
                  : "text-blue-600"
              )}
            >
              {orderData?.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Additional info for failed payments */}
      {orderData?.paymentStatus === "FAILED" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <div className="text-left">
              <p className="text-yellow-800 text-sm font-medium">
                What's Next?
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                The shop owner will contact you shortly to discuss alternative
                payment options or order cancellation.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={generatePDFReceipt}
          variant="outline"
          className="gap-2 bg-transparent"
        >
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>

        <div>
          <Button
            onClick={handleOrderComplete}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );

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
