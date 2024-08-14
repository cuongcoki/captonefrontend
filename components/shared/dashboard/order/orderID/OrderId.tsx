"use client";
// ** import UI
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";



import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ** import REACT
import Image from "next/image";
import { useEffect, useState } from "react";
import { orderApi } from "@/apis/order.api";
import { useParams } from "next/navigation";

// ** import Components
import { NoImage } from "@/constants/images";
import UpdateOrder from "../form/UpdateOrder";
import { UpdateOrderDetails } from "../form/UpdateOrderDetail";
import { ShipOrder } from "./shipOrder/ShipOrder";
import TitleComponent from "@/components/shared/common/Title";
import HeaderComponent from "@/components/shared/common/header";
import { OrderStore } from "../order-store";
import HoverComponent from "@/components/shared/common/hover-card";

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
    valueString = valueString.replace(/\D/g, "");
    valueString = valueString.replace(/^0+/, "");
    if (valueString === "") return "0";
    let reversed = valueString.split("").reverse().join("");
    let formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";
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

        <div className="grid sm:grid-cols-1 md:grid-cols-9 gap-6">
          <Card className="sm:col-span-1 md:col-span-9 lg:col-span-3 shadow-sm">
            <CardHeader>
              <TitleComponent
                title="Thông tin công ty"
                description={`Thông tin công ty đặt hàng - ${data?.company.name}`}
              />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Tên công ty:</span>
                  <span >
                    {data?.company.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Địa chỉ công ty:</span>
                  <span >
                    <HoverComponent Num={25}>
                    {data?.company.address}
                    </HoverComponent>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">
                    Loại công ty:
                  </span>
                  <span >
                    {data?.company.companyTypeDescription}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-1 md:col-span-9 lg:col-span-3 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center ">
                <TitleComponent
                  title="Thông tin giám đốc"
                  description={`Thông tin giám đốc công ty - ${data?.company.name}`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Tên giám đốc:</span>
                  <span >
                    {data?.company.directorName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">
                    Địa chỉ gmail:
                  </span>
                  <span >
                    {data?.company.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Điện thoại:</span>
                  <span > {data?.company.directorPhone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-1 md:col-span-9 lg:col-span-3 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center ">
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

          <Card className="sm:col-span-1 md:col-span-9 shadow-sm overflow-auto">
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