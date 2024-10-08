import { Shipment, columns } from "./Column";
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

import toast from "react-hot-toast";
import { shipmentApi } from "@/apis/shipment.api";
import { ShipmentStore } from "../shipment-store";
import useDebounce from "@/components/shared/common/customer-hook/use-debounce";
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
    description: "Đã hủy",
    id: 3,
    value: "3",
  },
];

export default function RenderTableShipment() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<Shipment[]>([]);
  // console.log("data Shipment", data);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [status, setStatus] = useState<string | null>("0");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchTermDebounce = useDebounce(searchTerm, 400);
  const router = useRouter();
  const pathname = usePathname();
  const { force } = ShipmentStore();

  useEffect(() => {
    const fetchDataShipment = async () => {
      setLoading(true);
      try {
        const response = await shipmentApi.getByShipper(
          currentPage,
          pageSize,
          status,
          searchTermDebounce
        );
        setData(response.data.data.data);
        // console.log("DATA SHIPMENT", response.data.data.data);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(response.data.data.totalPages);
      } catch (error: any) {
        // toast.error(error.response.data.message)
        setData([]);
        // console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataShipment();
  }, [currentPage, pageSize, searchTermDebounce, status, force]);

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
    <div className="mt-3">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <div className="grid gird-col-span-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col xl:flex-row items-start sm:items-center gap-4">
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-[300px] w-full"
              />
              <Select
                value={status || ""}
                onValueChange={(value) => handleStatusChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {enumStatus.map((item, index) => (
                    <SelectItem value={item.value} key={item.id}>
                      {item.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
