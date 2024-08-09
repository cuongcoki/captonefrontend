"use client";
// ** import UI
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as Dialog from "@radix-ui/react-dialog";

// ** import REACT
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ** import Components
import { NoImage } from "@/constants/images";
import { Badge } from "@/components/ui/badge";
import { Mail, MoreVertical, Phone, Truck, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { shipmentApi } from "@/apis/shipment.api";
import { format } from "date-fns";
import ImageIconShipment from "./ImageIconShipment";
import Link from "next/link";
import ImageIconShipmentMa from "./ImageIconShipmentMa";

interface ImageResponse {
  id: string;
  imageUrl: string;
  isBluePrint: boolean;
  isMainImage: boolean;
}

interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  size: string;
  description: string;
  isInProcessing: boolean;
  imageResponses: ImageResponse[];
}

interface Phase {
  id: string;
  name: string;
  description: string;
}

export type Material = {
  id: string
  name: string;
  description: string;
  unit: string;
  quantityPerUnit: number;
  image: string;
  quantityInStock: number;
}



export interface Detail {
  product: Product;
  phase: Phase;
  material: Material;
  quantity: number;
  productPhaseType: number;
  materialPrice: number;
  productPhaseTypeDescription: string;
}

interface Company {
  id: string;
  name: string;
  address: string;
  directorName: string;
  directorPhone: string;
  email: string;
  companyEnum: string;
  companyType: number;
  companyTypeDescription: string;
}

interface Shipper {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  avatar: string;
  gender: string;
  dob: string;
  isActive: boolean;
  roleId: number;
  roleDescription: string;
  companyName: string;
  companyId: string;
}

interface shipmentID {
  from: Company;
  to: Company;
  shipper: Shipper;
  shipDate: string;
  statusDescription: string;
  status: number;
  details: Detail[];
}

interface ShipmentIDProps {
  shipmentIDDes: string;
}

