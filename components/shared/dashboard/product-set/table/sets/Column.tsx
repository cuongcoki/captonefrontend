"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTableRowActions } from "./data-table-row-actions";
import Image from "next/image";
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
    header: ({ column }) => <Button variant="ghost">Hình ảnh</Button>,
    cell: ({ row }) => {
      const firstImage = row.original.imageUrl;
      return firstImage ? (
        <Link
          href={`/dashboard/products/set/${row.original.id}`}
          className="flex justify-center items-center"
        >
          <div className="transition duration-300 ease-in-out hover:opacity-70 hover:bg-primary hover:shadow-md hover:shadow-primary/50 flex justify-center items-center space-x-2 w-[50px] h-[50px] rounded-lg shadow-md ">
            <Image
              src={`${firstImage}`}
              width={100}
              height={100}
              alt="Product Image"
              className="w-[50px] h-[50px] rounded-lg object-cover"
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
    accessorKey: "code",
    header: ({ column }) => {
      return <Button variant="ghost">Mã bộ sản phẩm</Button>;
    },
    cell: ({ row }) => {
      return <div className="w-full">{limitLength(row.original.code, 20)}</div>;
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return <Button variant="ghost">Tên bộ sản phẩm</Button>;
    },
    cell: ({ row }) => {
      return <div className=" w-full">{limitLength(row.original.name, 50)}</div>;
    },
  },

  {
    accessorKey: "description",
    header: ({ column }) => {
      return <Button variant="ghost">Miêu tả</Button>;
    },
    cell: ({ row }) => {
      return <div className="w-full">{limitLength(row.original.description, 45)}</div>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions<Product> row={row} />,
  },
];
