"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DataTableRowActions } from "./data-table-row-actions"
import Image from "next/image"
import { IsInProcessing,StatusOrder } from "./data/data"
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
        <Button variant="ghost" className="">
          Tên Công Ty
        </Button>
      )
    },
  },

  {
    accessorKey: "company.directorName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" >
          Tên Giám Đốc
        </Button>
      )
    },
  },

  // {
  //   accessorKey: "company.email",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" >
  //         @mail
  //       </Button>
  //     )
  //   },
  // },


  // {
  //   accessorKey: "company.directorPhone",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" >
  //         Điện thoại giám đốc
  //       </Button>
  //     )
  //   },
  // },



  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button variant="ghost" >
          Trạng Thái
        </Button>
      )
    },
    cell: ({ row }) => {
      const statusOr = StatusOrder.find((statusOr) => statusOr.value === row.getValue("status"));

      if (!statusOr) {
        return null;
      }

      return <span>{statusOr.label}</span>;
    },
    
  },

 

  {
    accessorKey: "startOrder",
    header: ({ column }) => {
      return (
        <Button variant="ghost" >
          Ngày Bất Đầu
        </Button>
      )
    },
  },


  {
    accessorKey: "endOrder",
    header: ({ column }) => {
      return (
        <Button variant="ghost" >
          Ngày Kết Thúc
        </Button>
      )
    },
  },


  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },

]
