"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "../components/addProduct/quickNavigation";
import { ProductInformation } from "../components/addProduct/productInformation";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductMedia } from "../components/addProduct/productMedia";
import { Inventory } from "../components/addProduct/inventory";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { createProduct, resetOperationStatus } from "../slice/productSlice";
import { Product, validateVariantData } from "../types/product";
import { Variants } from "../components/addProduct/variants";
import { RootState } from "@/store";

const sidebarNavItems = [
  {
    title: "Product Information",
    href: "product-information",
  },
  {
    title: "Product Media",
    href: "product-media",
  },
  {
    title: "Inventory",
    href: "inventory",
  },
  {
    title: "Variants",
    href: "variants",
  },
];

export default function AddProductPage() {
  const [currentSection, setCurrentSection] = useState("product-information");
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get the product state to check status
  const { status, error } = useAppSelector((state: RootState) => state.product);

  // Fixed useEffect with better state management
  useEffect(() => {
    if (status === "succeeded" && isSubmitting) {
      // Show success toast
      toast.success("Product created successfully", { autoClose: 2000 });

      // Reset states first
      setIsSubmitting(false);
      dispatch(resetOperationStatus());

      // Set flag to navigate
      setShouldNavigate(true);
    }

    if (status === "failed" && isSubmitting) {
      setIsSubmitting(false);
      toast.error(error || "Failed to create product", { autoClose: 2000 });
      dispatch(resetOperationStatus());
    }
  }, [status, error, isSubmitting, shouldNavigate, dispatch]);

  // Separate useEffect for navigation to avoid interference
  useEffect(() => {
    if (shouldNavigate) {
      setShouldNavigate(false);
      navigate("/products");
    }
  }, [shouldNavigate, navigate]);

  // Use useCallback to prevent unnecessary re-renders of child components
  const updateFormData = useCallback((newData: Partial<Product>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  // Fixed handleSubmit function with better state management
  const handleSubmit = async () => {
    // Reset navigation flag
    setShouldNavigate(false);

    // Basic validation
    if (!formData.name || !formData.stock || !formData.price) {
      toast.error("Please fill in all required fields", { autoClose: 2000 });
      setCurrentSection("product-information");
      return;
    }

    // Validate that at least one image is uploaded
    if (!formData.images || formData.images.length === 0) {
      toast.error("Please upload at least one product image", {
        autoClose: 2000,
      });
      setCurrentSection("product-media");
      return;
    }

    // Validate variants if enabled
    if (formData.hasVariants && formData.variantData) {
      try {
        const variantData = JSON.parse(formData.variantData);
        const validation = validateVariantData(variantData);
        if (!validation.isValid) {
          toast.error("Please fix variant errors before submitting", {
            autoClose: 2000,
          });
          setCurrentSection("variants");
          return;
        }
      } catch (error) {
        toast.error("Invalid variant data format", { autoClose: 2000 });
        setCurrentSection("variants");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // Create a stable form data object to prevent reference changes
      const submissionData = { ...formData };

      // Dispatch the createProduct action
      await dispatch(
        createProduct(submissionData as Omit<Product, "id" | "shopId">)
      );
    } catch (error: any) {
      setIsSubmitting(false);
      setShouldNavigate(false);
      toast.error(
        "Failed to create product: " + (error.message || "Unknown error"),
        { autoClose: 2000 }
      );
    }
  };

  const handleBackClick = () => {
    // Check if there are unsaved changes
    if (Object.keys(formData).length > 0) {
      setShowAlertDialog(true);
    } else {
      navigate("/products");
    }
  };

  // Reset states when component unmounts
  useEffect(() => {
    return () => {
      setIsSubmitting(false);
      setShouldNavigate(false);
      dispatch(resetOperationStatus());
    };
  }, [dispatch]);

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <h1 className="font-semibold">Add new product</h1>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding product..." : "Add product"}
          </Button>
        </div>
      </header>

      <div className="container flex gap-8 py-6">
        <aside className="w-[240px] sticky top-[73px] self-start bg-white rounded p-2">
          <SidebarNav
            items={sidebarNavItems}
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
          />
        </aside>
        <main className="flex-1 bg-white rounded p-3">
          <div className="space-y-6">
            {currentSection === "product-information" && (
              <ProductInformation
                data={formData}
                onValueChange={updateFormData}
              />
            )}
            {currentSection === "product-media" && (
              <ProductMedia data={formData} onValueChange={updateFormData} />
            )}
            {currentSection === "inventory" && (
              <Inventory data={formData} onValueChange={updateFormData} />
            )}
            {currentSection === "variants" && (
              <Variants
                data={formData}
                onValueChange={updateFormData}
                key="variants-form" // Add key to force clean re-render
              />
            )}
          </div>
        </main>
      </div>
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes!</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to leave and discard these
              changes, or stay on this page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlertDialog(false)}>
              Stay on Page
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/products")}>
              Leave Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
