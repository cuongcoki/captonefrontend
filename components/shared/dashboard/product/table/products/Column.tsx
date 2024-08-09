"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTableRowActions } from "./data-table-row-actions";
import Image from "next/image";
import { IsInProcessing } from "./data/data";
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
    header: ({ column }) => <Button variant="ghost">Hình ảnh</Button>,
    cell: ({ row }) => {
      const firstImage = row.original.imageResponses.find(item => item.isMainImage === true) || row.original.imageResponses[0];
      return firstImage ? (
        <Link
          href={`/dashboard/products/product/${row.original.id}`}
          className="flex justify-center items-center"
        >
          <div className="transition duration-300 ease-in-out hover:opacity-70 hover:bg-primary hover:shadow-md hover:shadow-primary/50 flex justify-center items-center space-x-2 w-[50px] h-[50px] rounded-lg shadow-md ">
            <Image
              src={`${firstImage.imageUrl}`}
              width={100}
              height={100}
              alt="ảnh sp"
              className="w-[50px] h-[50px] rounded-lg object-cover"
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


  {
    accessorKey: "code",
    header: ({ column }) => {
      return <Button variant="ghost">Mã sản phẩm</Button>;
    },
    cell: ({ row }) => {
      const shortenedCode = row.original.code.slice(0, 10);
      return (
        <span className="inline-block px-3 py-1 rounded-md">
          {shortenedCode}
        </span>
      );
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return <Button variant="ghost" className="">Tên sản phẩm</Button>;
    },
    cell: ({ row }) => {
      let displayText = row.original.name;

      if (displayText.length > 20) {
        displayText = displayText.slice(0, 20) + "...";
      }
      return (
        <span className="inline-block px-3 py-1 rounded-md ">
          {displayText}
        </span>
      );
    },
  },

  {
    accessorKey: "description",
    header: ({ column }) => {
      return <Button variant="ghost">Miêu tả</Button>;
    },
    cell: ({ row }) => {
      const shortenedDescription = `${row.original.description.slice(
        0,
        30
      )}...`;
      return (
        <span className="inline-block  px-3 py-1 rounded-md ">
          {shortenedDescription}
        </span>
      );
    },
  },

  {
    accessorKey: "price",
    header: ({ column }) => {
      return <Button variant="ghost">Giá thành</Button>;
    },
    cell: ({ row }) => {
      const formattedPrice = Number(row.original.price).toLocaleString("vi-VN");
      return (
        <span className="inline-block px-3 py-1 rounded-md">
          {formattedPrice}
        </span>
      );
    },
  },
  
  {
    accessorKey: "isInProcessing",
    header: ({ column }) => <Button variant="ghost">Trạng thái</Button>,
    cell: ({ row }) => {
      const isInProcessing = IsInProcessing.find(
        (item) => item.value === row.getValue("isInProcessing")
      );

      if (!isInProcessing) {
        return null;
      }

      return (
        <span
          className={`${isInProcessing.value === true
            ? "p-2 text-primary dark:bg-white"
            : "p-2 text-red-500 dark:bg-white"
            } `}
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
