"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarNavProps {
  items: {
    href: string;
    title: string;
  }[];
  currentSection: string;
  onSectionChange: (href: string) => void;
}

export function SidebarNav({
  items,
  currentSection,
  onSectionChange,
}: SidebarNavProps) {
  return (
    <nav className="flex flex-col space-y-1 w-full gap-2">
      <span className="font-semibold p-3">Quick Navigation</span>
      {items.map((item) => (
        <>
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "justify-start px-4 w-full font-normal",
              currentSection === item.href && "text-blue-600 font-medium"
            )}
            onClick={() => onSectionChange(item.href)}
          >
            {item.title}
          </Button>
          <hr />
        </>
      ))}
    </nav>
  );
}
