"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// ** import UI
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
import { ProductStore } from "@/components/shared/dashboard/product/product-store";
import HeaderComponent from "@/components/shared/common/header";
import TitleComponent from "@/components/shared/common/Title";
import { ProductUpdateForm } from "../../form/ProductUpdateForm";
import { formatCurrency } from "@/lib/utils";
import { filesApi } from "@/apis/files.api";

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
  priceFinished: number;
  pricePhase1: number;
  pricePhase2: number;
  size: string;
  productPhaseSalaries: productPhaseSalaries[];
}

interface productPhaseSalaries {
  phaseDescription: string;
  phaseId: string;
  phaseName: string;
  salaryPerProduct: number;
}

export default function ProductIDPage() {
  //state
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const [productId, setProductId] = useState<any>([]);
  const { force } = ProductStore();

  useEffect(() => {
    const fetchDataProductId = () => {
      setLoading(true);
      productApi
        .getProductId(params.id)
        .then((res) => {
          const userData = res.data.data as ProductData;

          // Lấy và cập nhật imageUrl cho từng hình ảnh
          return Promise.all(
            userData.imageResponses.map((image) => {
              return filesApi
                .getFile(image.imageUrl)
                .then(({ data }) => ({
                  ...image,
                  imageUrl: data.data,
                }))
                .catch((error) => ({
                  ...image,
                  imageUrl: "", // Xử lý trường hợp lỗi
                }));
            })
          ).then((updatedImageResponses) => {
            // Cập nhật lại productId với imageResponses đã được xử lý
            setProductId({
              ...userData,
              imageResponses: updatedImageResponses,
            });
          });
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchDataProductId();
  }, [params.id, force]);
  // const limitLength = (text: any, maxLength: any) => {
  //   if (text.length > maxLength) {
  //     return `${text.slice(0, maxLength)}...`;
  //   }
  //   return text;
  // };

  // const formatValue = (value: any, maxLength: any) => {
  //   if (!value) return "";
  //   return limitLength(value, maxLength);
  // };

  return (
    <>
      <HeaderComponent
        title="Chi tiết sản phẩm"
        description="Thông tin chi tiết của sản phẩm."
      />
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div
          id="A"
          className="grid md:grid-cols-2 grid-col-1 items-start gap-4 md:gap-8 lg:col-span-2"
        >
          <Card className="shadow-sm h-full grid ">
            <CardHeader className="row-span-2">
              <div className="flex justify-between items-start text-primary">
                <TitleComponent
                  title="Thông Tin"
                  description="Thông tin của sản phẩm."
                />
                <div className="rounded p-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  {productId && Object.keys(productId).length > 0 ? (
                    <ProductUpdateForm productId={productId}>
                      <PencilLine />
                    </ProductUpdateForm>
                  ) : (
                    <div>Không có dữ liệu chỉnh sửa</div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-rows-10 row-span-10">
              <div className=" gap-3 space-y-5 row-span-7">
                <div className=" gap-3  ">
                  <Label className="" htmlFor="name">
                    <div>Mã Sản Phẩm</div>
                  </Label>
                  <div className="col-span-6 border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden truncate">
                    {productId?.code}
                  </div>
                </div>

                <div className=" gap-3">
                  <Label htmlFor="name">Tên Sản Phẩm</Label>
                  <div className="border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden truncate">
                    {productId?.name}
                  </div>
                </div>
                <div className=" gap-3">
                  <Label className="" htmlFor="name">
                    Kích Thước
                  </Label>
                  <div className=" border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden">
                    {productId?.size}
                  </div>
                </div>
                <div className=" gap-3">
                  <Label htmlFor="description">Mô Tả</Label>
                </div>
              </div>
              <div className="border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden row-span-3">
                {productId?.description}
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col justify-center space-y-5">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary">Trạng Thái</CardTitle>
                <span className="text-xs font-normal leading-snug text-muted-foreground">
                  Trạng thái hiện tại của sản phẩm.
                </span>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 col-span-4 mx-auto">
                  <Label className="flex gap-x-3 items-center" htmlFor="status">
                    <div className="">Trạng Thái:</div>
                    <div className="">
                      <span
                        className={`w-[40%] px-2 py-2 rounded-full ${productId?.isInProcessing
                          ? "bg-primary text-white"
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
              </CardContent>
            </Card>
            <Card className="shadow-sm gd-1 ">
              <CardHeader className="text-primary">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Giai Đoạn</CardTitle>
                    <span className="text-xs font-normal leading-snug text-muted-foreground">
                      Thông tin giá thành các giai đoạn của sản phẩm.
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden sm:table-cell">
                        Tên
                      </TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Giá tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productId?.productPhaseSalaries
                      ?.sort((a: any, b: any) => {
                        if (a.phaseName < b.phaseName) {
                          return -1;
                        }
                        if (a.phaseName > b.phaseName) {
                          return 1;
                        }
                        return 0;
                      })
                      .map((item: any) => (
                        <TableRow key={item.phaseId}>
                          <TableCell className="hidden sm:block">
                            <div className="py-2 rounded-md">
                              {item?.phaseName}
                            </div>
                          </TableCell>
                          <TableCell className="overflow-hidden ">
                            {item?.phaseDescription}
                          </TableCell>
                          <TableCell>
                            <div className="border px-3 py-2 rounded-md">
                              {formatCurrency(item?.salaryPerProduct)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <div id="B" className="grid gap-8 h-full">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Hình Ảnh</CardTitle>
              <span className="text-xs font-normal leading-snug text-muted-foreground">
                Hình ảnh minh họa của sản phẩm.
              </span>
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
