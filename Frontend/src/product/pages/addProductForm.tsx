"use client";

import { useEffect, useState } from "react";
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get the product state to check status
  const { status, error } = useAppSelector((state: RootState) => state.product);

  // In AddProductPage.tsx - Use the same simple navigation pattern
  useEffect(() => {
    if (status === "succeeded" && isSubmitting) {
      toast.success("Product created successfully");
      setIsSubmitting(false);
      dispatch(resetOperationStatus());
      navigate("/products");
    }

    if (status === "failed" && isSubmitting) {
      toast.error(error || "Failed to create product");
      setIsSubmitting(false);
    }
  }, [status, error, isSubmitting, navigate, dispatch]);

  const updateFormData = (newData: Partial<Product>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // src/product/pages/AddProductPage.tsx (updated handleSubmit)
  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.stock || !formData.price) {
      toast.error("Please fill in all required fields");
      setCurrentSection("product-information");
      return;
    }

    // Validate that at least one image is uploaded
    if (!formData.images || formData.images.length === 0) {
      toast.error("Please upload at least one product image");
      setCurrentSection("product-media");
      return;
    }

    // Validate variants if enabled
    if (formData.hasVariants && formData.variantData) {
      try {
        const variantData = JSON.parse(formData.variantData);
        const validation = validateVariantData(variantData);
        if (!validation.isValid) {
          toast.error("Please fix variant errors before submitting");
          setCurrentSection("variants");
          return;
        }
      } catch (error) {
        toast.error("Invalid variant data format");
        setCurrentSection("variants");
        return;
      }
    }
    try {
      setIsSubmitting(true);

      // Dispatch the createProduct action
      await dispatch(createProduct(formData as Omit<Product, "id" | "shopId">));
    } catch (error: any) {
      toast.error(
        "Failed to create product: " + (error.message || "Unknown error")
      );
      setIsSubmitting(false);
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

  // Reset submitting state when component unmounts or when navigation occurs
  useEffect(() => {
    return () => {
      setIsSubmitting(false);
    };
  }, []);

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* <Button variant="ghost" size="icon"> */}
            <Button variant="ghost" size="icon" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <h1 className="font-semibold">Add new product</h1>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          {/* <Button>Add product</Button> */}
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
              <Variants data={formData} onValueChange={updateFormData} />
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
