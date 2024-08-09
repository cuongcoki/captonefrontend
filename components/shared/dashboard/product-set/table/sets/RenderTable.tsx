import { Product, columns } from "./Column";
import { DataTableSet } from "./DataTable";
import { createContext, useEffect, useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { Input } from "@/components/ui/input";

import { setApi } from "@/apis/set.api";
import { SetForm } from "../../form/SetForm";
import { filesApi } from "@/apis/files.api";

type ContexType = {
  forceUpdate: () => void;
};
export const MyContext = createContext<ContexType>({
  forceUpdate: () => {},
});

export default function RenderTableProduct() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [isInProcessing, setIsInProcessing] = useState<boolean>(true);
  const [data, setData] = useState<Product[]>([]);
  const [force, setForce] = useState<number>(1);
  const forceUpdate = () => setForce((prev) => prev + 1);

  useEffect(() => {
    const fetchDataProduct = async () => {
      setLoading(true);
      try {
        const response = await setApi.allSet(currentPage, pageSize, searchTerm);
        const newData = response.data.data.data;
        const totalPages = response.data.data.totalPages;

        const updatedData = await Promise.all(
          newData.map(async (item: any) => {
            try {
              const { data } = await filesApi.getFile(item.imageUrl);
              return {
                ...item,
                imageUrl: data.data,
              };
            } catch (error) {
              return {
                ...item,
                imageUrl: "", 
              };
            }
          })
        );

        setData(updatedData);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(totalPages);
      } catch (error) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDataProduct();
  }, [currentPage, pageSize, searchTerm, isInProcessing, force]);

  return (
    <div className="">
      <MyContext.Provider value={{ forceUpdate }}>
        <div className="flex items-center justify-between  mb-4">
          <Input
            placeholder="Tìm kiếm bộ sản phẩm..."
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
      </MyContext.Provider>
      <MyContext.Provider value={{ forceUpdate }}>
        <>
          <DataTableSet columns={columns} data={data} />
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      </MyContext.Provider>
    </div>
  );
}
