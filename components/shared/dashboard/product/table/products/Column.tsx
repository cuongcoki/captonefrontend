"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTableRowActions } from "./data-table-row-actions";
import Image from "next/image";
import { IsInProcessing } from "./data/data";
import { ArrowUpDown } from "lucide-react";
export type Product = {
  id: string;
  name: string;
  code: string;
  price: number;
  size: string;
  description: string;
  isInProcessing: boolean;
  imageResponses: Array<{
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
  }>;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "imageResponses",
    header: ({ column }) => <Button variant="ghost">Hình Ảnh</Button>,
    cell: ({ row }) => {
      const firstImage = row.original.imageResponses.find(item => item.isMainImage === true) || row.original.imageResponses[0];
      return firstImage ? (
        <Link
          href={`/dashboard/products/product/${row.original.id}`}
          className="flex justify-center items-center"
        >
          <div className="w-[50px] h-[50px] rounded-lg shadow-md">
            <Image
              src={`${firstImage.imageUrl}`}
              width={100}
              height={100}
              alt="ảnh sp"
              className="w-[50px] h-[50px] rounded-lg object-contain"
            />
          </div>
        </Link>
      ) : (
        <Link href={`/dashboard/products/product/${row.original.id}`}>
          <div className="w-[50px] h-[50px] text-white rounded-lg shadow-md "></div>
        </Link>
      );
    },
  },

  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <Button variant="ghost">
  //       Mã sản phẩm
  //     </Button>
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  // },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return <Button variant="ghost">Tên Sản Phẩm</Button>;
    },
    cell: ({ row }) => {
      let displayText = row.original.name;

      if (displayText.length > 20) {
        displayText = displayText.slice(0, 20) + "...";
      }
      return (
        <span className="inline-block   px-3 py-1 rounded-md">
          {displayText}
        </span>
      );
    },
  },

  {
    accessorKey: "code",
    header: ({ column }) => {
      return <Button variant="ghost">Mã Sản Phẩm</Button>;
    },
    cell: ({ row }) => {
      const shortenedCode = row.original.code.slice(0, 10);
      return (
        <span className="inline-block   px-3 py-1 rounded-md">
          {shortenedCode}
        </span>
      );
    },
  },

  {
    accessorKey: "price",
    header: ({ column }) => {
      return <Button variant="ghost">Giá Thành</Button>;
    },
    cell: ({ row }) => {
      const formattedPrice = Number(row.original.price).toLocaleString("vi-VN");
      return `${formattedPrice}`;
    },
  },

  // {
  //   accessorKey: "size",
  //   header: ({ column }) => {
  //     return <Button variant="ghost">Kích Thước</Button>;
  //   },
  //   cell: ({ row }) => {
  //     let displayText = row.original.size;

  //     if (displayText.length > 15) {
  //       displayText = displayText.slice(0, 15) + "...";
  //     }
  //     return (
  //       <span className="inline-block  px-3 py-1 rounded-md">
  //         {displayText}
  //       </span>
  //     );
  //   },
  // },

  // {
  //   accessorKey: "description",
  //   header: ({ column }) => {
  //     return <Button variant="ghost">Mô Tả</Button>;
  //   },
  //   cell: ({ row }) => {
  //     const shortenedDescription = `${row.original.description.slice(
  //       0,
  //       30
  //     )}...`;
  //     return (
  //       <span className="inline-block  px-3 py-1 rounded-md">
  //         {shortenedDescription}
  //       </span>
  //     );
  //   },
  // },

  {
    accessorKey: "isInProcessing",
    header: ({ column }) => <Button variant="ghost">Trạng Thái</Button>,
    cell: ({ row }) => {
      const isInProcessing = IsInProcessing.find(
        (item) => item.value === row.getValue("isInProcessing")
      );

      if (!isInProcessing) {
        return null;
      }

      return (
        <span
          className={`${
            isInProcessing.value === true
              ? "p-2 rounded-xl text-black bg-secondary border dark:bg-white"
              : "bg-secondary text-black dark:bg-white"
          } border px-2 py-1 rounded-full`}
        >
          {isInProcessing.label}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
