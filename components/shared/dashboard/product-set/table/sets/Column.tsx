"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DataTableRowActions } from "./data-table-row-actions"
import Image from "next/image"
import { IsInProcessing } from "./data/data"
export type Product = {
  id: string;
  name: string;
  code: string;
  description: string;
  imageUrl: string;
 
}

export const columns: ColumnDef<Product>[] = [


  {
    accessorKey: "imageResponses",
    header: ({ column }) => (
      <Button variant="ghost">Hình ảnh</Button>
    ),
    cell: ({ row }) => {
      const firstImage = row.original.imageUrl;
      return firstImage ? (
        <Link href={`/dashboard/set/${row.original.id}`}>
          <div className="w-[50px] h-[50px] rounded-lg ">
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
        'no image'
      );
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" >
          Tên sản phẩm
        </Button>
      )
    },
  },

  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost">
          Mã CODE
        </Button>
      )
    },
  },

 
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button variant="ghost">
          Mô tả sản phẩm
        </Button>
      )
    },
  },



  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },

]
