"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DataTableRowActions } from "./data-table-row-actions"
import Image from "next/image"
import { IsInProcessing } from "./data/data"
import { ArrowUpDown } from "lucide-react"
export type Product = {
  id: string;
  name: string;
  code: string;
  price: number
  size: string;
  description: string;
  isInProcessing: boolean;
  imageResponses: Array<{
    imageUrl: string,
    isBluePrint: boolean,
    isMainImage: boolean,
  }>;
}

export const columns: ColumnDef<Product>[] = [


  {
    accessorKey: "imageResponses",
    header: ({ column }) => (
      <Button variant="ghost">Hình ảnh</Button>
    ),
    cell: ({ row }) => {
      const firstImage = row.original.imageResponses[0];
      return firstImage ? (
        <Link href={`/dashboard/products/product/${row.original.id}`} className="flex justify-center items-center">
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
          <div className="w-[50px] h-[50px] text-white rounded-lg shadow-md ">
          </div>
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
      return (
        <Button variant="ghost" >
          Tên sản phẩm
        </Button>
      )
    },
    cell: ({ row }) => {
      let displayText = row.original.name;

      if (displayText.length > 20) {
        displayText = displayText.slice(0, 20) + '...';
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
      return (
        <Button variant="ghost">
          Mã CODE
        </Button>
      )
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
      return (
        <Button variant="ghost">
          Giá tiền
        </Button>
      )
    },
    
  },

  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <Button variant="ghost">
          Kích thước
        </Button>
      )
    },
    cell: ({ row }) => {
      let displayText = row.original.size;

      if (displayText.length > 15) {
        displayText = displayText.slice(0, 15) + '...';
      }
      return (
        <span className="inline-block  px-3 py-1 rounded-md">
          {displayText}
        </span>
      );
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
    cell: ({ row }) => {
      const shortenedDescription = `${row.original.description.slice(0, 30)}...`;
      return (
        <span className="inline-block  px-3 py-1 rounded-md">
          {shortenedDescription}
        </span>
      );
    },
  },


  {
    accessorKey: "isInProcessing",
    header: ({ column }) => (
      <Button variant="ghost">
        Đang xử lý
      </Button>
    ),
    cell: ({ row }) => {
      const isInProcessing = IsInProcessing.find(
        (item) => item.value === row.getValue("isInProcessing")
      );

      if (!isInProcessing) {
        return null;
      }

      return (
        <span className={`${isInProcessing.value === true ? 'bg-slate-100' : ''} border px-2 py-1 rounded-full`}>{isInProcessing.label}</span>
      );
    },
  },


  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },

]
