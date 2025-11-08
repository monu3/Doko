"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: number;
  title: string;
  description?: string;
}

interface ProgressBarProps {
  steps?: ProgressStep[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

const defaultSteps: ProgressStep[] = [
  { id: 1, title: "Cart", description: "Review items" },
  { id: 2, title: "Address", description: "Shipping details" },
  { id: 3, title: "Payment", description: "Payment method" },
  { id: 4, title: "Confirmation", description: "Order complete" },
];

function ProgressBar({
  steps = defaultSteps,
  currentStep = 1,
  onStepChange,
  className,
}: ProgressBarProps) {
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
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Progress Bar */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-border"></div>
        
        {/* Progress Line */}
        <motion.div
          className="absolute top-6 left-0 h-0.5 bg-primary"
          initial={{ width: "0%" }}
          animate={{
            width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = step.id < activeStep;
            const isActive = step.id === activeStep;
            const isClickable = step.id <= activeStep;

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step Circle */}
                <motion.button
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200",
                    "disabled:cursor-not-allowed",
                    {
                      "bg-primary border-primary text-primary-foreground": isCompleted || isActive,
                      "bg-background border-border text-muted-foreground": !isCompleted && !isActive,
                      "hover:border-primary/50": isClickable && !isCompleted && !isActive,
                    }
                  )}
                  whileHover={isClickable ? { scale: 1.05 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </motion.button>

                {/* Step Content */}
                <div className="mt-3 text-center">
                  <h3
                    className={cn(
                      "text-sm font-medium transition-colors",
                      {
                        "text-foreground": isActive || isCompleted,
                        "text-muted-foreground": !isActive && !isCompleted,
                      }
                    )}
                  >
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={activeStep === 1}
          className="w-24"
        >
          Previous
        </Button>
        
        <div className="text-sm text-muted-foreground self-center">
          Step {activeStep} of {steps.length}
        </div>
        
        <Button
          onClick={nextStep}
          disabled={activeStep === steps.length}
          className="w-24"
        >
          {activeStep === steps.length ? "Complete" : "Next"}
        </Button>
      </div>

      {/* Current Step Content */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 p-6 rounded-lg border bg-card"
      >
        <h2 className="text-lg font-semibold mb-2">
          {steps.find(step => step.id === activeStep)?.title}
        </h2>
        <p className="text-muted-foreground">
          {activeStep === 1 && "Review your cart items and quantities before proceeding."}
          {activeStep === 2 && "Enter your shipping address and delivery preferences."}
          {activeStep === 3 && "Choose your payment method and enter payment details."}
          {activeStep === 4 && "Review and confirm your order details."}
        </p>
      </motion.div>
    </div>
  );
}

export default function ProgressBarDemo() {
  return (
    <div className="p-8">
      <ProgressBar />
    </div>
  );
}
