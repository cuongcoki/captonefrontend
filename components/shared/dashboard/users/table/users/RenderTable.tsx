import { userApi } from "@/apis/user.api";
import { Employee, columns } from "./Column";
import { DataTable } from "./DataTable";
import { DataTablePagination } from "./data-table-pagination";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
    Card,
} from "@/components/ui/card"
import { UsersForm } from "../../form/UsersForm";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator";
export default function RenderTableUsers() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [roleId, setRoleId] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isActive, setIsActive] = useState<any>(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await userApi.allUsers(roleId, searchTerm, isActive, currentPage, pageSize);
        setData(res.data.data.data);
        setCurrentPage(res.data.data.currentPage);
        setTotalPages(res.data.data.totalPages);
        console.log('Response:', res);
      } catch (error) {
        // console.error('Error fetching user data:', error?.response);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roleId, searchTerm, isActive, currentPage, pageSize]);

  console.log('Data:', data);
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
                  <UsersForm setOpen={setOpen} />
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
  );
}
