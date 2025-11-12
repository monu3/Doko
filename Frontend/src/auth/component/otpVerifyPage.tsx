import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { verifyOtp } from "@/auth/slice/authSlice";
import { toast } from "react-toastify";

export function OTPPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(120);
  const [otpError, setOtpError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const email = location.state?.email;

  // Retrieve auth state from Redux
  const { token, ownerId, status } = useAppSelector((state) => state.auth);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Handle successful verification
  useEffect(() => {
    if (status === "succeeded" && token && ownerId) {
      navigate("/shop-details", {
        state: { email }, // Pass email if needed
      });
    }
  }, [token, ownerId, status, navigate, email]);

  const handleVerifyOTP = async (otp: string) => {
    if (!email) {
      toast.error("Email is missing");
      return;
    }

    if (otp.length !== 6) {
      setOtpError("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    setOtpError(null);

    try {
      await dispatch(verifyOtp({ email, otp })).unwrap();
      toast.success("OTP verified successfully!", { autoClose: 2000 });
    } catch (error) {
      setOtpError(typeof error === "string" ? error : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email is missing");
      return;
    }

    setResendLoading(true);
    try {
      await api.post("/auth/resend-otp", { email });
      setCooldown(120);
    } catch (error: any) {
      toast.error("Resend failed:", error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="overflow-hidden max-w-md w-full">
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const otpInputs = Array.from(
                document.querySelectorAll<HTMLInputElement>("[data-otp-slot]")
              );
              const otp = otpInputs.map((input) => input.value).join("");
              handleVerifyOTP(otp);
            }}
            className="flex flex-col gap-6"
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold">Verify Your OTP</h1>
              <p className="text-muted-foreground">
                Enter the 6-digit OTP sent to {email}
              </p>
              {otpError && (
                <p className="text-red-500 text-sm mt-2">{otpError}</p>
              )}
            </div>

            <div className="flex gap-2 justify-center">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  data-otp-slot
                  className="w-10 h-10 text-center border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => {
                    // Auto-focus next input
                    if (e.target.value && index < 5) {
                      const nextInput =
                        document.querySelector<HTMLInputElement>(
                          `[data-otp-slot]:nth-child(${index + 2})`
                        );
                      nextInput?.focus();
                    }
                  }}
                />
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOTP}
                disabled={resendLoading || cooldown > 0}
              >
                {resendLoading
                  ? "Sending..."
                  : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend OTP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
