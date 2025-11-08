import api from "@/api";
import { useEffect, useState } from "react";

// src/hooks/useShopPaymentMethods.ts
export const useShopPaymentMethods = (shopId: string) => {
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!shopId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/shops/${shopId}/payment-methods`);
        console.log("Payment methods API response:", response.data);

        const data = response.data as {
          status: string;
          paymentMethods?: string[];
          message?: string;
        };

        if (data.status === "success" && data.paymentMethods) {
          console.log("Payment methods:", data.paymentMethods);
          setPaymentMethods(data.paymentMethods);
        } else {
          setError(data.message || "Failed to fetch payment methods");
        }
      } catch (error: any) {
        console.error("Error fetching payment methods:", error);
        setError(
          error.response?.data?.message || "Failed to fetch payment methods"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [shopId]);

  return { paymentMethods, loading, error };
};
