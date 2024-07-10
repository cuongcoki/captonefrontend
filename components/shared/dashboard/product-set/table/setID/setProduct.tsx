import {
  CardHeader,
  CardTitle,
  CardFooter,
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import ImageDisplayID from "./ImageDisplayID";
import ImageDisplay from "./ImageDisplay";
import { Textarea } from "@/components/ui/textarea";
import { filesApi } from "@/apis/files.api";
import {IconImage} from "./IconImage";

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

interface SetProduct {
  setId: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface SetProductProps {
  setProduct: SetProduct[];
}

export default function SetProduct({ setProduct }: SetProductProps) {
  // ** state
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<SetProduct | null>(
    null
  );

  const handleOpenDialog = async (pro: SetProduct) => {
    try {
      const updatedImages = await Promise.all(
        pro.product.imageResponses.map(async (image: ImageResponse) => {
          try {
            const { data } = await filesApi.getFile(image.imageUrl);
            return {
              ...image,
              imageUrl: data.data, // Assuming data.data is the updated image URL
            };
          } catch (error) {
            console.error("Error getting file:", error);
            return {
              ...image,
              imageUrl: "", // Handle error case if needed
            };
          }
        })
      );

      const updatedProduct: SetProduct = {
        ...pro,
        product: {
          ...pro.product,
          imageResponses: updatedImages,
        },
      };

      setSelectedProduct(updatedProduct);
      setOpen(true);
    } catch (error) {
      console.error("Error updating images:", error);
      // Handle error state if necessary
    }
  };
  const limitLength = (text: any, maxLength: any) => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };
  console.log('setProductdetaill', setProduct)
  console.log("selectedProductselectedProduct", selectedProduct);
  return (
    <Card x-chunk="dashboard-07-chunk-1" className="h-max">
      <CardHeader>
        <CardTitle className="text-primary">Chi tiết sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh Sản Phẩm</TableHead>
              <TableHead>Mã Sản Phẩm</TableHead>
              <TableHead>Tên Sản Phẩm</TableHead>
              <TableHead>Số lượng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {setProduct.map((pro, index) => (
              <TableRow key={index} onClick={() => handleOpenDialog(pro)}>
                <TableCell className="font-semibold">
                    <div className="w-[50px] h-[50px] rounded-lg shadow-md">
                      <IconImage pro={pro.product.imageResponses} />
                    </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {limitLength(pro.product.code, 50)}
                </TableCell>
                <TableCell className="font-semibold">
                  {limitLength(pro.product.name, 50)}
                </TableCell>
                <TableCell className="font-semibold">{pro.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-[1100px]  ">
            <DialogTitle className="visible">
              {/* Chi tiết bộ sản phẩm */}
            </DialogTitle>

            <div className=" w-full min-w-[90%] md:min-w-[70%] bg-white p-2 rounded-lg dark:bg-card">
              <Card className="p-4 flex flex-col justify-between gap-4  w-full">
                <CardHeader className="font-semibold text-xl ">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl text-primary">
                      Thông Tin Sản Phẩm
                    </span>{" "}
                    <span>Số Lượng : {selectedProduct?.quantity}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 md:flex-row">
                  <Card className=" w-full md:w-1/2">
                    {selectedProduct && (
                      <ImageDisplay
                        images={selectedProduct.product.imageResponses}
                      />
                    )}
                  </Card>
                  <div className="w-full md:w-1/2">
                    <Card>
                      <CardContent className="overflow-auto py-2">
                        <div className="w-[100px]">
                          <span className="text-xl font-medium"></span>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-primary" htmlFor="username">
                            Mã Sản Phẩm
                          </Label>
                          <div className="border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden">
                            {selectedProduct?.product.code}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="username" className="text-primary">
                            Tên Sản Phẩm
                          </Label>
                          <div className="border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden">
                            {selectedProduct?.product.name}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-primary" htmlFor="username">
                            Giá Thành
                          </Label>
                          <div className="border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden">
                            {selectedProduct?.product.price}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-primary" htmlFor="username">
                            Kích Thước
                          </Label>
                          <div className="border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden">
                            {selectedProduct?.product.size}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-primary" htmlFor="description">
                            Mô Tả
                          </Label>
                          <div className="border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden">
                            {selectedProduct?.product.description}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-primary" htmlFor="description">
                            Trạng Thái
                          </Label>
                          <div className="border p-2 rounded-md border-gray-100 whitespace-pre-wrap break-words w-full overflow-hidden">
                            {selectedProduct?.product.isInProcessing
                              ? "Đang xử lý"
                              : "Chưa xử lý"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
