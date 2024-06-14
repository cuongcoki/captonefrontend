"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

import { Gender, Role } from "./data/data"
import { DataTableRowActions } from "./data-table-row-actions"
import Link from "next/link"

export type Roles = {
  id: string
  title: string
  description: string
}

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string
  gender: string;
  address: string;
  phone: string;
  roleId: number;
  isActive: boolean;
  facilityID: number;
  salaryByDay: number;
}

export const columns: ColumnDef<Employee>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
      >
        CMND/CCCD
      </Button>
    ),
    cell: ({ row }) => <Link href={`/dashboard/user/${row.getValue("id")}`}><div className="w-[80px]">{row.getValue("id")}</div></Link>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Tên nhân viên
        </Button>
      )
    },
  },

  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Họ nhân viên
        </Button>
      )
    },
  },

  {
    accessorKey: "dob",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Ngày/tháng/năm sinh
        </Button>
      )
    },
  },

  {
    accessorKey: "gender",
    header: ({ column }) => (
      <Button
        variant="ghost"
      >
        Giới tính
      </Button>
    ),
    cell: ({ row }) => {
      const gender = Gender.find(
        (gender) => gender.value === row.getValue("gender")
      )

      if (!gender) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">

          <span>{gender.label}</span>
        </div>
      )
    },

  },

  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Địa chỉ, nơi chốn
        </Button>
      )
    },
  },

  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Số điện thoại
        </Button>
      )
    },
  },

  {
    accessorKey: "roleId",
    header: ({ column }) => (
      <Button
        variant="ghost"
      >
        Vai trò
      </Button>
    ),
    cell: ({ row }) => {
      const role = Role.find(
        (role) => role.value === row.getValue("roleId")
      )

      if (!role) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">

          <span>{role.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },



  {
    accessorKey: "salaryByDay",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Lường ngày
        </Button>
      )
    },
  },

  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Hoạt động
        </Button>
      )
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },

]
