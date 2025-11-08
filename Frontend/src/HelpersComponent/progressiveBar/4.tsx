import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ShoppingCart, MapPin, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  icon: React.ReactNode
}

interface ProgressBarProps {
  steps?: Step[]
  currentStep?: number
  onStepChange?: (step: number) => void
}

const defaultSteps: Step[] = [
  { id: 1, title: 'Cart', icon: <ShoppingCart size={16} /> },
  { id: 2, title: 'Address', icon: <MapPin size={16} /> },
  { id: 3, title: 'Payment', icon: <CreditCard size={16} /> }
]

const ProgressBar = ({ 
  steps = defaultSteps, 
  currentStep = 1, 
  onStepChange 
}: ProgressBarProps) => {
  const [activeStep, setActiveStep] = useState(currentStep)

  const handleStepClick = (stepId: number) => {
    if (stepId <= activeStep) {
      setActiveStep(stepId)
      onStepChange?.(stepId)
    }
  }

  const handleNext = () => {
    if (activeStep < steps.length) {
      const newStep = activeStep + 1
      setActiveStep(newStep)
      onStepChange?.(newStep)
    }
  }

  const handlePrevious = () => {
    if (activeStep > 1) {
      const newStep = activeStep - 1
      setActiveStep(newStep)
      onStepChange?.(newStep)
    }
  }

  const progressPercentage = ((activeStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="relative mb-8">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border transform -translate-y-1/2" />
        
        {/* Progress Line */}
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-primary transform -translate-y-1/2"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.6
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = step.id < activeStep
            const isActive = step.id === activeStep
            const isClickable = step.id <= activeStep

            return (
              <motion.div
                key={step.id}
                className={cn(
                  "flex flex-col items-center cursor-pointer group",
                  !isClickable && "cursor-not-allowed"
                )}
                onClick={() => handleStepClick(step.id)}
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                {/* Step Circle */}
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center relative z-10 bg-background",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isActive && "border-primary text-primary bg-background",
                    !isCompleted && !isActive && "border-border text-muted-foreground"
                  )}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted ? "hsl(var(--primary))" : "hsl(var(--background))"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                        delay: 0.1
                      }}
                    >
                      <Check size={16} className="text-primary-foreground" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15
                      }}
                    >
                      {step.icon}
                    </motion.div>
                  )}
                </motion.div>

                {/* Step Label */}
                <motion.span
                  className={cn(
                    "mt-2 text-sm font-medium transition-colors",
                    isActive && "text-primary",
                    isCompleted && "text-primary",
                    !isCompleted && !isActive && "text-muted-foreground"
                  )}
                  animate={{
                    color: isActive || isCompleted ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
                  }}
                >
                  {step.title}
                </motion.span>

                {/* Step Number */}
                <span className="text-xs text-muted-foreground mt-1">
                  Step {step.id}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <motion.button
          onClick={handlePrevious}
          disabled={activeStep === 1}
          className={cn(
            "px-6 py-2 rounded-lg font-medium transition-colors",
            "border border-border bg-background text-foreground",
            "hover:bg-accent hover:text-accent-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          whileHover={activeStep > 1 ? { scale: 1.02 } : {}}
          whileTap={activeStep > 1 ? { scale: 0.98 } : {}}
        >
          Previous
        </motion.button>

        <div className="text-sm text-muted-foreground">
          {activeStep} of {steps.length}
        </div>

        <motion.button
          onClick={handleNext}
          disabled={activeStep === steps.length}
          className={cn(
            "px-6 py-2 rounded-lg font-medium transition-colors",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          whileHover={activeStep < steps.length ? { scale: 1.02 } : {}}
          whileTap={activeStep < steps.length ? { scale: 0.98 } : {}}
        >
          {activeStep === steps.length ? 'Complete' : 'Next'}
        </motion.button>
      </div>
    </div>
  )
}

export default ProgressBar