export const ShipmentID: React.FC<ShipmentIDProps> = ({ shipmentIDDes }) => {
  //state
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<shipmentID>();
  const [open, setOpen] = useState<boolean>(false);
  const handleOffDialog = () => {
    setOpen(false);
  };
  const handleOnDialog = () => {
    setOpen(true);
  };

  useEffect(() => {
    const fetchDataOrderId = () => {
      setLoading(true);
      shipmentApi
        .getShipmentID(shipmentIDDes)
        .then(({ data }) => {
          const orderData = data.data;
          console.log("SHIPMENT DETAIL", orderData);
          setData(orderData);
        })
        .catch((error) => {
          // toast.error("ko thấy ");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchDataOrderId();
  }, [data, shipmentIDDes]);

  // các hàm hiển thị sao cho oke
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
  const limitLength = (text: any, maxLength: any) => {
    if (text?.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };
  const formatCurrency = (value: any): string => {
    if (!value) return "";
    let valueString = value.toString();

    // Remove all non-numeric characters, including dots
    valueString = valueString.replace(/\D/g, "");

    // Remove leading zeros
    valueString = valueString.replace(/^0+/, "");

    if (valueString === "") return "0";

    // Reverse the string to handle grouping from the end
    let reversed = valueString.split("").reverse().join("");

    // Add dots every 3 characters
    let formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";

    // Reverse back to original order
    let formatted = formattedReversed.split("").reverse().join("");

    return formatted;
  };
  // console.log("datashipment=====", data)
  return (
    <>
      <Dialog.Root open={open} onOpenChange={handleOnDialog}>
        <Dialog.Trigger className="rounded p-2 hover:bg-[#2bff7e] bg-[#24d369] ">
          <Truck />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
            <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2 max-w-[600px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
              <Dialog.Title></Dialog.Title>
              <Dialog.Description></Dialog.Description>
              <div className="bg-slate-100 flex flex-col overflow-y-auto space-y-4 rounded-md">
                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md ">
                  <h2 className="text-2xl text-white">Thông Tin Đơn Vận Chuyển</h2>
                  <Button variant="outline" size="icon" onClick={handleOffDialog}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid  p-4 overflow-y-auto max-h-[750px] gap-4">
                  <Card
                    className="overflow-hidden"
                    x-chunk="dashboard-05-chunk-4"
                  >
                    <CardHeader className="flex flex-row items-start bg-muted/50">
                      <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                          Thông tin vận chuyển
                        </CardTitle>
                        <CardDescription>
                          Ngày:{" "}
                          {data?.shipDate ? formatDate(data.shipDate) : "N/A"}
                        </CardDescription>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1"
                        >
                          <Truck />
                          <span className="ml-1 text-[15px]">
                            {data?.statusDescription}
                          </span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 text-sm">
                      <div className="grid gap-3">
                        <div className="font-semibold">Mặt hàng vận chuyển</div>
                        <ul className="grid gap-3">
                          {data?.details.map((item, index) => (
                            <li
                              className="p-2 shadow-sm hover:bg-gray-100/90 cursor-pointer"
                              key={index}
                            >
                              <span className="text-muted-foreground flex justify-between items-center mb-1">
                                {item?.product ? (
                                  <>
                                    <span className="w-[50px] h-[50px] shadow-md rounded-md">
                                      <Link
                                        href={`/dashboard/products/product/${item?.product?.id}`}
                                      >
                                        {" "}
                                        <ImageIconShipment
                                          dataImage={item?.product?.imageResponses}
                                        />{" "}
                                      </Link>
                                    </span>
                                    <span>{item?.product?.code}</span>
                                    <span>{item?.product?.name}</span>
                                  </>
                                ) : item?.material ? (
                                  <>
                                    <span className="w-[50px] h-[50px] shadow-md rounded-md">
                                      <ImageIconShipmentMa dataImage={item?.material?.image} />
                                    </span>
                                    <span>{item?.material?.name}</span>
                                    <span>{item?.material?.unit}</span>
                                  </>
                                ) : null}
                                <span>x</span>
                                <span>{item?.quantity}</span>
                              </span>
                              <div className="flex gap-2">
                                <span className="text-muted-foreground flex justify-between items-center">
                                  {item?.product ? "Sản phẩm: " : "Vật liệu: "}
                                </span>
                                <span className="text-muted-foreground flex justify-between items-center">
                                  {item.material && (`${formatCurrency(item?.materialPrice)} đ`)}
                                </span>
                                <span className="text-muted-foreground flex justify-between items-center">
                                  {item.product && (`${item?.phase?.name}`)}
                                </span>
                                <span className="text-muted-foreground flex justify-between items-center">
                                  {item.product && (`- ${item?.phase?.description}`)}
                                </span>
                                <span className="text-muted-foreground flex justify-between items-center">
                                  {item.product && (`- ${item?.productPhaseTypeDescription}`)}
                                </span>

                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                          <div className="font-semibold">
                            Nhân viên vận chuyển
                          </div>
                          <address className="grid gap-0.5 not-italic text-muted-foreground">
                            <Link
                              href={`/profile/${data?.shipper.id}`}
                              className="hover:underline"
                            >
                              <span>
                                {data?.shipper.lastName}{" "}
                                {data?.shipper.firstName} -{" "}
                                {data?.shipper.companyName}
                              </span>
                            </Link>
                            <span>{data?.shipper.address}</span>
                            <span>{data?.shipper.phone}</span>
                          </address>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid gap-3">
                        <div className="font-semibold">
                          Công ty gửi hàng
                        </div>
                        <dl className="grid gap-1">
                          <div className="flex flex-col  sm:flex-row sm:items-center justify-between">
                            <dt className="text-muted-foreground">
                              Tên công ty
                            </dt>
                            <dd>{data?.from.companyTypeDescription}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <dt className="text-muted-foreground">
                              Tên giám đốc
                            </dt>
                            <dd>{data?.from.directorName}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <dt className="text-muted-foreground">Địa chỉ</dt>
                            <dd>
                              <a href="mailto:">{limitLength(data?.from.address, 20)}</a>
                            </dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <dt className="text-muted-foreground">Liện hệ</dt>
                            <dd className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" /> <a href="mailto:">{data?.from.email === "" ? "Không có" : data?.from.email}</a>
                            </dd>
                            <dd className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" /> <a href="tel:">{data?.from.directorPhone}</a>
                            </dd>
                          </div>

                        </dl>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid gap-3">
                        <div className="font-semibold">
                          Công ty nhận hàng
                        </div>
                        <dl className="grid gap-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <dt className="text-muted-foreground">
                              Tên công ty
                            </dt>
                            <dd>{data?.to.companyTypeDescription}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <dt className="text-muted-foreground">
                              Tên giám đốc
                            </dt>
                            <dd>{data?.to.directorName}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <dt className="text-muted-foreground">Địa chỉ</dt>
                            <dd>
                              <a href="mailto:">{limitLength(data?.to.address, 20)}</a>
                            </dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <dt className="text-muted-foreground">Liện hệ</dt>
                            <dd className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" /> <a href="mailto:">{data?.to.email === "" ? "Không có" : data?.to.email}</a>
                            </dd>
                            <dd className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" /> <a href="tel:">{data?.to.directorPhone}</a>
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <Separator className="my-4" />

                    </CardContent>

                    <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                      <div className="text-xs text-muted-foreground">
                        Công ty mây tre đan Tiến Huy
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
