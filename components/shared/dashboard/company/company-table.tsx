"use client";
import { companyApi } from "@/apis/company.api";
import { CompanyAdd } from "@/components/shared/dashboard/company/company-add";
import { companyStore } from "@/components/shared/dashboard/company/company-store";
import CompanyUpdate from "@/components/shared/dashboard/company/company-update";
import { Input } from "@/components/ui/input";
import { CompanyParams,  } from "@/types/company.type";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import HeaderComponent from "@/components/shared/common/header";
import { Card } from "@/components/ui/card";
type CompanyContextType = {
  ForceRender: () => void;
};
export const CompanyContext = React.createContext<CompanyContextType>({
  ForceRender: () => {},
});

export default function CompanyTable({ searchParams }: CompanyParams) {
  const { tableData, setTableData } = companyStore();
  const [params, setParams] = useState(searchParams);
  const pathname = usePathname();
  const router = useRouter();
  const [forceUpdate, setForceUpdate] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const ForceRender = () => {
    setForceUpdate((prev) => prev + 1);
  };
  const handleChangeCompanyType = (value: string) => {
    if (value === "-1") {
      setParams((prev) => {
        return { ...prev, companyType: "" };
      });
    } else {
      setParams((prev) => {
        return { ...prev, companyType: value };
      });
    }
  };

  useEffect(() => {
    companyApi
      .searchCompany({
        Name: params.name,
        Address: "",
        PhoneNumber: "",
        Email: "",
        DirectorName: "",
        CompanyType: params.companyType,
        PageIndex: params.pageIndex,
        PageSize: 10,
      })
      .then(({ data }) => {
        setTotalPage(data.data.totalPages);
        setTableData(data.data.data);
      })
      .catch((error) => {
      })
      .finally(() => {
        router.push(
          `${pathname}?name=${params.name}&companyType=${params.companyType}&pageIndex=${params.pageIndex}`
        );
      });
  }, [params, pathname, router, forceUpdate, tableData, setTableData]);
  return (
    <div>
      <HeaderComponent
        title="Danh sách công ty"
        description="Danh sách các công ty đặt mua hàng - công ty hợp tác."
      />
      <div className="mb-5 mt-2 grid grid-cols-12 space-y-1 grid-rows-2 xl:space-y-0 xl:grid-rows-1">
        <Input
          className="col-span-11 xl:col-span-6 xl:row-start-1"
          placeholder="Tìm kiếm công ty"
          value={params.name}
          onChange={(event) => {
            setParams((prev) => {
              return {
                ...prev,
                name: event.target.value,
              };
            });
          }}
        />
        <div className="col-span-6 row-start-2 xl:row-start-1 xl:row-span-2 xl:col-start-7 xl:col-span-2 md:ml-2">
          <Select
            value={params.companyType}
            onValueChange={handleChangeCompanyType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại công ty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="hover:bg-gray-100" value="0">
                Nhà xưởng
              </SelectItem>
              <SelectItem className="hover:bg-gray-100" value="1">
                Công ty mua đặt hàng
              </SelectItem>
              <SelectItem className="hover:bg-gray-100" value="2">
                Công ty hợp tác sản xuất
              </SelectItem>
              <SelectItem className="hover:bg-gray-100" value="-1">
                Bỏ chọn
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="row-start-2 col-start-9 md:col-start-11 xl:row-start-1 xl:col-start-12">
          <CompanyContext.Provider value={{ ForceRender }}>
            <CompanyAdd />
          </CompanyContext.Provider>
        </div>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên công ty</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Loại công ty</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((company, index) => (
                <CompanyUpdate index={index} key={company.id}>
                  <TableRow className="hover:bg-gray-100 dark:hover:bg-[#685d55] hover:cursor-pointer">
                    <TableCell className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      {company.name}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white">
                      {company.address}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white">
                      {company.email}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white">
                      {company.companyTypeDescription}
                    </TableCell>
                  </TableRow>
                </CompanyUpdate>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="grid grid-cols-2 w-[300px] justify-end space-x-2 py-4 ml-auto mr-5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setParams((prev) => {
              return { ...prev, pageIndex: Number(prev.pageIndex) - 1 };
            });
          }}
          disabled={Number(searchParams.pageIndex) === 1}
        >
          Trang trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setParams((prev) => {
              return { ...prev, pageIndex: Number(prev.pageIndex) + 1 };
            });
          }}
          disabled={Number(searchParams.pageIndex) >= totalPage}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}
