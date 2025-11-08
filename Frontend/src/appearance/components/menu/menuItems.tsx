"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { fetchProductsByShopId } from "@/product/slice/productSlice";
import type { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchCategoriesByShopId } from "@/category/slice/categorySlice";

interface MenuItemsSourceProps {
  onAddItems: (items: { title: string; type: string; url?: string }[]) => void;
}

export function MenuItemsSource({ onAddItems }: MenuItemsSourceProps) {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state: RootState) => state.product);
  const { categories } = useAppSelector((state: RootState) => state.category);
  const [expandedSections, setExpandedSections] = useState<string[]>(["pages"]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customLink, setCustomLink] = useState({ name: "", url: "" });
  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const pages = [
    { id: "1", title: "test" },
    { id: "2", title: "m" },
  ];

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(fetchProductsByShopId());
  }, [dispatch]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  //Fetch category when component mounts
  useEffect(() => {
    dispatch(fetchCategoriesByShopId());
  }, [dispatch]);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToMenu = (type: "page" | "product" | "category") => {
    let itemsToAdd: { title: string; type: string }[] = [];

    switch (type) {
      case "page":
        itemsToAdd = pages
          .filter((page) => selectedItems.includes(page.id))
          .map((page) => ({
            title: page.title,
            type: "page",
          }));
        break;
      case "product":
        itemsToAdd = products
          .filter((product) => selectedItems.includes(product.id))
          .map((product) => ({
            title: product.name,
            type: "product",
          }));
        break;
      case "category":
        itemsToAdd = categories
          .filter((category) => selectedItems.includes(category.id))
          .map((category) => ({
            title: category.name,
            type: "category",
          }));
        break;
    }
    onAddItems(itemsToAdd);
    setSelectedItems([]);
  };

  const handleAddCustomLink = () => {
    if (!customLink.name || !customLink.url) return;

    onAddItems([
      {
        title: customLink.name,
        type: "custom",
        url: customLink.url,
      },
    ]);
    setCustomLink({ name: "", url: "" });
  };

  return (
    <div className="space-y-4">
      {/* page section  */}
      <div>
        <div
          className="flex items-center justify-between py-2 cursor-pointer"
          onClick={() => toggleSection("pages")}
        >
          <h3 className="text-sm from-accent-foreground">Pages</h3>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          {expandedSections.includes("pages") ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
        <div
          className={cn(
            "space-y-2 ml-2",
            !expandedSections.includes("pages") && "hidden"
          )}
        >
          {pages.map((page) => (
            <div key={page.id} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedItems.includes(page.id)}
                onCheckedChange={() => toggleItem(page.id)}
              />
              <label className="text-sm">{page.title}</label>
            </div>
          ))}
          {selectedItems.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => handleAddToMenu("page")}
            >
              Add to Menu
            </Button>
          )}
        </div>
      </div>

      {/* Custom Link Section */}
      <div>
        <div
          className="flex items-center justify-between py-2 cursor-pointer"
          onClick={() => toggleSection("custom")}
        >
          <h3 className="text-sm from-accent-foreground text-muted-foreground">Custom link</h3>
          {expandedSections.includes("custom") ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
        <div
          className={cn(
            "space-y-4 ml-2",
            !expandedSections.includes("custom") && "hidden"
          )}
        >
          <div className="space-y-2">
            <Label htmlFor="link">
              Link <span className="text-red-500">*</span>
            </Label>
            <Input
              id="link"
              placeholder="Enter link"
              value={customLink.url}
              onChange={(e) =>
                setCustomLink((prev) => ({ ...prev, url: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={customLink.name}
              onChange={(e) =>
                setCustomLink((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={!customLink.name || !customLink.url}
            onClick={handleAddCustomLink}
          >
            Add to Menu
          </Button>
        </div>
      </div>

      {/* products section */}

      <div>
        <div
          className="flex items-center justify-between py-2 cursor-pointer"
          onClick={() => toggleSection("products")}
        >
          <h3 className="text-sm from-accent-foreground">Products</h3>
          {expandedSections.includes("products") ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
        <div
          className={cn(
            "space-y-4 ml-2",
            !expandedSections.includes("products") && "hidden"
          )}
        >
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search product"
              className="pl-8"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedItems.includes(product.id)}
                  onCheckedChange={() => toggleItem(product.id)}
                />
                <label className="text-sm">{product.name}</label>
              </div>
            ))}
          </div>
          {selectedItems.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddToMenu("product")}
            >
              Add to Menu
            </Button>
          )}
        </div>
      </div>

      {/* category sections */}

      <div>
        <div
          className="flex items-center justify-between py-2 cursor-pointer"
          onClick={() => toggleSection("categories")}
        >
          <h3 className="text-sm from-accent-foreground text-opacity-0">
            Categories
          </h3>
          {expandedSections.includes("categories") ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
        <div
          className={cn(
            "space-y-4 ml-2",
            !expandedSections.includes("categories") && "hidden"
          )}
        >
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search category"
              className="pl-8"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {filteredCategories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedItems.includes(category.id)}
                  onCheckedChange={() => toggleItem(category.id)}
                />
                <label className="text-sm">{category.name}</label>
              </div>
            ))}
          </div>
          {selectedItems.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddToMenu("category")}
            >
              Add to Menu
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
