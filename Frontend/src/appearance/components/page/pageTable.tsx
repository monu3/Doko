import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import type { Page } from "@/appearance/components/page/types/page";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface PageTableProps {
  pages: Page[];
  isLoading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: "published" | "draft") => void;
  onView: (slug: string) => void;
}

export function PageTable({
  pages,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  onView,
}: PageTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <Card>
        <div className="p-4 text-center text-muted-foreground">
          No Pages found matching your criteria.
        </div>
      </Card>
    );
  }

  return (
    <Card>
    <div className="rounded-md border">
      <Table>
        <TableHeader className="font-bold bg-[#FFFFEF]">
          <TableRow>
            <TableHead className="w-[60%] font-bold">Title</TableHead>
            <TableHead className="font-bold" >Date</TableHead>
            <TableHead className="font-bold">Preview</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell className="font-medium text-blue-600">
                {page.title}
              </TableCell>
              <TableCell>
                {format(new Date(page.updatedAt), "dd MMM yyyy, h:mm a")}
              </TableCell>
              <TableCell>
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600"
                  onClick={() => onView(page.slug)}
                >
                  View
                </Button>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(page.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        onStatusChange(
                          page.id,
                          page.status === "published" ? "draft" : "published"
                        )
                      }
                    >
                      {page.status === "published"
                        ? "Move to draft"
                        : "Publish"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(page.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </Card>
  );
}