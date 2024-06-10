"use client";

import UpdateMaterial from "@/components/shared/dashboard/material/update-material/update-material";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Material = {
  materialID: string;
  image: string;
  name: string;
  unit: string;
  quantityPerUnit: number;
  description: string;
};

export const columnsForMaterial: ColumnDef<Material>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên vật liệu
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Image
            className="w-10 h-10 mr-2"
            width={10}
            height={10}
            src={row.original.image}
            alt={row.original.name}
          />
          <span>{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "unit",
    header: "Đơn vị",
  },
  {
    accessorKey: "quantityPerUnit",
    header: "Số lượng mỗi đơn vị",
  },
  {
    accessorKey: "description",
    header: "Miêu tả",
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(event) => {
                  // event.preventDefault();
                  const edit = document.getElementById("edit");
                  if (edit) {
                    edit.click();
                  }
                }}
              >
                <label>Chỉnh sửa</label>
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem>Xóa nguyên liệu</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <UpdateMaterial id={payment.materialID}>
            <div id="edit" className="hidden">
              Chỉnh sửa
            </div>
          </UpdateMaterial>
        </>
      );
    },
  },
];
