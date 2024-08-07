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
import { salaryStore } from "@/components/shared/dashboard/salary/salary-store";
import { SalaryType, SearchSalaryParams } from "@/types/salary.type";
import Image from "next/image";
import HeaderComponent from "@/components/shared/common/header";
import { salaryApi } from "@/apis/salary.api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const dataNow = new Date();
const yearNow = dataNow.getFullYear();
const listYear = [yearNow, yearNow - 1, yearNow - 2, yearNow - 3];
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

export default function SalaryTable({ searchParams }: SearchSalaryParams) {
  const { tableData, setTableData } = salaryStore();
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
        const { data } = await salaryApi.getSalaries({
          searchUser: params.searchUser,
          month: Number(params.month),
          year: Number(params.year),
          PageIndex: Number(params.pageIndex),
          PageSize: 10,
        });
        console.log("Salary From API", data.data.data);
        setTotalPage(data.data.totalPages);
        setTableData(data.data.data);
      } catch (error) {
        console.log("Error", error);
      } finally {
        router.push(
          `${pathname}?searchUser=${params.searchUser}&year=${params.year}&month=${params.month}&pageIndex=${params.pageIndex}`
        );
      }
    };
    fetchGetSalarys();
  }, [params, pathname, router, setTableData]);

  return (
    <div className="p-2 ">
      <HeaderComponent
        title="Danh sách lương"
        description={`Danh sách lương nhân viên của tháng ${params.month} năm ${params.year}.`}
      />
      <div className="mb-5 mt-2 grid grid-cols-12 space-y-1 grid-rows-2 xl:space-y-0 xl:grid-rows-1">
        <Input
          className="col-span-11 xl:col-span-6 xl:row-start-1"
          placeholder="Tìm kiếm nhân viên"
          value={params.searchUser}
          onChange={(event) => {
            setParams((prev) => {
              return {
                ...prev,
                searchUser: event.target.value,
              };
            });
          }}
        />
        <div className="col-span-6 row-start-2 xl:row-start-1 xl:row-span-2 xl:col-start-7 xl:col-span-2 md:ml-2">
          <Select
            value={params.year}
            onValueChange={(value) => {
              setParams((prev) => {
                return {
                  ...prev,
                  year: value,
                };
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {listYear.map((year) => (
                <SelectItem
                  key={year}
                  className="hover:bg-gray-100"
                  value={year.toString()}
                >
                  Năm {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-6 row-start-2 xl:row-start-1 xl:row-span-2 xl:col-start-9 xl:col-span-2 md:ml-2">
          <Select
            value={params.month}
            onValueChange={(value) => {
              setParams((prev) => {
                return {
                  ...prev,
                  month: value,
                };
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn tháng" />
            </SelectTrigger>
            <SelectContent>
              {listMonth.map((month) => (
                <SelectItem
                  key={month.value}
                  className="hover:bg-gray-100"
                  value={month.value.toString()}
                >
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh</TableHead>
              <TableHead>Tên nhân viên</TableHead>
              <TableHead>Lương tháng</TableHead>
              <TableHead>Lương khả dụng</TableHead>
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
              tableData.map((item, index) => (
                <TableRow
                  key={item.id}
                  onClick={() => {
                    router.push(
                      `/dashboard/salary/detail/${item.userId}?year=${params.year}&month=${params.month}`
                    );
                  }}
                  className="hover:bg-gray-100 dark:hover:bg-[#685d55] hover:cursor-pointer"
                >
                  <TableCell className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-white">
                    <div className="w-24 h-32 bg-gray-400">
                      <Image
                        src={item.avatar}
                        alt={item.fullName}
                        width={300}
                        height={400}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white">
                    {item.fullName}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white">
                    {formatCurrencyWithNegative(item.salary)}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white">
                    {formatCurrencyWithNegative(item.accountBalance)}
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
