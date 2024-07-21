"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Truck } from "lucide-react"
import { ShipmentID } from "../shipmentID/ShipmentID"
import { UpdateShipment } from "../form/UpdateShipment"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { shipmentApi } from "@/apis/shipment.api"
import toast from "react-hot-toast"

export type Shipment = {
  from: {
    id: string;
    name: string;
    address: string;
    directorName: string;
    directorPhone: string;
    email: string;
    companyEnum: 'FACTORY' | 'THIRD_PARTY_COMPANY' | string;
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
    companyEnum: 'FACTORY' | 'THIRD_PARTY_COMPANY' | string;
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
    name: "PENDING"
  },
  {
    id: 1,
    des: "Đang thực hiện",
    name: "PROCESSING"
  },
  {
    id: 2,
    des: "Đã hoàn thành",
    name: "PROCESSING"
  },
  {
    id: 3,
    des: "Đã hủy",
    name: "PROCESSING"
  },
];

export const columns: ColumnDef<Shipment>[] = [

  {
    accessorKey: "from.companyTypeDescription",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className=" ">
          Đơn vận hành từ
        </Button>
      )
    },
    cell: ({ row }) => {
      return <span className="flex justify-center ">
        <HoverCard>
          <HoverCardTrigger> {limitLength(row.original.from.companyTypeDescription, 30)}</HoverCardTrigger>
          <HoverCardContent>
            <div className="max-w-sm mx-auto">
              <div className="mb-2 text-start">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên giám đốc</label>
                <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder={limitLength(row.original.from.directorName.trim(), 30)} disabled readOnly />
              </div>
              <div className="mb-2 text-start">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Địa chỉ email</label>
                <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder={limitLength(row.original.from.email.trim(), 30)} disabled readOnly />
              </div>
              <div className="mb-2 text-start">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số điện thoại</label>
                <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder={limitLength(row.original.from.directorPhone.trim(), 30)} disabled readOnly />
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </span>;
    },
  },

  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className=" ">

        </Button>
      )
    },
    cell: ({ row }) => {
      return <span className="flex justify-center ">
        <ShipmentID shipmentIDDes={row.original.id} />
      </span>;
    },
  },

  {
    accessorKey: "to.companyTypeDescription",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className=" ">
          Đơn vận hành đến
        </Button>
      )
    },
    cell: ({ row }) => {
      return <span className="flex justify-center ">
        <HoverCard>
          <HoverCardTrigger> {limitLength(row.original.to.companyTypeDescription, 30)}</HoverCardTrigger>
          <HoverCardContent>
            <div className="max-w-sm mx-auto">
              <div className="mb-2 text-start">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên giám đốc</label>
                <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder={limitLength(row.original.to.directorName.trim(), 30)} disabled readOnly />
              </div>
              <div className="mb-2 text-start">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Địa chỉ email</label>
                <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder={limitLength(row.original.to.email.trim(), 30)} disabled readOnly />
              </div>
              <div className="mb-2 text-start">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số điện thoại</label>
                <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder={limitLength(row.original.to.directorPhone.trim(), 30)} disabled readOnly />
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </span>;
    },
  },

  {
    accessorKey: "shipDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className=" ">
          Ngày nhận hàng
        </Button>
      )
    },
    cell: ({ row }) => {
      return <span className="flex justify-center ">
        {limitLength(row.original.shipDate, 30)}
      </span>;
    },
  },

  {
    accessorKey: "statusDescription",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className=" ">
          Ngày nhận hàng
        </Button>
      )
    },
    cell: ({ row }) => {
      const [valueStatus, setValueStatus] = useState<any>(0);

      const handleSelectChange = (value: any, id: string) => {
        console.log('value', value)
        setValueStatus(value)
      };
      const handleSubmitOrderStatus = () => {
        console.log('value',row.original.id,valueStatus)
      
        shipmentApi.changeStatus(row.original.id,valueStatus)
          .then(({ data }) => {
            setValueStatus(0);
            console.log("data", data)
            toast.success(data.message)
          })
      }
      return <span className="flex justify-center ">
        <AlertDialog>
          <AlertDialogTrigger>{limitLength(row.original.statusDescription, 30)}</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Đổi trạng thái đơn hàng</AlertDialogTitle>
              <AlertDialogDescription>
                <Select
                  defaultValue={String(row.original.status)}
                  onValueChange={(value) => handleSelectChange(Number(value), row.original.id)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue
                      placeholder="Hãy chọn loại đơn"
                      defaultValue={row.original.status}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {OrderStatus.map((status) => (
                      <SelectItem key={status.id} value={String(status.id)}>
                        {status.des}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Bỏ</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitOrderStatus}>Tiếp tục</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </span>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <UpdateShipment shipmentIDDes={row.original.id} />,
  },

]
