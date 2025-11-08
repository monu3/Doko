"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface PageActionsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddPage: () => void;
  activeTab: "all" | "published" | "draft";
  onTabChange: (tab: "all" | "published" | "draft") => void;
  counts: {
    all: number;
    published: number;
    draft: number;
  };
}

export function PageActions({
  searchQuery,
  onSearchChange,
  onAddPage,
  activeTab,
  onTabChange,
  counts,
}: PageActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="flex gap-2">
        <div className="border-4 border-primary-foreground rounded-md">
          <Button
            variant={activeTab === "all" ? "default" : "ghost"}
            className="h-9"
            onClick={() => onTabChange("all")}
          >
            All{" "}
            <span className="ml-1 bg-primary-foreground text-primary rounded px-1.5">
              {counts.all}
            </span>
          </Button>
        </div>
        <div className="border-4 border-primary-foreground rounded-md">
          <Button
            variant={activeTab === "published" ? "default" : "ghost"}
            className="h-9"
            onClick={() => onTabChange("published")}
          >
            Published{" "}
            <span className="ml-1 bg-primary-foreground text-primary rounded px-1.5">
              {counts.published}
            </span>
          </Button>
        </div>
        <div className="border-4 border-primary-foreground rounded-md">
          <Button
            variant={activeTab === "draft" ? "default" : "ghost"}
            className="h-9"
            onClick={() => onTabChange("draft")}
          >
            Draft{" "}
            <span className="ml-1 bg-primary-foreground text-primary rounded px-1.5">
              {counts.draft}
            </span>
          </Button>
        </div>
      </div>
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pages..."
          className="pl-8 h-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button className="h-9" onClick={onAddPage}>
          <Plus className="h-4 w-4 mr-2" />
          Add new page
        </Button>
      </div>
    </div>
  );
}
