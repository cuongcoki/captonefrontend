"use client";

import { filesApi } from "@/apis/files.api";
import { DeleteMaterialHistory } from "@/components/shared/dashboard/material-history/delete-material-history/delete-material-history";
import MaterialHistoryAction from "@/components/shared/dashboard/material-history/table/material-history-action";
import UpdateMaterialHistory from "@/components/shared/dashboard/material-history/update-material-history/update-material-history";
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
import { materialHistoryType } from "@/types/material-history.type";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Edit, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export const columnsForMaterialHistory: ColumnDef<materialHistoryType>[] = [
  {
    accessorKey: "material.name",
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
                alt={row.original.image}
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
              alt={row.original.image}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "materialName",
    header: () => <div className="flex justify-center">Tên nguyên liệu</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.original.materialName}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: () => <div className="flex justify-center">Số lượng</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.original.quantity}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center p-0">
          Giá mua 1 nguyên liệu
        </div>
      );
    },
    cell: ({ row }) => {
      const formattedPrice = Number(row.original.price).toLocaleString("vi-VN");
      return <div className="text-center">{formattedPrice}</div>;
    },
  },
  {
    accessorKey: "importDate",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center p-0">Ngày mua</div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {format(row.original.importDate, "dd/MM/yyyy")}
        </div>
      );
    },
  },

  {
    accessorKey: "description",
    header: () => <div className="flex justify-center">Ghi chú</div>,
    cell: ({ row }) => {
      return (
        <div className="max-w-[30vh] text-center">
          {row.original.description}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center p-0">
          Hành Động
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </div>
      );
    },
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="flex items-center justify-center p-0 gap-x-3">
          {/* <UpdateMaterialHistory id={payment.id}>
            <div id={payment.id}>
              <Edit className="hover:cursor-pointer" />
            </div>
          </UpdateMaterialHistory>
          <DeleteMaterialHistory id={payment.id} /> */}
          <MaterialHistoryAction id={payment.id} />
        </div>
      );
    },
  },
];
