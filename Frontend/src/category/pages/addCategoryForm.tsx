"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "../components/addCategory/quickNavigation";
import { CategoryInformation } from "../components/addCategory/categoryInformation";
import { CategoryBanner } from "../components/addCategory/categoryBanner";
import { CategoryContent } from "../components/addCategory/categoryContent";
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
import { Category } from "../types/category";
import { useCategory } from "@/hooks/useCategory";

const sidebarNavItems = [
  {
    title: "Information",
    href: "information",
  },
  {
    title: "Banner",
    href: "banner",
  },
  {
    title: "Content",
    href: "content",
  },
];

export default function AddCategoryPage() {
  const [currentSection, setCurrentSection] = useState("information");
  const [formData, setFormData] = useState<Partial<Category>>({
    deleted: false,
    active: true, // Default to active
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();
  const { addCategory, status } = useCategory();

  // Track unsaved changes
  useEffect(() => {
    const initialData = { deleted: false, active: true };
    setHasUnsavedChanges(
      Object.keys(formData).length > 2 ||
        JSON.stringify(formData) !== JSON.stringify(initialData)
    );
  }, [formData]);

  const updateFormData = useCallback((newData: Partial<Category>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.name?.trim()) {
      toast.error("Please fill in all required fields", { autoClose: 2000 });
      setCurrentSection("information");
      return;
    }

    try {
      setIsSubmitting(true);

      await addCategory(formData as Omit<Category, "id" | "shopId">).unwrap();

      toast.success("Category created successfully", { autoClose: 2000 });
      navigate("/products/categories");
    } catch (error: any) {
      console.error("Category creation error:", error);
      toast.error(error.message || "Failed to create category", {
        autoClose: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, addCategory, navigate]);

  const handleBackClick = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowAlertDialog(true);
    } else {
      navigate("/products/categories");
    }
  }, [hasUnsavedChanges, navigate]);

  // Show loading state if needed
  if (status === "loading") {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-semibold">Add new category</h1>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !hasUnsavedChanges}
          >
            {isSubmitting ? "Adding category..." : "Add category"}
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
            {currentSection === "information" && (
              <CategoryInformation
                data={formData}
                onValueChange={updateFormData}
              />
            )}
            {currentSection === "banner" && (
              <CategoryBanner data={formData} onValueChange={updateFormData} />
            )}
            {currentSection === "content" && (
              <CategoryContent data={formData} onValueChange={updateFormData} />
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
            <AlertDialogAction onClick={() => navigate("/products/categories")}>
              Leave Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
