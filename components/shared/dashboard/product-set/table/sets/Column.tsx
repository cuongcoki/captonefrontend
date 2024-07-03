"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTableRowActions } from "./data-table-row-actions";
import Image from "next/image";
import { IsInProcessing } from "./data/data";
export type Product = {
  id: string;
  name: string;
  code: string;
  description: string;
  imageUrl: string;
};
const limitLength = (text: any, maxLength: any) => {
  if (text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`;
  }
  return text;
};
export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "imageResponses",
    header: ({ column }) => <Button variant="ghost">Hình Ảnh</Button>,
    cell: ({ row }) => {
      const firstImage = row.original.imageUrl;
      return firstImage ? (
        <Link
          href={`/dashboard/products/set/${row.original.id}`}
          className="flex justify-center items-center"
        >
          <div className="w-[50px] h-[50px] rounded-lg shadow-md">
            <Image
              src={`${firstImage}`}
              width={100}
              height={100}
              alt="Product Image"
              className="w-[50px] h-[50px] rounded-lg object-contain"
            />
          </div>
        </Link>
      ) : (
        <Link href={`/dashboard/products/set/${row.original.id}`}>
          <div className="w-[50px] h-[50px] text-white rounded-lg shadow-md "></div>
        </Link>
      );
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return <Button variant="ghost">Tên Bộ Sản Phẩm</Button>;
    },
    cell: ({ row }) => {
      return <div>{limitLength(row.original.name, 50)}</div>;
    },
  },

  {
    accessorKey: "code",
    header: ({ column }) => {
      return <Button variant="ghost">Mã Bộ Sản Phẩm</Button>;
    },
    cell: ({ row }) => {
      return <div>{limitLength(row.original.code, 20)}</div>;
    },
  },

  {
    accessorKey: "description",
    header: ({ column }) => {
      return <Button variant="ghost">Mô Tả</Button>;
    },
    cell: ({ row }) => {
      return <div>{limitLength(row.original.description, 50)}</div>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions<Product> row={row} />,
  },
];
