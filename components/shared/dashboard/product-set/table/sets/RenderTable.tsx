import { Product, columns } from "./Column";
import { DataTableSet } from "./DataTable";
import { useEffect, useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { Input } from "@/components/ui/input";

import { setApi } from "@/apis/set.api";
import { SetForm } from "../../form/SetForm";
import { filesApi } from "@/apis/files.api";

export default function RenderTableProduct() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [isInProcessing, setIsInProcessing] = useState<boolean>(true);
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    const fetchDataProduct = async () => {
      setLoading(true);
      try {
        const response = await setApi.allSet(currentPage, pageSize, searchTerm);
        const newData = response.data.data.data;
        const totalPages = response.data.data.totalPages;

        // Update imageUrl with links fetched from filesApi
        const updatedData = await Promise.all(
          newData.map(async (item: any) => {
            try {
              const { data } = await filesApi.getFile(item.imageUrl);
              return {
                ...item,
                imageUrl: data.data,
              };
            } catch (error) {
              console.error("Error getting file:", error);
              return {
                ...item,
                imageUrl: "", // Handle error case if needed
              };
            }
          })
        );

        setData(updatedData);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataProduct();
  }, [currentPage, pageSize, searchTerm, isInProcessing]);

  console.log("data", data);

  return (
    <div className="px-3 ">
      <div className="flex items-center justify-between  mb-4">
        <Input
          placeholder="	Tìm kiếm bộ sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[30%]"
        />

        <div>
          <div className="flex items-center justify-end p-3">
            <div className="flex items-center space-x-2">
              <SetForm />
            </div>
          </div>
        </div>
      </div>
      <>
        <DataTableSet columns={columns} data={data} />
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </>
    </div>
  );
}
