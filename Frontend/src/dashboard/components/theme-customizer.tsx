"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const [theme, setTheme] = useState("default");
  const [scale, setScale] = useState("md");
  const [radius, setRadius] = useState("md");
  const [colorMode, setColorMode] = useState("light");
  const [contentLayout, setContentLayout] = useState("full");
  const [sidebarMode, setSidebarMode] = useState("default");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-80 border-l bg-card shadow-lg">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Theme Customizer</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme preset:</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="underground">Underground</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Scale:</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={scale === "sm" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScale("sm")}
                  disabled
                >
                  XS
                </Button>
                <Button
                  variant={scale === "md" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScale("md")}
                >
                  MD
                </Button>
                <Button
                  variant={scale === "lg" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScale("lg")}
                >
                  LG
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Radius:</Label>
              <div className="grid grid-cols-5 gap-2">
                <Button
                  variant={radius === "none" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRadius("none")}
                  disabled
                >
                  None
                </Button>
                <Button
                  variant={radius === "sm" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRadius("sm")}
                >
                  SM
                </Button>
                <Button
                  variant={radius === "md" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRadius("md")}
                >
                  MD
                </Button>
                <Button
                  variant={radius === "lg" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRadius("lg")}
                >
                  LG
                </Button>
                <Button
                  variant={radius === "xl" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRadius("xl")}
                >
                  XL
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Color mode:</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={colorMode === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColorMode("light")}
                >
                  Light
                </Button>
                <Button
                  variant={colorMode === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColorMode("dark")}
                >
                  Dark
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Content layout:</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={contentLayout === "full" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setContentLayout("full")}
                >
                  Full
                </Button>
                <Button
                  variant={contentLayout === "centered" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setContentLayout("centered")}
                >
                  Centered
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Sidebar mode:</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={sidebarMode === "default" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSidebarMode("default")}
                >
                  Default
                </Button>
                <Button
                  variant={sidebarMode === "icon" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSidebarMode("icon")}
                >
                  Icon
                </Button>
              </div>
            </div>

            <Separator />

            <Button variant="destructive" className="w-full">
              Reset to Default
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
