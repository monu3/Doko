import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { FileChartLine } from "lucide-react";

export function ReportSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <FileChartLine />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Report</SheetTitle>
          <SheetDescription>Generate a report for your store</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
