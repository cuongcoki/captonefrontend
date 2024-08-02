"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Truck } from "lucide-react";
import { ShipmentID } from "../shipmentID/ShipmentID";
import { UpdateShipment } from "../form/UpdateShipment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { shipmentApi } from "@/apis/shipment.api";
import toast from "react-hot-toast";
import { ChangeStatusShipment } from "../form/ChangeStatusShipment";
import { error } from "console";
import { DataTableRowActions } from "./data-table-row-actions";

export type Shipment = {
  from: {
    id: string;
    name: string;
    address: string;
    directorName: string;
    directorPhone: string;
    email: string;
    companyEnum: "FACTORY" | "THIRD_PARTY_COMPANY" | string;
    companyType: number;
    companyTypeDescription: string;
  };
  to: {
    id: string;
    name: string;
    address: string;
    directorName: string;
    directorPhone: string;
    email: string;
    companyEnum: "FACTORY" | "THIRD_PARTY_COMPANY" | string;
    companyType: number;
    companyTypeDescription: string;
  };
  shipDate: string; // ISO 8601 format
  id: string;
  statusDescription: string;
  status: number;
};
const limitLength = (text: any, maxLength: any) => {
  if (text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`;
  }
  return text;
};

const OrderStatus = [
  {
    id: 0,
    des: "Đang đợi giao",
    name: "PENDING",
  },
  {
    id: 1,
    des: "Đang thực hiện",
    name: "PROCESSING",
  },
  {
    id: 2,
    des: "Đã hoàn thành",
    name: "PROCESSING",
  },
  {
    id: 3,
    des: "Đã hủy",
    name: "PROCESSING",
  },
];

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
function convertUtcToVn(utcDateStr: string): string {
  let utcDate = new Date(utcDateStr);
  let vnDateStr = utcDate.toLocaleDateString("vi-VN");
  return vnDateStr;
}
export const columns: ColumnDef<Shipment>[] = [
  {
    accessorKey: "from.companyTypeDescription",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className=" ">
          Đơn vận hành từ
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="flex justify-center ">
          <HoverCard>
            <HoverCardTrigger>
              {" "}
              {limitLength(row.original.from.companyTypeDescription, 30)}
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="max-w-sm mx-auto">
                <div className="mb-2 text-start">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Tên giám đốc
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder={limitLength(
                      row.original.from.directorName.trim(),
                      30
                    )}
                    disabled
                    readOnly
                  />
                </div>
                <div className="mb-2 text-start">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Địa chỉ email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder={limitLength(
                      row.original.from.email.trim(),
                      30
                    )}
                    disabled
                    readOnly
                  />
                </div>
                <div className="mb-2 text-start">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Số điện thoại
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder={limitLength(
                      row.original.from.directorPhone.trim(),
                      30
                    )}
                    disabled
                    readOnly
                  />
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </span>
      );
    },
  },

  {
    accessorKey: "id",
    header: ({ column }) => {
      return <Button variant="ghost" className=" "></Button>;
    },
    cell: ({ row }) => {
      return (
        <span className="flex justify-center ">
          <ShipmentID shipmentIDDes={row.original.id} />
        </span>
      );
    },
  },

  {
    accessorKey: "to.companyTypeDescription",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className=" ">
          Đơn vận hành đến
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="flex justify-center ">
          <HoverCard>
            <HoverCardTrigger>
              {" "}
              {limitLength(row.original.to.companyTypeDescription, 30)}
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="max-w-sm mx-auto">
                <div className="mb-2 text-start">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Tên giám đốc
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder={limitLength(
                      row.original.to.directorName.trim(),
                      30
                    )}
                    disabled
                    readOnly
                  />
                </div>
                <div className="mb-2 text-start">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Địa chỉ email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder={limitLength(row.original.to.email.trim(), 30)}
                    disabled
                    readOnly
                  />
                </div>
                <div className="mb-2 text-start">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Số điện thoại
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder={limitLength(
                      row.original.to.directorPhone.trim(),
                      30
                    )}
                    disabled
                    readOnly
                  />
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </span>
      );
    },
  },

  {
    accessorKey: "shipDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className=" ">
          Ngày nhận hàng
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="flex justify-center ">
          {convertUtcToVn(row.original.shipDate)}
        </span>
      );
    },
  },

  {
    accessorKey: "statusDescription",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className=" ">
          Ngày nhận hàng
        </Button>
      );
    },
    cell: ({ row }) => (
      <span>
        <ChangeStatusShipment shipmentID={row.original} />
        {/* {limitLength(row.original.statusDescription, 30)} */}
      </span>
    ),
  },

  {
    accessorKey: "id",
    header: ({ column }) => {
      return <Button variant="ghost" className=" "></Button>;
    },
    cell: ({ row }) => {
      const handleAcceptShipment = () => {
        console.log(row.original.id);
        shipmentApi
          .isAcceptedShipment(row.original.id, true)
          .then(({ data }) => {
            // console.log("data", data)
            toast.success(data.message);
          })
          .catch((error) => {
            // console.log(error)
            toast.error(error.response.data.message);
          });
      };

      return (
        <span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-500/80">
                Xác nhận
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có hoàn toàn chắc chắn không?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn sẽ không thể chỉnh sửa hay bất kỳ thao tác gì cho đơn hàng
                  này nữa, bạn chắc chắn chứ
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                <AlertDialogAction onClick={handleAcceptShipment}>
                  Xác nhận
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
