import { Product, columns } from "./Column"
import { DataTable } from "./DataTable"
import { useEffect, useState, createContext } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { productApi } from "@/apis/product.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Plus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ProductForm } from "../../form/ProductForm";
import { ProductSearchParams } from "@/types/product.type";

type ContexType = {
  forceUpdate: () => void;
};
export const MyContext = createContext<ContexType>({
  forceUpdate: () => { },
});
export default function RenderTableProduct() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  const [isInProcessing, setIsInProcessing] = useState<boolean>(true);
  const [data, setData] = useState<Product[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const [force, setForce] = useState<number>(1);
  const [isInProcessingString, setIsInProcessingString] = useState<string>(
    isInProcessing.toString()
  );
  const forceUpdate = () => setForce((prev) => prev + 1);
  type Props = {
    searchParams: ProductSearchParams;
  };

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
        setData(response.data.data.data);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataProduct();
  }, [currentPage, pageSize, searchTerm, isInProcessing, force]);

  const handleIsInProcessingChange = (value: string) => {
    setIsInProcessingString(value);
    setIsInProcessing(value === "true");
    updatePathname(); // Cập nhật đường dẫn khi thay đổi trạng thái
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    updatePathname(); // Cập nhật đường dẫn khi thay đổi search term
  };

  const updatePathname = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("searchTerm", searchTerm);
    params.set("isInProcessing", isInProcessing.toString());
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="px-3">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <MyContext.Provider value={{ forceUpdate }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Input
                placeholder="Mã CODE..."
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
          </MyContext.Provider>
        </div>

        <MyContext.Provider value={{ forceUpdate }}>
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button variant="colorCompany" className="text-xs">
                    <Plus className="block lg:hidden"/> <span className="hidden lg:block">Thêm sản phầm mới</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-full md:max-w-[70%] min-h-[90%]">
                  <DialogTitle className="hidden">ho</DialogTitle>
                  <ProductForm setOpen={setOpen} />
                </DialogContent>
              </Dialog>
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
