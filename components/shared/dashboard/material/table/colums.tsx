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
import { materialType } from "@/schema/material";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columnsForMaterial: ColumnDef<materialType>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
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
            // src={row.original.image}
            src={
              "data:image/jpeg;base64,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"
            }
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
      const rowData = row.original;
      // console.log("rowData", rowData);

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
                  const edit = document.getElementById(`${rowData.id}-edit`);
                  if (edit) {
                    edit.click();
                  }
                }}
              >
                <label>Chỉnh sửa</label>
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuItem>Xóa nguyên liệu</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
          <UpdateMaterial id={rowData.id}>
            <div id={`${rowData.id}-edit`} className="hidden">
              Chỉnh sửa
            </div>
          </UpdateMaterial>
        </>
      );
    },
  },
];
