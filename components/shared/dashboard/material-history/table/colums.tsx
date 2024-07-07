"use client";

import { filesApi } from "@/apis/files.api";
import { DeleteMaterialHistory } from "@/components/shared/dashboard/material-history/delete-material-history/delete-material-history";
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
import { materialHistoryType } from "@/types/material-history.type";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Edit, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export const columnsForMaterialHistory: ColumnDef<materialHistoryType>[] = [
  {
    accessorKey: "material.name",
    header: ({ column }) => {
      return (
        <div>
          Tên Vật Liệu
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
              "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg"
            }
            alt={row.original.image}
          />
          <span>{row.original.materialName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Số Lượng",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start p-0">
          Giá Mua 1 Vật Liệu
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </div>
      );
    },
    cell: ({ row }) => {
      const formattedPrice = Number(row.original.price).toLocaleString("vi-VN");
      return `${formattedPrice}`;
    },
  },
  {
    accessorKey: "importDate",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start p-0">
          Ngày Mua
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </div>
      );
    },
    cell: ({ row }) => {
      return format(row.original.importDate, "dd/MM/yyyy");
    },
  },
  // {
  //   id: "totalMoney",
  //   header: "Thành tiền",
  //   cell: ({ row }) => {
  //     const payment = row.original;

  //     return (
  //       (payment.price * payment.quantity).toLocaleString("en-US") + " VND"
  //     );
  //   },
  // },
  {
    accessorKey: "description",
    header: "Ghi Chú",
    cell: ({ row }) => {
      return <div className="max-w-[30vh]">{row.original.description}</div>;
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start p-0">
          Hành Động
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </div>
      );
    },
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="flex items-center justify-start p-0 gap-x-3">
          <UpdateMaterialHistory id={payment.id}>
            <div id={payment.id}>
              <Edit className="hover:cursor-pointer" />
            </div>
          </UpdateMaterialHistory>
          <DeleteMaterialHistory id={payment.id} />
        </div>
      );
    },
  },
];
