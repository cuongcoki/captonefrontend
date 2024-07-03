"use client";

import { useParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";

// ** import UI
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ** import api
import { productApi } from "@/apis/product.api";

// ** import icon
import { PencilLine } from "lucide-react";
// ** component
import ImageDisplayID from "./ImageDisplayID";
import ProductUpdate from "@/components/shared/dashboard/product/table/productID/product-update";

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
type ContexType = {
  forceUpdate: () => void;
};
export const MyContext = createContext<ContexType>({
  forceUpdate: () => {},
});
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
  const [force, setForce] = useState<number>(1);

  const forceUpdate = () => setForce((prev) => prev + 1);
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
    <div className="flex flex-col justify-center ">
      <header className="">
        <div className="flex items-center gap-4 justify-between">
          {/* <Link href={'/dashboard/products/product'}>
                        <Button variant="outline" size="icon" className="h-7 w-7">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Button>
                    </Link>
                    */}
          <div className=" items-center gap-2 md:ml-auto md:flex"></div>
        </div>
      </header>

      <MyContext.Provider value={{ forceUpdate }}>
        <div className="w-full h-full bg-white p-2 rounded-lg shadow-md dark:bg-card">
          <div className="p-4 grid md:grid-cols-2 grid-cols-1  gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh sản phẩm</CardTitle>
                <CardDescription>
                  đây là hình ảnh sản phẩm, bạn có thể thay đổi giá trị
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4 justify-center">
                <Card className="max-w-[500px] md:w-full">
                  <ImageDisplayID images={productId.imageResponses} />
                </Card>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Chi tiết sản phẩm</CardTitle>
                    <CardDescription>
                      đây là sản phẩm chi tiết, bạn có thể thay đổi giá trị
                    </CardDescription>
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
                    <div className="col-span-6 border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden">
                      {productId?.code}
                    </div>

                    <div className="grid gap-3 col-span-4 mx-auto">
                      <Label
                        className="flex gap-x-3 items-center"
                        htmlFor="status"
                      >
                        <div className="">Trạng Thái</div>
                        <div className="">
                          <span
                            className={`w-[40%] px-2 py-2 rounded-full ${
                              productId?.isInProcessing
                                ? "bg-primary"
                                : "bg-yellow-200 text-black"
                            }`}
                          >
                            {productId?.isInProcessing
                              ? "Đang xử lý"
                              : "Chưa xử lý"}
                          </span>
                        </div>
                      </Label>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Tên Sản Phẩm</Label>
                    <div className="border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden">
                      {productId?.name}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 space-x-4">
                    <Label className="" htmlFor="name">
                      Thành Tiền
                    </Label>
                    <Label className="" htmlFor="name">
                      Kích Thước
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4">
                    <div className=" border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden">
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
          </div>
        </div>
      </MyContext.Provider>
    </div>
  );
}
