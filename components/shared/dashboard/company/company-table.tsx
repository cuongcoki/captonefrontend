"use client";
import { companyApi } from "@/apis/company.api";
import { CompanyAdd } from "@/components/shared/dashboard/company/company-add";
import { companyStore } from "@/components/shared/dashboard/company/company-store";
import CompanyUpdate from "@/components/shared/dashboard/company/company-update";
import { Input } from "@/components/ui/input";
import { CompanyParams, CompanyResponse } from "@/types/company.type";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
    if (value === params.companyType) {
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
        // CompanyType: searchParams.companyType,
        PageIndex: params.pageIndex,
        PageSize: 10,
      })
      .then(({ data }) => {
        console.log("Company From API", data.data.data);
        setTotalPage(data.data.totalPages);
        setTableData(data.data.data);
      })
      .catch((error) => {
        console.log("Error", error);
      })
      .finally(() => {
        router.push(
          `${pathname}?name=${params.name}&companyType=${params.companyType}&pageIndex=${params.pageIndex}`
        );
      });
  }, [params, pathname, router, forceUpdate, tableData, setTableData]);
  return (
    <div className="p-2">
      <div className="mb-5 mt-2 grid grid-cols-12">
        <Input
          className="col-span-6"
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
        <div className="col-span-2 ml-2">
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
            </SelectContent>
          </Select>
        </div>
        <div className="col-start-12">
          <CompanyContext.Provider value={{ ForceRender }}>
            <CompanyAdd />
          </CompanyContext.Provider>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Tên công ty
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Địa chỉ
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Loại công ty
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tableData.map((company, index) => (
                      <CompanyUpdate index={index} key={company.id}>
                        <tr className="hover:bg-gray-100 hover:cursor-pointer">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {company.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {company.address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {company.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {company.companyTypeDescription}
                          </td>
                        </tr>
                      </CompanyUpdate>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
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
          Previous
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
          Next
        </Button>
      </div>
    </div>
  );
}
