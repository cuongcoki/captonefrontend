"use client";

import { useParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";

// ** import UI
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ** import api
import { productApi } from "@/apis/product.api";

// ** import icon
import { PencilLine } from "lucide-react";
// ** component
import ImageDisplayID from "./ImageDisplayID";
import ProductUpdate from "@/components/shared/dashboard/product/table/productID/product-update";
import { ProductStore } from "@/components/shared/dashboard/product/product-store";
import HeaderComponent from "@/components/shared/common/header";

export interface ProductData {
  code: string;
  description: string;
  id: string;
  imageResponses: {
    id: string;
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
  }[];
  isInProcessing: boolean;
  name: string;
  price: number;
  size: string;
}

export default function ProductIDPage() {
  const [open, setOpen] = useState<boolean>(false);
  const handleOffDialog = () => {
    setOpen(false);
  };
  const handleOnDialog = () => {
    setOpen(true);
  };
  //state
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const [productId, setProductId] = useState<any>([]);
  const [open1, setOpen1] = useState<boolean>(false);
  const { force } = ProductStore();

  const formatCurrency = (amount: any) => {
    // Định dạng số theo tiêu chuẩn 'vi-VN'
    const formattedAmount = new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: 0,
    }).format(amount);

    // Thay đổi dấu chấm thành dấu phẩy
    return formattedAmount.replace(/\./g, ",");
  };

  useEffect(() => {
    console.log("PRODUCT ID RENDER ");
    const fetchDataProductId = () => {
      setLoading(true);
      productApi
        .getProductId(params.id)
        .then((res) => {
          const userData = res.data.data;
          setProductId(userData);
          // setUserId(res.data.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchDataProductId();
  }, [params.id, force]);

  const limitLength = (text: any, maxLength: any) => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };

  const formatValue = (value: any, maxLength: any) => {
    if (!value) return "";
    return limitLength(value, maxLength);
  };

  return (
    <>
      <HeaderComponent
        title="Chi tiết sản phẩm"
        description="Thông tin chi tiết của sản phẩm"
      />
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-primary">
                    Chi tiết sản phẩm
                  </CardTitle>
                </div>
                <ProductUpdate product={productId}>
                  <PencilLine className="rounded hover:bg-gray-200" />
                </ProductUpdate>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Label className="" htmlFor="name">
                  <div>Mã Sản Phẩm</div>
                </Label>
                <div className="grid grid-cols-10 ">
                  <div className="col-span-6 border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden truncate">
                    {productId?.code}
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="name">Tên Sản Phẩm</Label>
                  <div className="border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden truncate">
                    {productId?.name}
                  </div>
                </div>
                <div className="grid grid-cols-2 space-x-4 truncate">
                  <Label className="" htmlFor="name">
                    Giá Thành
                  </Label>
                  <Label className="" htmlFor="name">
                    Kích Thước
                  </Label>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <div className=" border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden truncate">
                    {`${Number(productId?.price).toLocaleString("vi-VN")} `}
                  </div>

                  <div className=" border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden">
                    {productId?.size}
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Mô Tả</Label>
                  <div className="border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden">
                    {productId?.description}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm gd-1">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-primary">
                    Giai đoạn sản phẩm
                  </CardTitle>
                </div>
                <ProductUpdate product={productId}>
                  <PencilLine className="rounded hover:bg-gray-200" />
                </ProductUpdate>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Giá tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">GGPC-001</TableCell>
                    <TableCell className="max-w-[300px] overflow-hidden truncate">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quis pariatur, voluptas sed hic, enim, delectus nihil sunt
                      deleniti atque repudiandae sequi animi sit obcaecati
                      doloremque commodi deserunt esse? Vero iure hic quos id
                      animi laboriosam fugit nobis, expedita voluptate
                      exercitationem eos unde ex cupiditate numquam impedit
                      officia, repellendus temporibus, illo labore assumenda
                      iste perspiciatis nihil doloribus aliquam. Accusantium
                      facere quia, hic eos rem, deserunt ipsum asperiores
                      accusamus totam nisi perferendis veniam quis vel quaerat
                      et exercitationem. Voluptatem quae reprehenderit voluptate
                      ducimus, aliquam, ipsa corporis totam ipsam natus pariatur
                      molestiae unde consequatur consequuntur earum. Voluptatum
                      vitae modi pariatur ipsa eligendi corporis?
                    </TableCell>
                    <TableCell>
                      <Label htmlFor="stock-1" className="sr-only">
                        Stock
                      </Label>
                      <Input id="stock-1" type="number" defaultValue="100" />
                    </TableCell>
                    <TableCell>
                      <Label htmlFor="price-1" className="sr-only">
                        Price
                      </Label>
                      <Input id="price-1" type="number" defaultValue="99.99" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 ">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">
                Trạng thái sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 col-span-4 mx-auto">
                <Label className="flex gap-x-3 items-center" htmlFor="status">
                  <div className="">Trạng Thái</div>
                  <div className="">
                    <span
                      className={`w-[40%] px-2 py-2 rounded-full ${
                        productId?.isInProcessing
                          ? "bg-primary text-white"
                          : "bg-yellow-200 text-black"
                      }`}
                    >
                      {productId?.isInProcessing ? "Đang xử lý" : "Chưa xử lý"}
                    </span>
                  </div>
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Hình ảnh</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageDisplayID images={productId.imageResponses} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
