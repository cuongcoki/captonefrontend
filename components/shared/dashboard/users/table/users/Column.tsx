"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { Gender, Role, isActive } from "./data/data";
import { DataTableRowActions } from "./data-table-row-actions";
import Link from "next/link";

export type Roles = {
  id: string;
  title: string;
  description: string;
};

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  roleId: number;
  isActive: boolean;
  companyId: string;
  salaryByDay: number;
};

export const columns: ColumnDef<Employee>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: ({ column }) => <Button variant="ghost">CMND/CCCD</Button>,
    cell: ({ row }) => (
      <Link href={`/dashboard/user/${row.getValue("id")}`}>
        <div>{row.getValue("id")}</div>
      </Link>
    ),
  },

  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return <Button variant="ghost">Tên nhân viên</Button>;
    },
    cell: ({ row }) => (
      <div className="">
       {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },

  {
    accessorKey: "gender",
    header: ({ column }) => <Button variant="ghost">Giới tính</Button>,
    cell: ({ row }) => {
      const gender = Gender.find(
        (gender) => gender.value === row.getValue("gender")
      );

      if (!gender) {
        return null;
      }

      return <span>{gender.label}</span>;
    },
  },

  {
    accessorKey: "phone",
    header: ({ column }) => {
      return <Button variant="ghost">Số điện thoại</Button>;
    },
  },

  {
    accessorKey: "roleId",
    header: ({ column }) => <Button variant="ghost">Vai trò</Button>,
    cell: ({ row }) => {
      const role = Role.find((role) => role.value === row.getValue("roleId"));

      if (!role) {
        return null;
      }

      return <span>{role.label}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // {
  //   accessorKey: "salaryByDay",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //       >
  //         Lương ngày
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => {

  //     // const formatCurrency = (amount:any) => {
  //     //   return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  //     // };
  //     const formatCurrency = (amount: any) => {
  //       // Định dạng số theo tiêu chuẩn 'vi-VN'
  //       const formattedAmount = new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 0 }).format(amount);

  //       // Thay đổi dấu chấm thành dấu phẩy
  //       return formattedAmount.replace(/\./g, ',');
  //     }
  //     return (
  //         <span>{formatCurrency(row.original.salaryByDay)}</span>
  //     )
  //   },
  // },

  // {
  //   accessorKey: "companyId",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //       >
  //        companyId
  //       </Button>
  //     )
  //   },
  // },

  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return <Button variant="ghost">Hoạt động</Button>;
    },
    cell: ({ row }) => {
      const active = isActive.find(
        (isactive) => isactive.value === row.getValue("isActive")
      );

      if (!active) {
        return null;
      }

      return (
        <span
          className={`p-2 ${active.value ? "text-primary" : "text-red-500"
            }`}
        >
          {active.label}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
