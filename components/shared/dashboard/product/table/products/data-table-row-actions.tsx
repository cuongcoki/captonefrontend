import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { productApi } from "@/apis/product.api";
import { ProductUpdateForm } from "../../form/ProductUpdateForm";
import { filesApi } from "@/apis/files.api";
import { ProductStore } from "../../product-store";

interface DataTableRowActionsProps<TData extends { id: string }> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends { id: string }>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [productId, setProductId] = useState<any>([]);
  const { force } = ProductStore();
  useEffect(() => {
    const fetchDataProductId = async () => {
      try {
        const res = await productApi.getProductId(row.original.id);
        const userData = res.data.data;
  
        if (userData) {
          const updatedData = await Promise.all(
            userData.imageResponses.map(async (image:any) => {
              try {
                const { data } = await filesApi.getFile(image.imageUrl);
                return {
                  ...image,
                  imageUrl: data.data,
                };
              } catch (error) {
                return {
                  ...image,
                  imageUrl: "",
                };
              }
            })
          );
  
          // Cập nhật lại thông tin sản phẩm với dữ liệu đã được cập nhật
          const updatedProductData = { ...userData, imageResponses: updatedData };
          setProductId(updatedProductData);
        }
      } catch (error) {
        console.error("Error fetching product by ID:", error);
      } finally {
        // Bạn có thể thêm setLoading(false) ở đây nếu có sử dụng loading state
      }
    };
  
    fetchDataProductId();
  }, [row.original.id,force]);
  
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <ProductUpdateForm productId={productId}>
          <div className="w-full hover:bg-gray-200 dark:hover:bg-black/90 relative flex cursor-default select-none justify-center items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            Chỉnh sửa
          </div>
        </ProductUpdateForm>
        <Link
          className="w-full hover:bg-gray-200 dark:hover:bg-black/90 relative flex cursor-default select-none items-center justify-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          href={`/dashboard/products/product/${row.original.id}`}
        >
          Chi tiết
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
