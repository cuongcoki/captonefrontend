import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import SalaryHistoryReceived from "@/components/shared/dashboard/salary/salary-history/salary-history-received";
import SalaryHistorySalaryByDay from "@/components/shared/dashboard/salary/salary-history/salary-history-salary-by-day";
import SalaryHistorySalaryByOverTime from "@/components/shared/dashboard/salary/salary-history/salary-history-salary-by-overtime";
export default function SalaryDetail({ id }: { id: string }) {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardDescription>Lương khả dụng</CardDescription>
              <CardTitle className="text-4xl">5.500.000 VNĐ</CardTitle>
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
              <CardTitle className="text-4xl">129</CardTitle>
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
              <CardTitle className="text-4xl">123 h</CardTitle>
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
            <TabsList></TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-sm"
                  >
                    <span className="sr-only sm:not-sr-only">Năm 2024</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Fulfilled
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-sm"
                  >
                    <span className="sr-only sm:not-sr-only">Tháng 7</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Fulfilled
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <TabsContent value="week">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Sản phẩm tạo ra</CardTitle>
                <CardDescription className="flex">
                  <div>Số lượng sản phẩm tạo ra trong tháng 7 năm 2024</div>
                  <div className="ml-auto">
                    Tổng lương sản phẩm:{" "}
                    <span className="font-bold">8.300.000</span>
                  </div>
                </CardDescription>
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
          <TabsList className="bg-gray-200 text-sm">
            <TabsTrigger value="salary">Lương</TabsTrigger>
            <TabsTrigger value="over-time">Tăng ca</TabsTrigger>
          </TabsList>
          <TabsContent value="salary">
            <SalaryHistorySalaryByDay />
          </TabsContent>
          <TabsContent value="over-time">
            <SalaryHistorySalaryByOverTime />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
