"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "../components/addProduct/quickNavigation";
import { ProductInformation } from "../components/addProduct/productInformation";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchProductById,
  resetOperationStatus,
  updateProduct,
} from "@/product/slice/productSlice";
import { Product } from "../types/product";
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
import { Variants } from "../components/addProduct/variants";
import { useAppDispatch, useAppSelector } from "@/hooks";
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

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { product, status, error } = useAppSelector(
    (state: RootState) => state.product
  );
  const [currentSection, setCurrentSection] = useState("product-information");
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(resetOperationStatus());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  // SIMPLE AND RELIABLE NAVIGATION HANDLER
  useEffect(() => {
    if (status === "succeeded" && isSubmitting) {
      // Show success message
      toast.success("Product updated successfully");

      // Reset states
      setIsSubmitting(false);
      dispatch(resetOperationStatus());

      // Navigate immediately
      navigate("/products");
    }

    if (status === "failed" && isSubmitting) {
      toast.error(error || "Failed to update product");
      setIsSubmitting(false);
    }
  }, [status, error, isSubmitting, navigate, dispatch]);

  // Debounced form data update
  const updateFormData = useCallback((newData: Partial<Product>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  const handleSubmit = async () => {
    if (!id) {
      toast.error("Product ID is missing");
      return;
    }

    // Basic validation
    if (
      !formData.name?.trim() ||
      formData.stock == null ||
      formData.price == null
    ) {
      toast.error("Please fill in all required fields");
      setCurrentSection("product-information");
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      toast.error("Please upload at least one product image");
      setCurrentSection("product-media");
      return;
    }

    try {
      setIsSubmitting(true);

      // Dispatch update
      await dispatch(updateProduct({ id, productData: formData })).unwrap();

      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      toast.error(error || "Failed to update product");
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    if (JSON.stringify(formData) !== JSON.stringify(product)) {
      setShowAlertDialog(true);
    } else {
      navigate("/products");
    }
  };

  // Reset submitting state when component unmounts
  useEffect(() => {
    return () => {
      setIsSubmitting(false);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-semibold">Edit product</h1>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating product..." : "Update product"}
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
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
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
