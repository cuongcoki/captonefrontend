"use client";

import { filesApi } from "@/apis/files.api";
import UpdateMaterial from "@/components/shared/dashboard/material/update-material/update-material";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
        <Dialog>
          <DialogTrigger >
            <div className="transition duration-300 ease-in-out hover:opacity-70 hover:bg-primary hover:shadow-md hover:shadow-primary/50 flex justify-center items-center space-x-2 w-[50px] h-[50px] rounded-lg shadow-md ">
              <Image
                className="w-full h-full rounded-lg object-cover"
                width={900}
                height={900}
                src={
                  href ||
                  "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg"
                }
                alt={row.original.name}
              />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <Image
              className="w-full h-full rounded-lg object-cover"
              width={900}
              height={900}
              src={
                href ||
                "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg"
              }
              alt={row.original.name}
            />
          </DialogContent>
        </Dialog>
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
