"use client";

import { userApi } from "@/apis/user.api";
import { Employee, columns } from "./Column";
import { DataTable } from "./DataTable";
import { DataTablePagination } from "./data-table-pagination";
import { useEffect, useState, createContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { UsersForm } from "../../form/UsersForm";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { UserSearchParams } from "@/types/userTypes";
import TableUserFeature from "@/components/shared/dashboard/users/table/users/user-table-feature";

type Props = {
  searchParams: UserSearchParams;
};
type ContexType = {
  forceUpdate: () => void;
};
export const MyContext = createContext<ContexType>({
  forceUpdate: () => { },
});

export default function RenderTableUsers({ searchParams }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [open, setOpen] = useState<boolean>(false);

  const [force, setForce] = useState<number>(1);
  const forceUpdate = () => setForce((prev) => prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await userApi.allUsers(
          searchParams.roleId ?? 1,
          searchParams.searchTearm ?? "",
          searchParams.isActive == "false" ? "false" : "true",
          currentPage,
          pageSize
        );
        setData(res.data.data.data);
        setCurrentPage(res.data.data.currentPage);
        setTotalPages(res.data.data.totalPages);
        console.log("Response:", res);
      } catch (error) {
        // console.error('Error fetching user data:', error?.response);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, currentPage, pageSize, force]);

  console.log("Data:", data);
  return (
    <div className="px-3 ">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">

        <div className="w-full md:w-auto mb-4 md:mb-0">
          <TableUserFeature searchOptions={searchParams} />
        </div>

        <MyContext.Provider value={{ forceUpdate }}>
          <div className="w-full md:w-auto">
            <div className="flex items-center justify-end p-3">
              <div className="flex items-center space-x-2">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger>
                    <Button variant={"colorCompany"} className="text-xs w-full hidden md:block">
                      Thêm nhân viên mới
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full min-w-[90%] md:min-w-[70%]">
                    <DialogTitle className="text-2xl text-primary-backgroudPrimary">
                      Thêm nhân viên mới
                    </DialogTitle>
                    <Separator className="h-1" />
                    <UsersForm setOpen={setOpen} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </MyContext.Provider>

      </div>
      <MyContext.Provider value={{ forceUpdate }}>
        <>
          <DataTable columns={columns} data={data} />
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
