"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

import { DataTableRowActions } from "./data-table-row-actions"
import Image from "next/image"
import { IsInProcessing} from "./data/data"
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
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "imageResponses",
    header: ({ column }) => (
      <Button variant="ghost">Hình ảnh</Button>
    ),
    cell: ({ row }) => {
      const firstImage = row.original.imageResponses[0];
      console.log('firstImagefirstImagefirstImagefirstImage', firstImage)
      return firstImage ? (
        <div className="w-[100px] h-[100px] rounded-lg bg-primary-backgroudPrimary">
          <Image
            src={`/${firstImage.imageUrl}`}
            width={100}
            height={100}
            alt="Product Image"
            className="w-[100px] h-[100px] rounded-lg object-contain"
          />
        </div>
      ) : (
        'no image'
      );
    },
  },

  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost">
        Mã sản phẩm
      </Button>
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
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
        <div className="flex w-[100px] items-center">
          <span className={`${isInProcessing.value === true ?  'bg-slate-100' : ''} border px-2 py-1 rounded-full`}>{isInProcessing.label}</span>
        </div>
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
