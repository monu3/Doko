"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "../components/addCategory/quickNavigation";
import { CategoryInformation } from "../components/addCategory/categoryInformation";
import { CategoryBanner } from "../components/addCategory/categoryBanner";
import { CategoryContent } from "../components/addCategory/categoryContent";
import { useNavigate, useParams } from "react-router-dom";
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
import { useCategory } from "@/hooks/useCategory";
import { Category } from "@/category/types/category";

const sidebarNavItems = [
  { title: "Information", href: "information" },
  { title: "Banner", href: "banner" },
  { title: "Content", href: "content" },
];

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedCategory, status, error, loadCategoryById, editCategory } =
    useCategory();

  const [currentSection, setCurrentSection] = useState("information");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({});

  // Load category data when component mounts
  useEffect(() => {
    if (id) {
      loadCategoryById(id);
    }
  }, [id, loadCategoryById]);

  // Initialize form data when selectedCategory is loaded
  useEffect(() => {
    if (selectedCategory) {
      setFormData(selectedCategory);
    }
  }, [selectedCategory]);

  // Simple form data update
  const updateFormData = (newData: Partial<Category>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // Check if there are unsaved changes by comparing with initial selectedCategory
  const hasUnsavedChanges = selectedCategory
    ? JSON.stringify(formData) !== JSON.stringify(selectedCategory)
    : false;

  // Simple handleSubmit - send all form data
  const handleSubmit = async () => {
    if (!formData.name?.trim()) {
      toast.error("Please fill in all required fields", { autoClose: 2000 });
      setCurrentSection("information");
      return;
    }

    if (!id) {
      toast.error("Category ID is missing", { autoClose: 2000 });
      return;
    }

    try {
      setIsSubmitting(true);

      // Simply send all form data without checking for changes
      await editCategory(id, formData).unwrap();
      toast.success("Category updated successfully", { autoClose: 2000 });
      navigate("/products/categories");
    } catch (error: any) {
      toast.error(error.message || "Failed to update category", {
        autoClose: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back navigation
  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowAlertDialog(true);
    } else {
      navigate("/products/categories");
    }
  };

  // Loading state
  if (status === "loading" && !selectedCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p>Loading category details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !selectedCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Category
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/products/categories")}>
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  // No category found
  if (!selectedCategory && status === "succeeded") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Category Not Found</h2>
          <p className="text-gray-600 mb-4">
            The category you're trying to edit doesn't exist.
          </p>
          <Button onClick={() => navigate("/products/categories")}>
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  // Don't render form until we have category data
  if (!selectedCategory) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-semibold">Edit category</h1>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update category"}
          </Button>
        </div>
      </header>

      <div className="container flex gap-8 py-6">
        <aside className="w-[240px] sticky top-[73px] self-start bg-white rounded-lg shadow-sm p-4">
          <SidebarNav
            items={sidebarNavItems}
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
          />
        </aside>

        <main className="flex-1 bg-white rounded-lg shadow-sm p-6">
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
