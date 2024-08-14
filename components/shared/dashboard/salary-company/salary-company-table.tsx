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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import HeaderComponent from "@/components/shared/common/header";
import { Button } from "@/components/ui/button";
import { SearchSalaryCompanyParams } from "@/types/salary-company.type";
import { salaryCompanyApi } from "@/apis/salary_company.api";
import { salaryCompanyStore } from "@/components/shared/dashboard/salary-company/salary-store";
import { Card } from "@/components/ui/card";

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
    const isNegative = valueString[0] === "-";
    valueString = valueString.replace(/\D/g, "");
    valueString = valueString.replace(/^0+/, "");
    if (valueString === "") return "0";
    let reversed = valueString.split("").reverse().join("");
    let formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";
    let formatted = formattedReversed.split("").reverse().join("");
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
        setTotalPage(data.data.totalPages);
        setTableData(data.data.data);
      } catch (error) {
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
                PageIndex: 1,
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
                  PageIndex: 1,
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
                  PageIndex: 1,
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
      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên công ty</TableHead>
              <TableHead>Tên giám đốc</TableHead>
              <TableHead>Chi phí</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((item, index) => (
                <TableRow
                  key={item.id}
                  onClick={() => {
                    router.push(
                      `/dashboard/salary-company/detail?MonthlyCompanySalaryId=${item.id}&CompanyId=${item.companyId}&Year=${params.Year}&Month=${params.Month}`
                    );
                  }}
                  className="hover:bg-gray-100 dark:hover:bg-[#685d55] hover:cursor-pointer"
                >
                  <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white">
                    {item.companyName}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white">
                    {item.directorName}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white">
                    {formatCurrencyWithNegative(item.salary)}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white">
                    {item.status === 0 ? "Chưa thanh toán" : "Đã thanh toán"}
                  </TableCell>
                </TableRow>
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
