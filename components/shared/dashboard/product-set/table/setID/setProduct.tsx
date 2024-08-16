import {
  CardHeader,
  CardTitle,
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


import { useState } from "react";

import { IconImage } from "./IconImage";
import { limitLength } from "@/lib/utils";

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
  const [selectedProduct, setSelectedProduct] = useState<SetProduct | null>(
    null
  );

  const handleOpenDialog = async (pro: SetProduct) => {
    window.location.href = `/dashboard/products/product/${pro.productId}`;
  };
  
  return (
    <Card x-chunk="dashboard-07-chunk-1" className="h-max">
      <CardHeader>
        <CardTitle className="text-primary">Danh sách sản phẩm</CardTitle>
        <span className="text-xs font-normal leading-snug text-muted-foreground">Danh sách các sản phẩm có trong bộ sản phẩm.</span>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Mã sản phẩm</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
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
    </Card>
  );
}
