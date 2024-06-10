"use client";

import UpdateMaterialHistory from "@/components/shared/dashboard/material-history/update-material-history/update-material-history";
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
import { materialHistoryType } from "@/schema/material";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export const columnsForMaterialHistory: ColumnDef<materialHistoryType>[] = [
  {
    accessorKey: "material.name",
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
            src={row.original.material.image}
            alt={row.original.material.name}
          />
          <span>{row.original.material.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Số lượng",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-0"
        >
          Giá mua
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.price + " VND";
    },
  },
  {
    accessorKey: "importAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start p-0"
        >
          Ngày mua
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "totalMoney",
    header: "Thành tiền",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        (
          Number.parseInt(payment.quantity) * Number.parseInt(payment.price)
        ).toLocaleString("en-US") + " VND"
      );
    },
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
          <UpdateMaterialHistory id={payment.materialID}>
            <div id="edit" className="hidden">
              Chỉnh sửa
            </div>
          </UpdateMaterialHistory>
        </>
      );
    },
  },
];
