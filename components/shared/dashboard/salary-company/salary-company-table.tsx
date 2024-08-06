"use client";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import HeaderComponent from "@/components/shared/common/header";
import { Button } from "@/components/ui/button";
import { SearchSalaryCompanyParams } from "@/types/salary-company.type";
import { salaryCompanyApi } from "@/apis/salary_company.api";
import { salaryCompanyStore } from "@/components/shared/dashboard/salary-company/salary-store";

const dataNow = new Date();
const YearNow = dataNow.getFullYear();
const listYear = [YearNow, YearNow - 1, YearNow - 2, YearNow - 3];
const listMonth = [
  { value: "1", label: "Tháng 1" },
  { value: "2", label: "Tháng 2" },
  { value: "3", label: "Tháng 3" },
  { value: "4", label: "Tháng 4" },
  { value: "5", label: "Tháng 5" },
  { value: "6", label: "Tháng 6" },
  { value: "7", label: "Tháng 7" },
  { value: "8", label: "Tháng 8" },
  { value: "9", label: "Tháng 9" },
  { value: "10", label: "Tháng 10" },
  { value: "11", label: "Tháng 11" },
  { value: "12", label: "Tháng 12" },
];

export default function SalaryCompanyTable({
  searchParams,
}: {
  searchParams: SearchSalaryCompanyParams;
}) {
  const { tableData, setTableData } = salaryCompanyStore();
  const [params, setParams] = useState(searchParams);
  const pathname = usePathname();
  const router = useRouter();
  const [totalPage, setTotalPage] = useState(0);

  const formatCurrencyWithNegative = (value: any): string => {
    if (value === null || value === undefined) return "";
    let valueString = value.toString();
    // Check if the value is negative
    const isNegative = valueString[0] === "-";
    // Remove all non-numeric characters, except the minus sign if it is the first character
    valueString = valueString.replace(/\D/g, "");
    // Remove leading zeros
    valueString = valueString.replace(/^0+/, "");
    if (valueString === "") return "0";
    // Reverse the string to handle grouping from the end
    let reversed = valueString.split("").reverse().join("");
    // Add dots every 3 characters
    let formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";
    // Reverse back to original order
    let formatted = formattedReversed.split("").reverse().join("");
    // Add the negative sign back if it was originally negative
    if (isNegative) {
      formatted = "-" + formatted;
    }
    return formatted;
  };

  useEffect(() => {
    const fetchGetSalarys = async () => {
      try {
        const { data } = await salaryCompanyApi.searchSalaryCompany({
          Month: params.Month,
          Year: params.Year,
          SearchCompany: params.SearchCompany,
          PageIndex: params.PageIndex,
          PageSize: 10,
        });
        console.log("Salary From API", data.data.data);
        setTotalPage(data.data.totalPages);
        setTableData(data.data.data);
      } catch (error) {
        console.log("Error", error);
      } finally {
        router.push(
          `${pathname}?SearchCompany=${params.SearchCompany}&Year=${params.Year}&Month=${params.Month}&PageIndex=${params.PageIndex}`
        );
      }
    };
    fetchGetSalarys();
  }, [params, pathname, router, setTableData]);

  return (
    <div className="p-2 ">
      <HeaderComponent
        title="Danh sách chi phí gia công"
        description={`Danh sách chi phí gia công của tháng ${params.Month} năm ${params.Year}.`}
      />
      <div className="mb-5 mt-2 grid grid-cols-12 space-y-1 grid-rows-2 xl:space-y-0 xl:grid-rows-1">
        <Input
          className="col-span-11 xl:col-span-6 xl:row-start-1"
          placeholder="Tìm kiếm công ty"
          value={params.SearchCompany}
          onChange={(event) => {
            setParams((prev) => {
              return {
                ...prev,
                SearchCompany: event.target.value,
              };
            });
          }}
        />
        <div className="col-span-6 row-start-2 xl:row-start-1 xl:row-span-2 xl:col-start-7 xl:col-span-2 md:ml-2">
          <Select
            value={params.Year}
            onValueChange={(value) => {
              setParams((prev) => {
                return {
                  ...prev,
                  Year: value,
                };
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {listYear.map((Year) => (
                <SelectItem
                  key={Year}
                  className="hover:bg-gray-100"
                  value={Year.toString()}
                >
                  Năm {Year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-6 row-start-2 xl:row-start-1 xl:row-span-2 xl:col-start-9 xl:col-span-2 md:ml-2">
          <Select
            value={params.Month}
            onValueChange={(value) => {
              setParams((prev) => {
                return {
                  ...prev,
                  Month: value,
                };
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn tháng" />
            </SelectTrigger>
            <SelectContent>
              {listMonth.map((Month) => (
                <SelectItem
                  key={Month.value}
                  className="hover:bg-gray-100"
                  value={Month.value.toString()}
                >
                  {Month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Tên công ty
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Tên Chủ
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Chi phí
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 ">
                    {tableData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-4 dark:text-white"
                        >
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      tableData.map((item, index) => (
                        <tr
                          key={item.id}
                          onClick={() => {
                            router.push(
                              `/dashboard/salary-company/detail?MonthlyCompanySalaryId=${item.id}&CompanyId=${item.companyId}&Year=${params.Year}&Month=${params.Month}`
                            );
                          }}
                          className="hover:bg-gray-100 dark:hover:bg-[#685d55] hover:cursor-pointer "
                        >
                          <td className="px-6 py-4 text-sm text-gray-800 dark:text-white">
                            {item.companyName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 dark:text-white">
                            {item.directorName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 dark:text-white">
                            {formatCurrencyWithNegative(item.salary)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 dark:text-white">
                            {item.status === 0
                              ? "Chưa thanh toán"
                              : "Đã thanh toán"}
                          </td>
                        </tr>
                      ))
                    )}
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
              return { ...prev, PageIndex: Number(prev.PageIndex) - 1 };
            });
          }}
          disabled={Number(searchParams.PageIndex) === 1}
        >
          Trang trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setParams((prev) => {
              return { ...prev, PageIndex: Number(prev.PageIndex) + 1 };
            });
          }}
          disabled={Number(searchParams.PageIndex) >= totalPage}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}
