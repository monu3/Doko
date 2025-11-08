import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShoppingCart, MapPin, CreditCard, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProgressStep {
  id: number;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface CheckoutProgressBarProps {
  steps?: ProgressStep[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

const defaultSteps: ProgressStep[] = [
  {
    id: 1,
    label: "Cart",
    icon: <ShoppingCart className="w-4 h-4" />,
    description: "Review your items",
  },
  {
    id: 2,
    label: "Address",
    icon: <MapPin className="w-4 h-4" />,
    description: "Shipping information",
  },
  {
    id: 3,
    label: "Payment",
    icon: <CreditCard className="w-4 h-4" />,
    description: "Payment details",
  },
  {
    id: 4,
    label: "Confirmation",
    icon: <BadgeCheck className="w-4 h-4" />,
    description: "Confirmation details",
  },
];

function CheckoutProgressBar({
  steps = defaultSteps,
  currentStep = 1,
  onStepChange,
  className,
}: CheckoutProgressBarProps) {
  const [activeStep, setActiveStep] = useState(currentStep);

  const handleStepClick = (stepId: number) => {
    if (stepId <= activeStep) {
      setActiveStep(stepId);
      onStepChange?.(stepId);
    }
  };

  const nextStep = () => {
    if (activeStep < steps.length) {
      const newStep = activeStep + 1;
      setActiveStep(newStep);
      onStepChange?.(newStep);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      const newStep = activeStep - 1;
      setActiveStep(newStep);
      onStepChange?.(newStep);
    }
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto p-6", className)}>
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
            >
              {/* Step Circle */}
              <motion.button
                onClick={() => handleStepClick(step.id)}
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
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  step.icon
                )}
              </motion.button>

              {/* Step Label */}
              <div className="mt-3 text-center">
                <div
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    step.id <= activeStep ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div
                    className={cn(
                      "text-xs mt-1 transition-colors duration-300",
                      step.id <= activeStep ? "text-gray-600" : "text-gray-400"
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
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            {steps.find((s) => s.id === activeStep)?.label}
          </h2>
          <p className="text-gray-600 mb-8">
            {steps.find((s) => s.id === activeStep)?.description}
          </p>

          {/* Mock content based on step */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span>Product 1</span>
                <span className="font-medium">$29.99</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span>Product 2</span>
                <span className="font-medium">$19.99</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>$49.98</span>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ZIP Code
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Card Number
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expiry Date
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={activeStep === 1}
          className="px-6"
        >
          Previous
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

        <Button
          onClick={nextStep}
          disabled={activeStep === steps.length}
          className="px-6"
        >
          {activeStep === steps.length ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutProgressBarDemo() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <CheckoutProgressBar
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />
    </div>
  );
}
