"use client";

import { useState } from "react";
import { GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MenuItem } from "./menu";


interface MenuBuilderProps {
  items: MenuItem[];
  onReorder: (items: MenuItem[]) => void;
  onUpdate: (id: string, updates: { title: string; url?: string }) => void;
  onRemove: (id: string) => void;
}

export function MenuBuilder({
  items,
  onUpdate,
  onRemove,
}: MenuBuilderProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<{
    title: string;
    url?: string;
  }>({
    title: "",
    url: "",
  });

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case "custom":
        return "Custom Link";
      case "product":
        return "Products";
      case "category":
        return "Categories";
      case "page":
      default:
        return "Pages";
    }
  };

  const handleExpand = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      const item = items.find((item) => item.id === id);
      setExpandedItem(id);
      setEditingValues({
        title: item?.title || "",
        url: item?.url || "",
      });
    }
  };

  const handleUpdate = (id: string) => {
    onUpdate(id, editingValues);
    setExpandedItem(null);
  };

  const handleCancel = () => {
    setExpandedItem(null);
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="border rounded-md">
          <div
            className="flex items-center gap-2 p-3 cursor-pointer"
            onClick={() => handleExpand(item.id)}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
            <span className="flex-1">{item.title}</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {getItemTypeLabel(item.type)}
              {expandedItem === item.id ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>

          {expandedItem === item.id && (
            <div className="p-4 border-t space-y-4">
              {item.type === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor={`link-${item.id}`}>
                    Link <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`link-${item.id}`}
                    value={editingValues.url}
                    onChange={(e) =>
                      setEditingValues((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor={`name-${item.id}`}>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`name-${item.id}`}
                  value={editingValues.title}
                  onChange={(e) =>
                    setEditingValues((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="link"
                  className="text-red-600 p-0 h-auto"
                  onClick={() => onRemove(item.id)}
                >
                  Remove
                </Button>
                <div className="flex-1" />
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => handleUpdate(item.id)}>
                  Update
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
