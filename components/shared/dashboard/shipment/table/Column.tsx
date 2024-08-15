"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ShipmentID } from "../shipmentID/ShipmentID";

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
import { shipmentApi } from "@/apis/shipment.api";
import toast from "react-hot-toast";
import { ChangeStatusShipment } from "../form/ChangeStatusShipment";
import { DataTableRowActions } from "./data-table-row-actions";
import { ShipmentStore } from "../shipment-store";

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
  shipDate: string;
  id: string;
  statusDescription: string;
  status: number;
  isAccepted: boolean;
};
const limitLength = (text: any, maxLength: any) => {
  if (text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`;
  }
  return text;
};

export const columns: ColumnDef<Shipment>[] = [
  {
    accessorKey: "from.companyTypeDescription",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className=" ">
          Công ty gửi
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="flex justify-center ">
          <HoverCard>
            <HoverCardTrigger>
              {" "}
              {limitLength(row.original.from.name, 30)}
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="max-w-sm mx-auto">
                <div className="mb-2 text-start">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Người đại diện
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
          Công ty nhận
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="flex justify-center ">
          <HoverCard>
            <HoverCardTrigger>
              {" "}
              {limitLength(row.original.to.name, 30)}
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="max-w-sm mx-auto">
                <div className="mb-2 text-start">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Người đại diện
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
          Ngày vận đơn
        </Button>
      );
    },
    cell: ({ row }) => {
      function formatDate(isoString: string) {
        const date = new Date(isoString);
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
      }
      return (
        <span className="flex justify-center ">
          {formatDate(row.original.shipDate)}
        </span>
      );
    },
  },

  {
    accessorKey: "statusDescription",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className=" ">
          Trạng thái đơn
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          {row.original.isAccepted === false ? (
            <span className="flex justify-center">
              <ChangeStatusShipment shipmentID={row.original} />
            </span>
          ) : row.original.status !== 2 && row.original.status !== 3 ? (
            <span className="flex justify-center">
              <ChangeStatusShipment shipmentID={row.original} />
              {/* {limitLength(row.original.statusDescription, 30)} */}
            </span>
          ) : (
            <span className="flex justify-center">
              {row.original.statusDescription}
            </span>
          )}
        </>
      );
    },
  },

  {
    accessorKey: "id",
    header: ({ column }) => {
      return <Button variant="ghost" className=" "></Button>;
    },
    cell: ({ row }) => {
      const { ForceRender } = ShipmentStore();
      const handleAcceptShipment = () => {
        console.log(row.original.id);
        shipmentApi
          .isAcceptedShipment(row.original.id, true)
          .then(({ data }) => {
            ForceRender();
            toast.success(data.message);
          })
          .catch((error) => {
            if (error.response.data.error) {
              for (const key in error.response.data.error) {
                toast.error(error.response.data.error[key][0]);
              }
            } else {
              toast.error(error.response.data.message);
            }
          });
      };

      return (
        <>
          {row.original.isAccepted === false ? (
            <span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={
                      row.original.status !== 2 && row.original.status !== 3
                    }
                    className="bg-yellow-500 hover:bg-yellow-500/80"
                  >
                    Xác nhận
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Bạn có hoàn toàn chắc chắn không?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn sẽ không thể chỉnh sửa hay bất kỳ thao tác gì cho đơn
                      hàng này nữa, bạn chắc chắn chứ
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
          ) : (
            <span>
              {row.original.isAccepted === true
                ? "Đã xác nhận đơn hàng"
                : "Chưa xác nhận đơn hàng"}
            </span>
          )}
        </>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <>
        {
          row.original.isAccepted === false ? (
            <DataTableRowActions row={row} />
          ) : (
            ""
          )
        }
      </>
    ),
  },
];
