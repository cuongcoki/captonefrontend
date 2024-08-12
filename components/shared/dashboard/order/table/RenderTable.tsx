import { Order, columns } from "./Column";
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

import CreateOrder from "../form/CreateOrder";
import { orderApi } from "@/apis/order.api";
import DatePicker from "@/components/shared/common/datapicker/date-picker";
import toast from "react-hot-toast";
import { companyApi } from "@/apis/company.api";
import { OrderStore } from "../order-store";
type ContexType = {
  forceUpdate: () => void;
};
export const MyContext = createContext<ContexType>({
  forceUpdate: () => { },
});

const enumStatus = [
  {
    statusName: "SIGNED",
    description: "Đã nhận đơn hàng",
    id: 0,
    value: "0",
  },
  {
    statusName: "INPROGRESS",
    description: "Đang thực hiện",
    id: 1,
    value: "1",
  },
  {
    statusName: "COMPLETED",
    description: "Đã hoàn thành",
    id: 2,
    value: "2",
  },
  {
    statusName: "CANCELLED",
    description: "Đã hủy đơn hàng",
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
export default function RenderTableOrder() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [status, setStatus] = useState<string | null>(null);
  const [startOrder, setStartOrder] = useState<Date | null>(null);
  const [endOrder, setEndOrder] = useState<Date | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [company, setCompany] = useState<Company[]>([]);
  const { force } = OrderStore();
  const router = useRouter();
  const pathname = usePathname();

 

  useEffect(() => {
    const fetchDataOrder = async () => {
      setLoading(true);
      try {
        const response = await orderApi.searchOrder(
          currentPage,
          pageSize,
          status,
          startOrder ? formatDate(startOrder) : null,
          endOrder ? formatDate(endOrder) : null,
          companyName
        );
        setData(response.data.data.data);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(response.data.data.totalPages);
      } catch (error: any) {
        setData([])
      } finally {
        setLoading(false);
      }
    };

    const fetchDataCompany = () => {
      companyApi.getCompanyByType(1).then(({ data }) => {
        setCompany(data.data);
      });
    };

    fetchDataCompany();
    fetchDataOrder();
  }, [currentPage, pageSize, companyName, startOrder, endOrder, status, force]);

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
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
  
    const formatdathi = formatDate(date);
    const formattedStartOrder = startOrder ? formatDate(startOrder) : null;
  
    // So sánh chuỗi đã được định dạng
    if (formattedStartOrder && formatdathi === formattedStartOrder) {
      return  setStartOrder(null);
    }
  
    if (date && endOrder && date.getTime() > endOrder.getTime()) {
      toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }
  
    setStartOrder(date);
    setCurrentPage(1);
  };
  

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;
  
    const formatdathi = formatDate(date);
    const formattedStartOrder = endOrder ? formatDate(endOrder) : null;
  
    // So sánh chuỗi đã được định dạng
    if (formattedStartOrder && formatdathi === formattedStartOrder) {
      return  setEndOrder(null);
    }
    if (startOrder && date && startOrder > date) {
      toast.error("Ngày kết thúc không được nhỏ hơn ngày bất đầu");
      return;
    }
    setEndOrder(date);
    setCurrentPage(1);
  };

  return (
    <div className=" mt-3">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <div className="grid gird-col-span-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col xl:flex-row items-start sm:items-center gap-4">
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
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
                    <SelectItem value={item.value} key={index}>
                      {item.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-x-4 ">
              <DatePicker
                selected={startOrder}
                name="from"
                title={startOrder ? formatDate(startOrder) : "Từ ngày"}
                className="w-full"
                onDayClick={handleStartDateChange}
              />

              <DatePicker
                selected={endOrder}
                name="to"
                title={endOrder ? formatDate(endOrder) : "Đến ngày"}
                className="w-full"
                onDayClick={handleEndDateChange}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <CreateOrder />
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
