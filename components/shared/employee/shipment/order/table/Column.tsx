"use client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ShipperOrderDetail } from "../orderID/shipperOrderDetail";
import ChangeStatusShipOrderEm from "../orderID/changeStatusShipOrderEm";

type ToCompany = {
  address: string;
  companyEnum: string;
  companyType: number;
  companyTypeDescription: string;
  directorName: string;
  directorPhone: string;
  email: string;
  id: string;
  name: string;
};

export type ShipOrderShipper = {
  deliveryMethod: number;
  deliveryMethodDescription: string;
  shipDate: string; // ISO 8601 format, could also use Date if you intend to parse it
  shipOrderId: string;
  status: number;
  statusDescription: string;
  toCompany: ToCompany
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
    accessorKey: "toCompany.name",
    header: ({ column }) => {
      return <Button variant="ghost">Công ty nhận hàng</Button>;
    },
    cell: ({ row }) => {
      return <span className="flex justify-center ">
        <HoverCard>
          <HoverCardTrigger>
            {" "}
            {limitLength(row.original.toCompany.name, 30)}
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
                    row.original.toCompany.directorName.trim(),
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
                    row.original.toCompany.email.trim(),
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
                    row.original.toCompany.directorPhone.trim(),
                    30
                  )}
                  disabled
                  readOnly
                />
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </span>;
    },
  },


  {
    accessorKey: "deliveryMethodDescription",
    header: ({ column }) => {
      return <Button variant="ghost">Loại đơn hàng</Button>;
    },
    cell: ({ row }) => {
      return <span>{row.original.deliveryMethodDescription}</span>;
    },
  },

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
      return <Button variant="ghost">Ngày giao hàng</Button>;
    },
    cell: ({ row }) => {
      return <span>{formatDate(row.original.shipDate)}</span>;
    },
  },


];
