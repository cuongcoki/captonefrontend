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

// ** import REACT
import Image from "next/image";
import { useEffect, useState } from "react";
import { orderApi } from "@/apis/order.api";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

// ** import Components
import { NoImage } from "@/constants/images";
import UpdateOrder from "../form/UpdateOrder";
import { UpdateOrderDetails } from "../form/UpdateOrderDetail";
import { Badge } from "@/components/ui/badge";
import { Building2, Copy, CreditCard, MoreVertical, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ShipOrder } from "./shipOrder/ShipOrder";
import TitleComponent from "@/components/shared/common/Title";
import HeaderComponent from "@/components/shared/common/header";

interface OrderId {
  orderId?: string;
}
interface OrderIdData {
  orderId: string;
  productOrderResponses: productOrderResponses[];
  setOrderResponses: setOrderResponses[];
}

interface productOrderResponses {
  productId: string;
  productCode: string;
  productName: string;
  productDescription: string;
  imageProductUrl: string;
  quantity: number;
  unitPrice: number;
  shippedQuantiy: number;
  note: number;
}
interface setOrderResponses {
  setId: string;
  setName: string;
  setCode: string;
  setDescription: string;
  imageSetUrl: string;
  productResponses: productResponses[];
  quantity: number;
  unitPrice: number;
  shippedQuantiy: number;
  note: number;
}
interface productResponses {
  id: string;
  name: string;
  code: string;
  price: number;
  size: number;
  description: string;
  isInProcessing: boolean;
  imageResponses: imageResponses[];
}
interface imageResponses {
  id: string;
  imageUrl: string;
  isBluePrint: boolean;
  isMainImage: boolean;
}

interface orderIds {
  id: string;
  companyId: string;
  company: {
    id: string;
    name: string;
    address: string;
    directorName: string;
    directorPhone: string;
    email: string;
    companyEnum: string;
    companyType: number;
    companyTypeDescription: string;
  };
  status: number;
  statusType: string;
  statusDescription: string;
  startOrder: string;
  endOrder: string;
  vat: number;
}

