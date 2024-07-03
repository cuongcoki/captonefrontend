"use client";

import { filesApi } from "@/apis/files.api";
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
const limitLength = (text: any, maxLength: any) => {
  if (text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`;
  }
  return text;
};
export const columnsForMaterial: ColumnDef<materialType>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div>
          Tên vật liệu
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </div>
      );
    },
    cell: async ({ row }) => {
      var href;
      try {
        const res = await filesApi.getFile(
          (row.original.image?.trim() || "%20") as string
        );
        href = res?.data.data;
      } catch (error) {
        console.log("error in get image", error);
      }
      return (
        <div className="flex items-center space-x-2 max-w-[200px]">
          <Image
            className="w-10 h-10 mr-2"
            width={100}
            height={100}
            src={
              href ||
              "https://toplist.vn/images/800px/lang-nghe-may-tre-dan-phu-vinh-281399.jpg"
            }
            // src={
            //   "https://toplist.vn/images/800px/lang-nghe-may-tre-dan-phu-vinh-281399.jpg"
            // }
            alt={row.original.name}
          />
          <span>{row.original.name}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "quantityPerUnit",
    header: "Số lượng mỗi đơn vị",
  },
  {
    accessorKey: "unit",
    header: "Đơn vị",
  },
  {
    accessorKey: "description",
    header: "Miêu tả",
    cell: ({ row }) => {
      return (
        <div className="max-w-[30vh]">
          {limitLength(row.original.description, 200)}
        </div>
      );
    },
  },
  {
    accessorKey: "quantityInStock",
    header: "Số lượng trong kho",
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
