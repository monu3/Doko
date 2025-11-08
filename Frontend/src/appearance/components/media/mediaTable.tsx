"use client";

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
import { MoreHorizontal } from "lucide-react";
import type { MediaFile } from "./media";
import { Card } from "@/components/ui/card";

interface MediaTableProps {
  media: MediaFile[];
  onCopyUrl: (url: string) => void;
  onDelete: (id: string) => void;
}

export function MediaTable({ media, onCopyUrl, onDelete }: MediaTableProps) {
  if (media.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No media found.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-1">
      <Card className="p-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Media file</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {media.map((file) => (
              <TableRow key={file.id}>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-md overflow-hidden">
                      <img
                        src={file.thumbnailUrl || "/placeholder.svg"}
                        alt={file.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-medium text-blue-600">{file.filename}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600"
                    onClick={() => onCopyUrl(file.url)}
                  >
                    Copy URL
                  </Button>
                </TableCell>
                <TableCell>
                  {format(new Date(file.updatedAt), "dd MMM yyyy, h:mm a")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onCopyUrl(file.url)}>
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(file.id)}
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
      </Card>
    </div>
  );
}
