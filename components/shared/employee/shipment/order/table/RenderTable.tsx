import { ShipOrderShipper, columns } from "./Column";
import { DataTable } from "./DataTable";
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
import { orderApi } from "@/apis/order.api";
import DatePicker from "@/components/shared/common/datapicker/date-picker";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { companyApi } from "@/apis/company.api";
import { shipOrderApi } from "@/apis/shipOrder.api";
type ContexType = {
  forceUpdate: () => void;
};
export const MyContext = createContext<ContexType>({
  forceUpdate: () => {},
});

const enumStatus = [
  {
    statusName: "SIGNED",
    description: "Đang đợi giao",
    id: 0,
    value: "0",
  },
  {
    statusName: "INPROGRESS",
    description: "Đang được giao",
    id: 1,
    value: "1",
  },
  {
    statusName: "COMPLETED",
    description: "Đã giao thành công",
    id: 2,
    value: "2",
  },
  {
    statusName: "CANCELLED",
    description: "Đã hủy ",
    id: 3,
    value: "3",
  },
  {
    statusName: "CANCELLED",
    description: "Bỏ chọn",
    id: 4,
    value: " ",
  },
];

type Company = {
  id: string;
  name: string;
  address: string;
  directorName: string;
  directorPhone: string;
  email: string;
  companyType: any;
  companyTypeDescription: string;
};
export default function RenderTableOrderShipment() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<ShipOrderShipper[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [status, setStatus] = useState<string | null>("0");
  const [shipDate, setShipDate] = useState<Date | null>(null);
  const [companyName, setCompanyName] = useState<string>("");

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
        const response = await shipOrderApi.shipOrderByShipper(
          currentPage,
          pageSize,
          status,
          shipDate ? formatDate(shipDate) : null
        );
        setData(response.data.data.data);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDataOrder();
  }, [currentPage, pageSize, companyName, status, force,shipDate]);

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

  const handleStartDateChange = (date: Date | null) => {
    setShipDate(date);
    setCurrentPage(1);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className=" mt-3">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <MyContext.Provider value={{ forceUpdate }}>
            <div className="grid gird-col-span-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col xl:flex-row items-start sm:items-center gap-4">
                <Select
                  value={status || ""}
                  onValueChange={(value) => handleStatusChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {enumStatus.map((item, index) => (
                      <SelectItem value={item.value} key={index}>
                        {item.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-x-4 ">
                <DatePicker
                  selected={shipDate}
                  name="from"
                  title={shipDate ? formatDate(shipDate) : "Từ ngày"}
                  className="w-full"
                  onDayClick={handleStartDateChange}
                />
              </div>
            </div>
          </MyContext.Provider>
        </div>
      </div>

      <MyContext.Provider value={{ forceUpdate }}>
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={data} />
          <DataTablePagination
            data={data}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </MyContext.Provider>
    </div>
  );
}
