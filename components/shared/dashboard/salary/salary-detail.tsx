"use client";
import React from "react";
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

import { Badge } from "@/components/ui/badge";

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
import { SalaryDetailParams } from "@/types/salary.type";
import HeaderComponent from "@/components/shared/common/header";
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
  const [params, setParams] = React.useState<SalaryDetailParams>(SearchParams);
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
                  5.500.000 VNĐ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +10% so với tháng trước
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>Tông số công</CardDescription>
                <CardTitle className="text-4xl text-primary">129</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +25% so với tháng trước
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription>Thời gian tăng ca</CardDescription>
                <CardTitle className="text-4xl text-primary">123 h</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +10% so với tháng trước
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
                    <div>Số lượng sản phẩm tạo ra trong tháng 7 năm 2024</div>
                    <div className="ml-auto">
                      Tổng lương sản phẩm:{" "}
                      <span className="font-bold text-primary">8.300.000</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ảnh</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Tên sản phẩm
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Số lượng
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Giai đoạn
                        </TableHead>
                        <TableHead className="text-right">Lương</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="bg-accent">
                        <TableCell>
                          <div className="font-medium">Liam Johnson</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            liam@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          Sale
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            Fulfilled
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-06-23
                        </TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Olivia Smith</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            olivia@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          Refund
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="outline">
                            Declined
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-06-24
                        </TableCell>
                        <TableCell className="text-right">$150.00</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Noah Williams</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            noah@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          Subscription
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            Fulfilled
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-06-25
                        </TableCell>
                        <TableCell className="text-right">$350.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Emma Brown</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            emma@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          Sale
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            Fulfilled
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-06-26
                        </TableCell>
                        <TableCell className="text-right">$450.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Liam Johnson</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            liam@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          Sale
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            Fulfilled
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-06-23
                        </TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Olivia Smith</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            olivia@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          Refund
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="outline">
                            Declined
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-06-24
                        </TableCell>
                        <TableCell className="text-right">$150.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Emma Brown</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            emma@example.com
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          Sale
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            Fulfilled
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-06-26
                        </TableCell>
                        <TableCell className="text-right">$450.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-10">
          <SalaryHistoryReceived />
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