"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type Order = {
  id: string;
  companyId: string;
  company: {
    name: string;
    address: string;
    directorName: string;
    directorPhone: string;
    email: string;
    companyType: number;
    companyTypeDescription: string;
  };
  status: string;
  startOrder: string;
  endOrder: string;
};
const limitLength = (text: any, maxLength: any) => {
  if (text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`;
  }
  return text;
};

const formatDate = (date: string) => {
  const data = date.split("-");
  return `${data[2]}/${data[1]}/${data[0]}`;
};
export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "company.name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className=" ">
          Tên Công Ty
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="flex justify-center ">
          {limitLength(row.original.company.name, 30)}
        </span>
      );
    },
  },

  {
    accessorKey: "company.directorName",
    header: ({ column }) => {
      return <Button variant="ghost">Người Đại Diện</Button>;
    },
  },


  {
    accessorKey: "startOrder",
    header: ({ column }) => {
      return <Button variant="ghost">Ngày Bắt Đầu</Button>;
    },
    cell: ({ row }) => {
      return <span>{formatDate(row.original.startOrder)}</span>;
    },
  },

  {
    accessorKey: "endOrder",
    header: ({ column }) => {
      return <Button variant="ghost">Ngày Kết Thúc</Button>;
    },
    cell: ({ row }) => {
      return <span>{formatDate(row.original.endOrder)}</span>;
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return <Button variant="ghost">Trạng Thái</Button>;
    },
    cell: ({ row }) => {
      const StatusCheck = [
        {
          value: 0,
          label: "Đã nhận đơn hàng",
          bgColour: "text-slate-400 border-slate-400",
        },
        {
          value: 1,
          label: "Đang thực hiện",
          bgColour: "text-blue-500 border-blue-400",
        },
        {
          value: 2,
          label: "Đã hoàn thành",
          bgColour: "text-green-500 border-green-400",
        },
        {
          value: 3,
          label: "Đã hủy đơn hàng",
          bgColour: "text-red-500 border-red-400",
        },
      ];
      const statusValue = row.getValue("status");
      const statusOr = StatusCheck.find(
        (status) => status.value === statusValue
      );

      if (!statusOr) {
        return null;
      }

      return (
        <span className={`${statusOr.bgColour} px-2 py-1 `}>
          {statusOr.label}
        </span>
      );
    },
  },

];
