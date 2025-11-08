"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemsSource } from "@/appearance/components/menu/menuItems";
import { MenuBuilder } from "@/appearance/components/menu/menuBuilder";
import { ExternalLink } from "lucide-react";
import type { MenuItem, MenuSection } from "@/appearance/components/menu/menu";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export default function MenusPage() {
  const [activeTab, setActiveTab] = useState<"header" | "footer">("header");
  const [menuSections, setMenuSections] = useState<MenuSection[]>([
    {
      id: "header",
      items: [
        { id: "1", type: "page", title: "m" },
        { id: "2", type: "page", title: "test" },
      ],
    },
    {
      id: "footer",
      items: [],
    },
  ]);

  const handleAddItems = (newItems: { title: string; type: string }[]) => {
    setMenuSections((prev) =>
      prev.map((section) => {
        if (section.id === activeTab) {
          return {
            ...section,
            items: [
              ...section.items,
              ...(newItems.map((item, index) => ({
                ...item,
                id: `${Date.now()}-${index}`,
              })) as MenuItem[]),
            ],
          };
        }
        return section;
      })
    );
  };

  const handleReorder = (items: MenuItem[]) => {
    setMenuSections((prev) =>
      prev.map((section) => {
        if (section.id === activeTab) {
          return {
            ...section,
            items,
          };
        }
        return section;
      })
    );
  };

  const handleUpdateItem = (
    id: string,
    updates: { title: string; url?: string }
  ) => {
    setMenuSections((prev) =>
      prev.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      }))
    );
    toast.success("Menu item updated");
  };

  const handleRemoveItem = (id: string) => {
    setMenuSections((prev) =>
      prev.map((section) => ({
        ...section,
        items: section.items.filter((item) => item.id !== id),
      }))
    );
    toast.success("Menu item removed");
  };

  const handleSave = async () => {
    try {
      // Add your API call here
      console.log("Saving menu:", menuSections);
      toast.success("Menu saved successfully");
    } catch (error) {
      toast.error("Failed to save menu");
    }
  };

  const activeSection = menuSections.find(
    (section) => section.id === activeTab
  );

  return (
    <div className="container py-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "header" | "footer")}
      >
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview store
            </Button>
            <Button onClick={handleSave}>Save menu</Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Card (Smaller) */}
          <Card className="w-[300px] flex-shrink-0">
            <div className="border rounded-lg p-4">
              <h2 className="font-medium mb-4">Menu Items</h2>
              <hr className="my-4" />
              <MenuItemsSource onAddItems={handleAddItems} />
            </div>
          </Card>

          {/* Right Card (Expands) */}
          <Card className="flex-grow p-4">
            <h2 className="font-medium mb-4">Header Menu</h2>
            <hr className="my-4" />
            <MenuBuilder
              items={activeSection?.items || []}
              onReorder={handleReorder}
              onUpdate={handleUpdateItem}
              onRemove={handleRemoveItem}
            />
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
