import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";

interface SignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SignupDialog({
  open,
  onOpenChange,
}: SignupDialogProps) {
  const {
    signupStatus,
    signupLoading,
    signupError,
    currentEmail,
    user,
    isAuthenticated,
    resetSignup,
    clearErrors,
    signupInitiate,
    signupVerify,
    resendOtpCode,
  } = useCustomer();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      resetSignup();
      setEmail("");
      setOtp("");
      setEmailError("");
      setOtpError("");
    }
  }, [open, resetSignup]);

  // Auto-close dialog when signup is completed and user is authenticated
  useEffect(() => {
    if (signupStatus === "completed" && isAuthenticated && user) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [signupStatus, isAuthenticated, user, onOpenChange]);

  // Clear errors when user starts typing
  useEffect(() => {
    if (signupError) {
      const timer = setTimeout(() => {
        clearErrors();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [signupError, clearErrors]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateOtp = (otp: string): boolean => {
    return /^\d{6}$/.test(otp);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      await signupInitiate({ email: email.trim() }).unwrap();
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    if (!otp.trim()) {
      setOtpError("OTP is required");
      return;
    }

    if (!validateOtp(otp)) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await signupVerify({
        email: currentEmail || email,
        otp: otp.trim(),
        role: "USER",
      }).unwrap();

      // The dialog will auto-close via useEffect when signupStatus becomes "completed"
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleResendOtp = async () => {
    if (currentEmail) {
      try {
        const result = await resendOtpCode({ email: currentEmail }).unwrap();
        console.log("OTP resend successful:", result);
      } catch (error) {
        console.error("OTP resend failed:", error);
        // Error is handled by the slice
      }
    }
  };

  const handleOtpChange = (value: string) => {
    // Only allow numeric input and limit to 6 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setOtp(numericValue);
    if (otpError) setOtpError("");
    if (signupError) clearErrors();
  };

  const handleBackToEmail = () => {
    resetSignup();
    setOtp("");
    setOtpError("");
  };

  const getUserAvatar = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-blue-600">Doko</h1>
        </div>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
              if (signupError) clearErrors();
            }}
            className={emailError ? "border-red-500 focus:border-red-500" : ""}
            disabled={signupLoading}
          />
          {emailError && <p className="text-sm text-red-600">{emailError}</p>}
        </div>

        {signupError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{signupError}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={signupLoading}>
          {signupLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending OTP...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 mt-2">
          We've sent a 6-digit code to{" "}
          <span className="font-medium">{currentEmail}</span>
        </p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => handleOtpChange(e.target.value)}
            className={`text-center text-lg tracking-widest ${
              otpError ? "border-red-500 focus:border-red-500" : ""
            }`}
            maxLength={6}
            disabled={signupLoading}
          />
          {otpError && <p className="text-sm text-red-600">{otpError}</p>}
        </div>

        {signupError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{signupError}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={signupLoading || otp.length !== 6}
        >
          {signupLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify & Continue"
          )}
        </Button>

        <div className="flex flex-col space-y-2 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={signupLoading}
              className="text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50"
            >
              Resend OTP
            </button>
          </p>

          <button
            type="button"
            onClick={handleBackToEmail}
            disabled={signupLoading}
            className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            ← Change Email Address
          </button>
        </div>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome to Doko!
        </h2>
      </div>

      <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 rounded-lg">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-blue-600 text-white font-medium">
            {getUserAvatar(user?.email || currentEmail || email)}
          </AvatarFallback>
        </Avatar>
        <div className="text-left">
          <p className="font-medium text-gray-900">
            {user?.email || currentEmail || email}
          </p>
          <p className="text-sm text-gray-600">Customer Account</p>
        </div>
      </div>
    </div>
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {signupStatus === "idle"
              ? "Sign Up"
              : signupStatus === "email_sent"
              ? "Verify Email"
              : "Welcome"}
          </DialogTitle>
        </DialogHeader>

        {signupStatus === "idle" && renderEmailStep()}
        {signupStatus === "email_sent" && renderOtpStep()}
        {signupStatus === "completed" && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
}