export default function OrderIdPage({ orderId }: OrderId) {
  //state
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<orderIds>();
  const [dataId, setDataId] = useState<OrderIdData>({
    orderId: "",
    productOrderResponses: [],
    setOrderResponses: [],
  });
  // console.log("data=====", data);
  // console.log("data=====", dataId);
  // console.log('ssssssssssssssssssssssssssssssss', params.id)
  useEffect(() => {
    const fetchDataOrderId = () => {
      setLoading(true);
      orderApi
        .getOrderId(params.id)
        .then(({ data }) => {
          const orderData = data.data;
          setData(orderData);
        })
        .catch((error) => {
          toast.error("ko thấy ");
        })
        .finally(() => {
          setLoading(false);
        });
    };
    const fetchDataOrderIds = () => {
      setLoading(true);
      orderApi
        .getOrderDetailsId(params.id)
        .then(({ data }) => {
          const orderData = data.data;
          setDataId(orderData);
        })
        .catch((error) => {
          toast.error("ko thấy ");
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchDataOrderIds();
    fetchDataOrderId();
  }, [data, dataId, params.id]);

  const [checkStatus, setCheckStatus] = useState<number>();
  useEffect(() => {
    setCheckStatus(data?.status);
  }, [data?.status]);

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

  const formatDate = (date: string) => {
    const data = date?.split("-");
    if (!data) return "";
    return `${data[2]}/${data[1]}/${data[0]}`;
  };

  return (
    <>
      <HeaderComponent
        title="Chi tiết đơn hàng"
        description="Thông tin chi tiết của đơn hàng."
      />
      <div className="flex flex-col gap-8">

        <div className="grid sm:grid-cols-1 md:grid-cols-10 gap-6">
          <Card className="sm:col-span-1 md:col-span-10 lg:col-span-7 shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Thông tin Công ty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-col-6">
                <div className="col-span-2 flex items-center gap-4 ">
                  <Building2 className="h-10 w-10" />
                  <span className="text-xl font-medium">
                    {data?.company.name}
                  </span>
                </div>

                <div className="divide-x-2 divide-gray-300 grid grid-cols-6 gap-4 items-start text-sm xl:flex-row  xl:space-y-0 md:border-t-2 p-2 border-t-0">
                  <div className="col-span-2 flex flex-col space-y-1 sm:w-[300px] w-full p-2  h-full">
                    <div className="text-lg font-medium">Địa chỉ công ty</div>
                    <div>{data?.company.address}</div>
                  </div>

                  <div className="flex flex-col space-y-1 p-2 h-full">
                    <div className="text-lg font-medium">Loại công ty</div>
                    <div>{data?.company.companyTypeDescription}</div>
                  </div>

                  <div className="flex flex-col space-y-1 p-2 h-full">
                    <div className="text-lg font-medium">Tên giám đốc</div>
                    <div>{data?.company.directorName}</div>
                  </div>

                  <div className="flex flex-col space-y-1 p-2 h-full">
                    <div className="text-lg font-medium">Liên hệ</div>
                    <div className="">{data?.company.directorPhone}</div>
                  </div>

                  <div className="flex flex-col space-y-1 p-2 h-full">
                    <div className="text-lg font-medium">Email</div>
                    <div>{data?.company.email}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-1 md:col-span-10 lg:col-span-3 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center ">
                <CardTitle className="text-primary">Đơn hàng chi tiết</CardTitle>
                <UpdateOrder orderId={data} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 ">Trạng thái:</span>
                  <span className={`
  ${data?.status === 0 ? "text-yellow-500 font-semibold" : ""}
  ${data?.status === 1 ? "text-blue-500 font-semibold" : ""}
  ${data?.status === 2 ? "text-green-500 font-semibold" : ""}
  ${data?.status === 3 ? "text-red-500 font-semibold" : ""}
`}>
                    {data?.statusDescription}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Ngày bắt đầu:</span>
                  <span className="text-gray-800">
                    {formatDate(data?.startOrder as string)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Ngày kết thúc:
                  </span>
                  <span className="text-gray-800">
                    {formatDate(data?.endOrder as string)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">VAT:</span>
                  <span className="text-gray-800">{data?.vat}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-1 md:col-span-10 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center ">
                <CardTitle className="text-primary">Sản phẩm chi tiết</CardTitle>

                {checkStatus === 0 || checkStatus === 1 ? <UpdateOrderDetails orderId={dataId} /> : ""}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="productOrderResponses" className="">
                <TabsList className="grid grid-cols-2 w-[250px]">
                  <TabsTrigger value="productOrderResponses">
                    Sản phẩm
                  </TabsTrigger>
                  <TabsTrigger value="setOrderResponses">Bộ sản phẩm</TabsTrigger>
                </TabsList>
                <TabsContent value="productOrderResponses">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sản phẩm</CardTitle>
                      <CardDescription>
                        Hãy xem chi tiết sản phẩm bằng cách bấm vào ảnh
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Table className="w-full overflow-x-auto">
                        <TableCaption>Sản phẩm trong đơn hàng</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">ảnh</TableHead>
                            <TableHead className="hidden sm:table-cell">
                              Tên sản phẩm
                            </TableHead>
                            <TableHead className="hidden sm:table-cell">
                              Mã sản phẩm
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Mô tả
                            </TableHead>
                            <TableHead>Số lượng</TableHead>
                            <TableHead>Hàng đã giao</TableHead>
                            <TableHead>Đơn vị giá</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Ghi chú
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dataId.productOrderResponses.map((item) => (
                            <TableRow key={item.productId}>
                              <TableCell>
                                <Image
                                  src={
                                    item.imageProductUrl === "No Image"
                                      ? NoImage
                                      : item.imageProductUrl
                                  }
                                  width={900}
                                  height={900}
                                  alt="ảnh sản phẩm"
                                  className="w-[50px] h-[50px] object-contain shadow-md rounded-sm"
                                />
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {item.productName}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {item.productCode}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {item.productDescription}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(item.quantity)}
                              </TableCell>
                              <TableCell>
                                {item.shippedQuantiy}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(item.unitPrice)}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {item.note}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="setOrderResponses">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bộ sản phẩm</CardTitle>
                      <CardDescription>
                        Hãy xem chi tiết sản phẩm bằng cách bấm vào ảnh
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Table className="w-full overflow-x-auto">
                        <TableCaption>Bộ sản phẩm trong đơn hàng</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">ảnh</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Mã sản phẩm</TableHead>
                            <TableHead>mô tả</TableHead>
                            <TableHead>Số lượng</TableHead>
                            <TableHead>Hàng đã giao</TableHead>
                            <TableHead>Đơn vị giá</TableHead>
                            <TableHead>Ghi chú</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dataId.setOrderResponses.map((item) => (
                            <TableRow key={item.setId}>
                              <TableCell>
                                <Image
                                  src={
                                    item.imageSetUrl === "No Image"
                                      ? NoImage
                                      : item.imageSetUrl
                                  }
                                  width={900}
                                  height={900}
                                  alt="ảnh sản phẩm"
                                  className="w-[50px] h-[50px] object-contain shadow-md rounded-sm"
                                />
                              </TableCell>
                              <TableCell>{item.setName}</TableCell>
                              <TableCell>{item.setCode}</TableCell>
                              <TableCell>{item.setDescription}</TableCell>
                              <TableCell>
                                {formatCurrency(item.quantity)}
                              </TableCell>
                              <TableCell>
                                {item.shippedQuantiy}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(item.unitPrice)}
                              </TableCell>
                              <TableCell>{item.note}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <ShipOrder orderId={dataId} checkStatus={checkStatus} />
      </div>
    </>
  );
}

{
  /* <div className="flex justify-between items-center gap-8 text-xl">

<div className="flex flex-col gap-5">
    <div className="flex  justify-between items-center">
        <span className="font-medium text-gray-600">Tên công ty: </span>
        <span className="text-gray-800 text-lg">{data?.company.name}</span>
    </div>

    <div className="flex  justify-between items-center">
        <span className="font-medium text-gray-600">Địa chỉ: </span>
        <span className="text-gray-800 text-lg">{data?.company.address}</span>
    </div>

    <div className="flex  justify-between items-center">
        <span className="font-medium text-gray-600">Loại công ty: </span>
        <span className="text-gray-800 text-lg">{data?.company.companyTypeDescription}</span>
    </div>
</div>

<div className="flex flex-col gap-5">

    <div className="flex justify-between items-center">
        <span className="font-medium text-gray-600">Tên giám đốc: </span>
        <span className="text-gray-800 text-lg">{data?.company.directorName}</span>
    </div>
    <div className="flex justify-between items-center">
        <span className="font-medium text-gray-600">Số điện thoại: </span>
        <span className=" flex justify-center text-red-500 text-lg">{data?.company.directorPhone}</span>
    </div>
    <div className="flex  justify-between items-center">
        <span className="font-medium text-gray-600">Email: </span>
        <span className="text-gray-800 text-lg">{data?.company.email}</span>
    </div>
</div>



</div> */
}
