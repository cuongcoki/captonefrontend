import { Product, columns } from "./Column";
import { DataTable } from "./DataTable";
import { useEffect, useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { productApi } from "@/apis/product.api";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ProductForm } from "../../form/ProductForm";
import { ProductSearchParams } from "@/types/product.type";
import { filesApi } from "@/apis/files.api";
import { ProductStore } from "@/components/shared/dashboard/product/product-store";

export default function RenderTableProduct() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isInProcessing, setIsInProcessing] = useState<boolean>(true);
  const [data, setData] = useState<Product[]>([]);
  const { force } = ProductStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isInProcessingString, setIsInProcessingString] = useState<string>(
    isInProcessing.toString()
  );

  useEffect(() => {
    const fetchDataProduct = async () => {
      setLoading(true);
      try {
        const response = await productApi.allProducts(
          isInProcessing,
          currentPage,
          pageSize,
          searchTerm
        );
        const newData = response.data.data.data;

        const updatedData = await Promise.all(
          newData.map(async (item: any) => {
            const updatedImageResponses = await Promise.all(
              item.imageResponses.map(async (image: any) => {
                try {
                  const { data } = await filesApi.getFile(image.imageUrl);
                  return {
                    ...image,
                    imageUrl: data.data,
                  };
                } catch (error) {
                  console.error("Error getting file:", error);
                  return {
                    ...image,
                    imageUrl: "", 
                  };
                }
              })
            );
            return {
              ...item,
              imageResponses: updatedImageResponses,
            };
          })
        );

        setData(updatedData);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDataProduct();
  }, [currentPage, pageSize, searchTerm, isInProcessing, force]);

  const handleIsInProcessingChange = (value: string) => {
    setIsInProcessingString(value);
    setIsInProcessing(value === "true");
    updatePathname(); 
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    updatePathname(); 
  };

  const updatePathname = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("searchTerm", searchTerm);
    params.set("isInProcessing", isInProcessing.toString());
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={handleSearchTermChange}
              className="w-full sm:w-auto"
            />
            <Select
              value={isInProcessingString}
              onValueChange={(value) => handleIsInProcessingChange(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Đang xử lý</SelectItem>
                <SelectItem value="false">Chưa xử lý</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <ProductForm />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <DataTable columns={columns} data={data} />
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
