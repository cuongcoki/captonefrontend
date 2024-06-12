"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

import { DataTableRowActions } from "./data-table-row-actions"

export type Product = {
  productID: string;
  productName: string;
  Code: string;
  productPrice: number
  isGroup: string;
  size: string;
  description: string;
  createdBy: string;
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
    accessorKey: "productID",
    header: ({ column }) => (
      <Button
        variant="ghost"
      >
        Mã sản phẩm
      </Button>
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("productID")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Tên sản phẩm
        </Button>
      )
    },
  },

  {
    accessorKey: "Code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Mã CODE
        </Button>
      )
    },
  },

  {
    accessorKey: "productPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Giá tiền sản phẩm
        </Button>
      )
    },
  },

  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Mô tả sản phẩm
        </Button>
      )
    },
  },


  {
    accessorKey: "createdBy",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Người tạo đơn
        </Button>
      )
    },
  },


  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },

]
