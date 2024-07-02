import { Order, columns } from "./Column"
import { DataTable } from "./DataTable"
import { useEffect, useState, createContext } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { ProductSearchParams } from "@/types/product.type";
import CreateOrder from "../form/CreateOrder";
import { orderApi } from "@/apis/order.api";

type ContexType = {
  forceUpdate: () => void;
};
export const MyContext = createContext<ContexType>({
  forceUpdate: () => { },
});
export default function RenderTableOrder() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<Order[]>([]);
  console.log('data',data)
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [status, setStatus] = useState<string | null>(null);
  const [startOrder, setStartOrder] = useState<Date  | null>(null);
  const [endOrder, setEndOrder] = useState<Date  | null>(null); 
  const [companyName, setCompanyName] = useState<string>('');
  
  const router = useRouter();
  const pathname = usePathname();
  const [force, setForce] = useState<number>(1);
 
  const forceUpdate = () => setForce((prev) => prev + 1);
  type Props = {
    searchParams: ProductSearchParams;
  };

  useEffect(() => {
    const fetchDataOrder = async () => {
      setLoading(true);
      try {
        const response = await orderApi.searchOrder(
          currentPage,
          pageSize,
          // status,
          // startOrder,
          // endOrder,
          // companyName
        );
        setData(response.data.data.data);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error('Error fetching order data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataOrder();
  }, [currentPage, pageSize, companyName,startOrder,endOrder,status, force]);



  

  const handleStatusChange = (value: string | null) => {
    setStatus(value);
    updatePathname();
  };

  const updatePathname = () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="px-3">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <MyContext.Provider value={{ forceUpdate }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              
               <Select
                value={status || ""}
                onValueChange={(value) => handleStatusChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chưa giải quyết">chưa giải quyết</SelectItem>
                  <SelectItem value="xử lý">xử lý</SelectItem>
                  <SelectItem value="hoàn thành">hoàn thành</SelectItem>
                  <SelectItem value="đã hủy bỏ">đã hủy bỏ</SelectItem>
                </SelectContent>
              </Select>
              
            </div>
          </MyContext.Provider>
        </div>

        <MyContext.Provider value={{ forceUpdate }}>
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-2">
              <CreateOrder />
            </div>
          </div>
        </MyContext.Provider>
      </div>

      <MyContext.Provider value={{ forceUpdate }}>
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={data} />
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </MyContext.Provider>
    </div>

  );
}
