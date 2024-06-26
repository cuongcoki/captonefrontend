"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DataTableRowActions } from "./data-table-row-actions"
import Image from "next/image"
import { IsInProcessing } from "./data/data"
import { ArrowUpDown } from "lucide-react"
export type Order = {
   id: string,
  companyId:string,
  company:{
    name: string,
    address: string,
    directorName: string,
    directorPhone: string,
    email: string,
    companyType: number,
    companyTypeDescription: string,
  }
  status:string,
  startOrder:string,
  endOrder:string,
}

export const columns: ColumnDef<Order>[] = [



  {
    accessorKey: "company.name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" >
          Tên 
        </Button>
      )
    },
  },

  {
    accessorKey: "company.directorName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" >
          Tên giám đốc
        </Button>
      )
    },
  },

  {
    accessorKey: "company.email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" >
          @mail
        </Button>
      )
    },
  },


  {
    accessorKey: "company.directorPhone",
    header: ({ column }) => {
      return (
        <Button variant="ghost" >
          Điện thoại giám đốc
        </Button>
      )
    },
  },



  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button variant="ghost" >
          Trạng thái
        </Button>
      )
    },
  },

 

  {
    accessorKey: "startOrder",
    header: ({ column }) => {
      return (
        <Button variant="ghost" >
          Ngày đặt hàng
        </Button>
      )
    },
  },


  {
    accessorKey: "endOrder",
    header: ({ column }) => {
      return (
        <Button variant="ghost" >
          Ngày nhận hàng
        </Button>
      )
    },
  },


  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },

]
