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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
import { OrderStore } from "../order-store";

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
  const { force } = OrderStore();

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
          // toast.error("ko thấy ");
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
          // toast.error("ko thấy ");
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchDataOrderIds();
    fetchDataOrderId();
  }, [data, dataId, params.id, force]);

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
    const reversed = valueString.split("").reverse().join("");

    // Add dots every 3 characters
    const formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";

    // Reverse back to original order
    const formatted = formattedReversed.split("").reverse().join("");

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
              <TitleComponent
                title="Thông tin công ty"
                description="Thông tin công ty đặt hàng."
              />
            </CardHeader>
            <CardContent>
              <div className="grid grid-col-6 gap-2">
                <div className="col-span-2 flex items-center gap-4 ">
                  <Building2 className="h-10 w-10" />
                  <span className="text-xl font-medium">
                    {data?.company.name}
                  </span>
                </div>

                <div className="hidden  md:flex gap-6">

                  <Card className="w-full xl:w-[250px] h-[130px] overflow-auto shadow-md shadow-primary/50">
                    <div className="flex items-center justify-center flex-col gap-2 p-2">
                      <h2 className="font-semibold text-lg">Địa chỉ công ty</h2>
                      <span className="text-center">
                        {data?.company.address}
                      </span>
                    </div>
                  </Card>

                  <Card className="w-full xl:w-[250px] h-[130px] overflow-auto shadow-md shadow-primary/50">
                    <div className="flex items-center justify-center flex-col gap-2 p-2">
                      <h2 className="font-semibold text-lg">Loại công ty</h2>
                      <span className="text-center">
                        {data?.company.companyTypeDescription}
                      </span>
                    </div>
                  </Card>

                  <Card className="w-full xl:w-[250px] h-[130px] overflow-auto shadow-md shadow-primary/50">
                    <div className="flex items-center justify-center flex-col gap-2 p-2">
                      <h2 className="font-semibold text-lg">Thông tin giám đốc</h2>
                      <div className="flex flex-col overflow-auto">
                        <span >
                          Tên: {data?.company.directorName}
                        </span>
                        <span >
                          Số điện thoại:  {data?.company.directorPhone}
                        </span>
                        <span >
                          Địa chỉ Gmail: {data?.company.email === "" ? "Không có" : data?.company.email}
                        </span>
                      </div>
                    </div>
                  </Card>

                </div>

                <div className="md:hidden flex gap-6">
                  <Popover>
                    <PopoverTrigger className="p-1 shadow-md shadow-primary/50 text-sm">Địa chỉ công ty</PopoverTrigger>
                    <PopoverContent>
                      <span className="text-center">
                        {data?.company.address}
                      </span>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger className="p-1 shadow-md shadow-primary/50 text-sm">Loại công ty</PopoverTrigger>
                    <PopoverContent>
                      <span className="text-center">
                        {data?.company.companyTypeDescription}
                      </span>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger className="p-1 shadow-md shadow-primary/50 text-sm">Thông tin giám đốc</PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-2">
                      <span className="text-center">
                        {data?.company.directorName}
                      </span>
                      <span className="text-center">
                        {data?.company.directorPhone}
                      </span>
                      <span className="text-center">
                        {data?.company.email}
                      </span>
                    </PopoverContent>
                  </Popover>


                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-1 md:col-span-10 lg:col-span-3 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center ">
                {/* <CardTitle className="text-primary">Đơn hàng chi tiết</CardTitle> */}
                <TitleComponent
                  title="Thông tin đơn hàng"
                  description="Thông tin trạng thái - thuế - thời gian đặt hàng."
                />
                <UpdateOrder orderId={data} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Trạng thái:</span>
                  <span className={`
  ${data?.status === 0 ? "text-[#94a3b8] font-semibold" : ""}
  ${data?.status === 1 ? "text-blue-500 font-semibold" : ""}
  ${data?.status === 2 ? "text-green-500 font-semibold" : ""}
  ${data?.status === 3 ? "text-red-500 font-semibold" : ""}
`}>
                    {data?.statusDescription}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ngày bắt đầu:</span>
                  <span >
                    {formatDate(data?.startOrder as string)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">
                    Ngày kết thúc:
                  </span>
                  <span >
                    {formatDate(data?.endOrder as string)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Thuế:</span>
                  <span >{data?.vat}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-1 md:col-span-10 shadow-sm overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-center ">
                <TitleComponent
                  title="Danh sách mặt hàng"
                  description="Danh sách các sản phẩm - bộ sản phẩm được đặt trong đơn hàng."
                />
                {checkStatus === 0 || checkStatus === 1 ? <UpdateOrderDetails orderId={dataId} /> : ""}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="productOrderResponses" className="">
                <TabsList className="grid grid-cols-2 w-[250px]">
                  <TabsTrigger value="productOrderResponses" className="data-[state=active]:shadow-lg">
                    Sản phẩm
                  </TabsTrigger>
                  <TabsTrigger value="setOrderResponses" className="data-[state=active]:shadow-lg">Bộ sản phẩm</TabsTrigger>
                </TabsList>
                <TabsContent value="productOrderResponses">
                  <Card>
                    <CardHeader>
                      <TitleComponent
                        title="Sản phẩm"
                        description="Hãy xem chi tiết sản phẩm bằng cách bấm vào ảnh."
                      />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Table className="w-full overflow-x-auto">
                        <TableCaption>Sản phẩm trong đơn hàng</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px] text-center">Hình ảnh</TableHead>
                            <TableHead className="hidden sm:table-cell text-center">
                              Mã sản phẩm
                            </TableHead>
                            <TableHead className="hidden sm:table-cell text-center">
                              Tên sản phẩm
                            </TableHead>
                            <TableHead className="text-center">Số lượng đặt</TableHead>
                            <TableHead className="text-center">Hàng đã giao</TableHead>
                            <TableHead className="text-center">Đơn giá</TableHead>
                            <TableHead className="hidden md:table-cell text-center">
                              Ghi chú
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dataId.productOrderResponses.map((item) => (
                            <TableRow key={item.productId}>
                              <TableCell className="flex justify-center">
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
                              <TableCell className="hidden sm:table-cell text-center">
                                {item.productCode}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell text-center">
                                {item.productName}
                              </TableCell>
                              <TableCell className="text-center">
                                {formatCurrency(item.quantity)}
                              </TableCell>
                              <TableCell className="text-center">
                                {item.shippedQuantiy}
                              </TableCell>
                              <TableCell className="text-center">
                                {formatCurrency(item.unitPrice)}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-center">
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
                      <TitleComponent
                        title="Bộ sản phẩm"
                        description="Hãy xem chi tiết bộ sản phẩm bằng cách bấm vào ảnh."
                      />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Table className="w-full overflow-x-auto">
                        <TableCaption>Bộ sản phẩm trong đơn hàng</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px] text-center">Hình ảnh</TableHead>
                            <TableHead className="text-center">Mã bộ sản phẩm</TableHead>
                            <TableHead className="text-center">Tên bộ sản phẩm</TableHead>
                            <TableHead className="text-center">Số lượng đặt</TableHead>
                            <TableHead className="text-center">Hàng đã giao</TableHead>
                            <TableHead className="text-center">Đơn giá</TableHead>
                            <TableHead className="text-center">Ghi chú</TableHead>
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
                              <TableCell className="text-center">{item.setCode}</TableCell>
                              <TableCell className="text-center">{item.setName}</TableCell>
                              <TableCell className="text-center">
                                {formatCurrency(item.quantity)}
                              </TableCell>
                              <TableCell className="text-center">
                                {item.shippedQuantiy}
                              </TableCell>
                              <TableCell className="text-center">
                                {formatCurrency(item.unitPrice)}
                              </TableCell>
                              <TableCell className="text-center">{item.note}</TableCell>
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