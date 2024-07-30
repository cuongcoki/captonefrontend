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
import { ArrowUpDown, Edit, MoreHorizontal, PenLine } from "lucide-react";
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
      return <div className="text-center">Ảnh minh họa</div>;
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
        <div className="flex justify-center items-center space-x-2 max-w-[200px]">
          <Image
            className="size-20 mr-2"
            width={100}
            height={100}
            src={
              href ||
              "https://toplist.vn/images/800px/lang-nghe-may-tre-dan-phu-vinh-281399.jpg"
            }
            alt={row.original.name}
          />
        </div>
      );
    },
  },

  {
    accessorKey: "name",
    header: () => <div className="flex justify-center">Tên nguyên liệu</div>,
    cell: ({ row }) => {
      return <div className="flex justify-center">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "quantityPerUnit",
    header: () => (
      <div className="flex justify-center">Số lượng mỗi đơn vị</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {row.original.quantityPerUnit}
        </div>
      );
    },
  },
  {
    accessorKey: "unit",
    header: () => <div className="flex justify-center">Đơn vị tính</div>,
    cell: ({ row }) => {
      return <div className="flex justify-center">{row.original.unit}</div>;
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="flex justify-center">Miêu tả</div>,
    cell: ({ row }) => {
      return (
        <div className="max-w-[30vh] text-center">
          {limitLength(row.original.description, 200)}
        </div>
      );
    },
  },
  {
    accessorKey: "quantityInStock",
    header: () => <div className="flex justify-center">Số lượng</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {row.original.quantityInStock}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="flex justify-center">Chỉnh sửa</div>,
    cell: ({ row }) => {
      const rowData = row.original;
      // console.log("rowData", rowData);
      return (
        <>
          <UpdateMaterial id={rowData.id}>
            <PenLine className="cursor-pointer" />
          </UpdateMaterial>
        </>
      );
    },
  },
];
