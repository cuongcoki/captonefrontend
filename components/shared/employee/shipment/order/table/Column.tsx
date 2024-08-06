"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTableRowActions } from "./data-table-row-actions";
import Image from "next/image";
import { IsInProcessing, StatusOrder } from "./data/data";
import { ArrowUpDown } from "lucide-react";
import { ShipperOrderDetail } from "../orderID/shipperOrderDetail";
import ChangeStatusShipOrderEm from "../orderID/changeStatusShipOrderEm";
export type ShipOrderShipper = {
  deliveryMethod: number;
  deliveryMethodDescription: string;
  shipDate: string; // ISO 8601 format, could also use Date if you intend to parse it
  shipOrderId: string;
  status: number;
  statusDescription: string;
};
const limitLength = (text: any, maxLength: any) => {
  if (text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`;
  }
  return text;
};

function formatDate(isoString: string) {
  // Tách chuỗi thành các phần
  const parts = isoString.split("T")[0].split("-");

  // parts[0] là năm, parts[1] là tháng, parts[2] là ngày
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  // Trả về chuỗi theo định dạng dd/MM/yyyy
  return `${day}/${month}/${year}`;
}
export const columns: ColumnDef<ShipOrderShipper>[] = [
  {
    accessorKey: "shipOrderId",
    header: ({ column }) => {
      return <Button variant="ghost" className=" ">Chi tiết</Button>;
    },
    cell: ({ row }) => {
      return (
        <span className="flex justify-center ">
          <ShipperOrderDetail ShipOrderID={row.original.shipOrderId} />
        </span>
      );
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
          {
            row.original.status === 0 || row.original.status === 1 ? (
              <ChangeStatusShipOrderEm status={row.original} />
            ) : (
              <span>{statusOr.label} </span>
            )
          }
        </span>
      );
    },
  },


  {
    accessorKey: "shipDate",
    header: ({ column }) => {
      return <Button variant="ghost">Ngày Giao Hàng</Button>;
    },
    cell: ({ row }) => {
      return <span>{formatDate(row.original.shipDate)}</span>;
    },
  },

  // {
  //  id: "actions",
  //  cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
