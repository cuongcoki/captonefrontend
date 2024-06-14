import { Product, columns } from "./Column"
import { DataTable } from "./DataTable"
import { useEffect, useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { productApi } from "@/apis/product.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";


import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProductForm } from "../../form/ProductForm";


export default  function RenderTableProduct() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  const [isInProcessing, setIsInProcessing] = useState<boolean>(true);
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    const fetchDataProduct =  () => {
      setLoading(true);
      productApi
        .allProducts(isInProcessing, currentPage, pageSize, searchTerm)
        .then(response => {
          console.log(response.data.data)
          setData(response.data.data.data);
          setCurrentPage(response.data.data.currentPage)
          setTotalPages(response.data.data.totalPages)
        })
        .catch(error => {
          console.error('Error fetching product data:', error);
        })
        .finally(() => {
          setLoading(false);
        })
    };
    console.log('data', data)
    fetchDataProduct();
  }, [currentPage, pageSize, searchTerm, isInProcessing]);


  return (
    <div className="px-3 ">
      <div className="flex items-center justify-between  mb-4">
        <Input
          placeholder="CMND/CCCD..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[30%]"
        />

        <div>
          <div className="flex items-center justify-end p-3">
            <div className="flex items-center space-x-2">
              <Dialog  open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button variant={"colorCompany"} className="text-xs">
                    Thêm mới người dùng
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[50%] min-h-[70%]">
                  <ProductForm setOpen={setOpen} />
                </DialogContent>
              </Dialog>
              <Button variant={"outline"}> <EllipsisVertical size={20} /></Button>
            </div>
          </div>
        </div>
      </div>
      <>
        <DataTable columns={columns} data={data} />
        <DataTablePagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
      </>
    </div>
  );
}
