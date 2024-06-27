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
import { ArrowUpDown, Edit, MoreHorizontal } from "lucide-react";
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
              "https://toplist.vn/images/800px/lang-nghe-may-tre-dan-phu-vinh-281399.jpg"
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
    accessorKey: "quantityInStock",
    header: "Số lượng",
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const rowData = row.original;
      // console.log("rowData", rowData);
      return (
        <>
          <UpdateMaterial id={rowData.id}>
            <Edit className="cursor-pointer" />
          </UpdateMaterial>
        </>
      );
    },
  },
];
