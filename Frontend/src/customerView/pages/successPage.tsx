// src/app/payment/success/page.tsx
"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  useEffect(() => {
    // You can fetch payment status here if needed
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully. Your order is being
          confirmed.
        </p>
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
          <Link to="/orders">View Orders</Link>
        </Button>
      </div>
    </div>
  );
}
