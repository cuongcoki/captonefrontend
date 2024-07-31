"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SalaryHistoryReceived from "@/components/shared/dashboard/salary/salary-history/salary-history-received";
import SalaryHistorySalaryByDay from "@/components/shared/dashboard/salary/salary-history/salary-history-salary-by-day";
import SalaryHistorySalaryByOverTime from "@/components/shared/dashboard/salary/salary-history/salary-history-salary-by-overtime";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SalaryDetailParams, SalaryDetailType } from "@/types/salary.type";
import HeaderComponent from "@/components/shared/common/header";
import { salaryApi } from "@/apis/salary.api";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import SalaryPay from "@/components/shared/dashboard/salary/salary-pay";
import { salaryStore } from "@/components/shared/dashboard/salary/salary-store";
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
export default function SalaryDetail({
  id,
  SearchParams,
}: {
  id: string;
  SearchParams: SalaryDetailParams;
}) {
  const { setSalaryAvailiable } = salaryStore();
  const [params, setParams] = React.useState<SalaryDetailParams>(SearchParams);
  const [data, setData] = React.useState<SalaryDetailType>({
    accountBalance: 0,
    month: 1,
    productWorkingResponses: [],
    totalSalaryProduct: 0,
    totalWorkingDays: 0,
    totalWorkingHours: 0,
    year: 0,
    salary: 0,
    rate: -999999999,
    rateOverTime: -999999999,
    rateWorkingDay: -999999999,
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    salaryApi
      .getSalaryDetail({
        userId: id,
        month: params.month,
        year: params.year,
      })
      .then((res) => {
        setData(res.data.data);
        setSalaryAvailiable(res.data.data.accountBalance);
        console.log("SALARY DETAIL API RESPONSE", res.data);
        router.push(`${pathname}?year=${params.year}&month=${params.month}`);
      })
      .catch((e) => {
        console.log("SALARY DETAIL API ERROR", e);
        setData({
          accountBalance: 0,
          month: 1,
          productWorkingResponses: [],
          totalSalaryProduct: 0,
          totalWorkingDays: 0,
          totalWorkingHours: 0,
          year: 0,
          salary: 0,
          rate: -999999999,
          rateOverTime: -999999999,
          rateWorkingDay: -999999999,
        });
      });
  }, [params, id, router, pathname, setSalaryAvailiable]);

  const formatCurrency = (value: any): string => {
    if (!value) return "";
    let valueString = value.toString();

    // Remove all non-numeric characters, including dots
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

    return formatted;
  };
  return (
    <>
      <HeaderComponent
        title="Chi tiết lương"
        description="Chi tiết lương của nhân viên"
      />
      <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardDescription>Lương khả dụng</CardDescription>
                <CardTitle className="text-4xl text-primary">
                  {data.salary === 0 ? 0 : formatCurrency(data.salary)} VNĐ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {data.rate != -999999999 &&
                    `${data.rate}% so với tháng trước`}
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>Tông số công</CardDescription>
                <CardTitle className="text-4xl text-primary">
                  {data.totalWorkingDays}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {data.rateWorkingDay != -999999999 &&
                    `${data.rateWorkingDay}% so với tháng trước`}
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription>Thời gian tăng ca</CardDescription>
                <CardTitle className="text-4xl text-primary">
                  {data.totalWorkingHours} h
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {data.rateOverTime != -999999999 &&
                    `${data.rateOverTime}% so với tháng trước`}
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
          <Tabs defaultValue="week">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
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
                  <SelectTrigger className="h-8 w-32">
                    <SelectValue placeholder="Chọn năm" />
                  </SelectTrigger>
                  <SelectContent>
                    {listYear.map((year) => (
                      <SelectItem
                        key={year}
                        className="hover:bg-gray-100 h-8"
                        value={year.toString()}
                      >
                        Năm {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <SelectTrigger className="h-8 w-32">
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
            <TabsContent value="week">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle className="mb-3 text-primary">
                    Sản phẩm tạo ra
                  </CardTitle>
                  <div className="flex">
                    <div>
                      Số lượng sản phẩm tạo ra trong tháng {params.month} năm{" "}
                      {params.year}
                    </div>
                    <div className="ml-auto">
                      Tổng lương sản phẩm:{" "}
                      <span className="font-bold text-primary">
                        {data.totalSalaryProduct === 0
                          ? 0
                          : formatCurrency(data.totalSalaryProduct)}{" "}
                        VNĐ
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden sm:table-cell">
                          Ảnh
                        </TableHead>
                        <TableHead className="">Tên sản phẩm</TableHead>
                        <TableHead className="">Số lượng</TableHead>
                        <TableHead className="">Lương</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">
                          Tổng
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.productWorkingResponses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Không có dữ liệu nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.productWorkingResponses.map((item) => (
                          <TableRow
                            key={item.productId}
                            className="hover:bg-accent"
                          >
                            <TableCell className="hidden sm:table-cell">
                              <div className="bg-gray-400 size-10">
                                <Image
                                  src={item.productImage}
                                  alt={item.productName}
                                  width={100}
                                  height={100}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="">
                              {item.productName}
                            </TableCell>
                            <TableCell className="">
                              {item.quantity}
                              {/* <Badge
                              className="text-xs"
                              variant="secondary"
                            ></Badge> */}
                            </TableCell>

                            <TableCell className="">
                              {formatCurrency(item.salaryPerProduct)}
                            </TableCell>
                            <TableCell className="text-right hidden sm:table-cell">
                              {formatCurrency(
                                item.salaryPerProduct * item.quantity
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-10">
          <SalaryPay id={id} />
          <SalaryHistoryReceived id={id} />
          <Tabs defaultValue="salary">
            <TabsList className="bg-gray-200 text-sm dark:bg-primary">
              <TabsTrigger value="salary" className="text-white">
                Lương
              </TabsTrigger>
              <TabsTrigger value="over-time" className="text-white">
                Tăng ca
              </TabsTrigger>
            </TabsList>
            <TabsContent value="salary">
              <SalaryHistorySalaryByDay id={id} />
            </TabsContent>
            <TabsContent value="over-time">
              <SalaryHistorySalaryByOverTime id={id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
