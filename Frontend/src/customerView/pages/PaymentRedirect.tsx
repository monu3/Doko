// src/components/PaymentRedirect.tsx
"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface PaymentRedirectProps {
  htmlContent: string;
  onSuccess: (paymentReference: string) => void;
  onFailure: () => void;
}

export default function PaymentRedirect({
  htmlContent,
  onSuccess,
  onFailure,
}: PaymentRedirectProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (htmlContent) {
      console.log("Processing payment redirect...");

      // Create a new window for payment
      const paymentWindow = window.open("", "_blank", "width=800,height=600");

      if (!paymentWindow) {
        console.error("Failed to open payment window - popup may be blocked");
        toast({
          title: "Pop-up Blocked",
          description:
            "Please allow pop-ups for this site to complete payment.",
          variant: "destructive",
        });
        onFailure();
        return;
      }

      // Write the HTML to the new window
      paymentWindow.document.write(htmlContent);
      paymentWindow.document.close();

      console.log("Payment window opened with payment form");

      // Listen for messages from the payment window
      const handleMessage = (event: MessageEvent) => {
        // In a real implementation, you would verify the origin
        if (event.data && event.data.type === "PAYMENT_SUCCESS") {
          console.log("Payment success message received:", event.data);
          onSuccess(event.data.paymentReference);
        } else if (event.data && event.data.type === "PAYMENT_FAILURE") {
          console.log("Payment failure message received");
          onFailure();
        }
      };

      window.addEventListener("message", handleMessage);

      // Check if the window was closed (payment completed)
      const checkInterval = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkInterval);
          console.log("Payment window closed");
          // In a real scenario, you should verify payment status with your backend
          // For now, we'll assume success if window closes
          // onSuccess('manual-close-' + Date.now());
        }
      }, 1000);

      // Cleanup
      return () => {
        clearInterval(checkInterval);
        window.removeEventListener("message", handleMessage);
      };
    }
  }, [htmlContent, onSuccess, onFailure, toast]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Redirecting to Payment</h2>
        <p className="text-gray-600 mb-4">
          Please complete your payment in the new window that opened.
        </p>
        <div className="text-sm text-gray-500">
          <p>If a new window didn't open, check your pop-up blocker.</p>
        </div>
      </div>
    </div>
  );
}
