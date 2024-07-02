"use client";

// ** import react
import Link from "next/link";
import Image from "next/image";

import { useParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";

// ** import UI
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import * as Dialog from "@radix-ui/react-dialog";

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
import { ChevronLeft, PencilLine, PlusCircle, Upload, X } from "lucide-react";

// ** component
import ImageDisplayID from "./ImageDisplayID";
import { ProductUpdateForm } from "../../form/ProductUpdateForm";
import { ProductForm } from "../../form/ProductForm";

interface ProductData {
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

  useEffect(() => {
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

  // console.log('iddd product', productId)

  return (
    <div className="flex flex-col gap-6 justify-center">
      <header className="">
        <div className="flex items-center gap-4 justify-between">
          <Link href={"/dashboard/products/product"}>
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className=" shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight ">
            Sản phẩm
          </h1>
          <div className=" items-center gap-2 md:ml-auto md:flex">
            <Dialog.Root open={open} onOpenChange={handleOnDialog}>
              <Dialog.Trigger className="rounded p-2 hover:bg-gray-200">
                <PencilLine onClick={handleOnDialog} />
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
                  <Dialog.Content className="overflow-auto w-full fixed z-50 left-1/2 top-1/2  max-w-[900px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  text-gray-900 shadow">
                    <div className="bg-slate-100  flex flex-col ">
                      <div className="p-4 flex items-center justify-between bg-primary-backgroudPrimary  rounded-t-md">
                        <h2 className="text-2xl text-white">
                          Chỉnh sửa bộ sản phẩm
                        </h2>
                        <Button variant="outline" size="icon">
                          <X className="w-4 h-4" onClick={handleOffDialog} />
                        </Button>
                      </div>
                      <div className="grid gap-4 p-4 overflow-y-auto h-[650px]">
                        <ProductUpdateForm productId={productId} />
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Overlay>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>

      <MyContext.Provider value={{ forceUpdate }}>
        <div className="w-full h-full bg-white p-2 rounded-lg shadow-md dark:bg-card">
          <div className="p-4 grid md:grid-cols-2 grid-cols-1  gap-4">
            <Card className="dark:border-[2px] dark:border-white ">
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

            <Card className="dark:border-[2px] dark:border-white ">
              <CardHeader>
                <CardTitle>Chi tiết sản phẩm</CardTitle>
                <CardDescription>
                  đây là sản phẩm chi tiết, bạn có thể thay đổi giá trị
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Tên</Label>
                    <div className="border p-2 rounded-md border-gray-100">
                      {productId?.name}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Mô tả</Label>
                    <div className="border p-2 rounded-md border-gray-100">
                      {productId?.description}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Mã CODE</Label>
                    <div className="border p-2 rounded-md border-gray-100">
                      {productId?.code}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Giá</Label>
                    <div className="border p-2 rounded-md border-gray-100">
                      {productId?.price} VNĐ
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Kích thước</Label>
                    <div className="border p-2 rounded-md border-gray-100">
                      {productId?.size}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="status">
                      Trạng thái:{" "}
                      <span className="px-2 py-2 rounded-full bg-slate-100">
                        {productId?.isInProcessing
                          ? "Đang xử lý"
                          : "Chưa xử lý"}
                      </span>
                    </Label>
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
