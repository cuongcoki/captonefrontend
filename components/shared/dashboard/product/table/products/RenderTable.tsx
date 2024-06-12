// 'use client'
import { Product, columns } from "./Column"
import { DataTable } from "./DataTable"
import { useEffect, useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { userApi } from "@/apis/user.api";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";


import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator";
async function getData(): Promise<Product[]> {
  
  return [
    {
      productID: "P000023321",
      productName: "LEGO",
      Code: "P012343224he163213fpt",
      productPrice: 1000000000,
      isGroup: "Male",
      size: "123 Main Street, ",
      description: "123 Main Street, ",
      createdBy: "555-1234",
    },
    {
      productID: "P000023321",
      productName: "LEGO",
      Code: "P012343224he163213fpt",
      productPrice: 1000000000,
      isGroup: "Male",
      size: "123 Main Street, ",
      description: "123 Main Street, ",
      createdBy: "555-1234",
    },
    {
      productID: "P000023321",
      productName: "LEGO",
      Code: "P012343224he163213fpt",
      productPrice: 1000000000,
      isGroup: "Male",
      size: "123 Main Street, ",
      description: "123 Main Street, ",
      createdBy: "555-1234",
    },


    // ...
  ]
}

export default  async function RenderTableProduct() {
  const [loading, setLoading] = useState<boolean>(false);
  // const [data, setData] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [roleId, setRoleId] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isActive, setIsActive] = useState<any>(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  
  // useEffect(() => {
  //   fetchData()
  // }, [])
  // const fetchData =() =>{
  //   userApi.allUsers(roleId,value,isActive)
  //           .then(res => {
  //             setData(res.data.data.data);
  //           })
  //           .catch(error =>{
  //             console.error('Error fetching user data:', error);
  //           })
  //           .finally(() => {
  //             setLoading(false);
  //         })
  // }

  const data = await getData();
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
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button variant={"colorCompany"} className="text-xs">
                  Thêm mới người dùng
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-[50%]">
                <DialogTitle className="text-2xl text-primary-backgroudPrimary">Thêm mới người dùng</DialogTitle>
                <Separator className="h-1" />
                {/* <UsersForm setOpen={setOpen} /> */}
              </DialogContent>
            </Dialog>
            <Button variant={"outline"}> <EllipsisVertical size={20} /></Button>
          </div>
        </div>
      </div>
    </div>
    <>
      <DataTable columns={columns} data={data} />
      <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
    </>
    </div>
  )
}
