"use client";
import React, { useEffect, useState } from "react";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HeaderComponent from "@/components/shared/common/header";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  GetSalaryCompanyDetailParams,
  SalaryCompanyDetailType,
} from "@/types/salary-company.type";
import { salaryCompanyApi } from "@/apis/salary_company.api";
import { Button } from "@/components/ui/button";
import { Check, Copy, CreditCard, MoreVertical, Truck, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
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
export default function SalaryCompanyDetail({
  SearchParams,
}: {
  SearchParams: GetSalaryCompanyDetailParams;
}) {
  const [params, setParams] =
    React.useState<GetSalaryCompanyDetailParams>(SearchParams);
  const [data, setData] = React.useState<SalaryCompanyDetailType>({
    totalSalaryMaterial: 0,
    totalSalaryProduct: 0,
    totalSalaryTotal: 0,
    materialResponses: [],
    productBrokenResponses: [],
    productExportResponses: [],
    companyId: "",
    note: "",
    salary: 0,
    status: 0,
    totalSalaryBroken: 0,
    month: 0,
    year: 0,
    rateBroken: -999999,
    rateProduct: -999999,
    totalBroken: 0,
    totalMaterial: 0,
    totalProduct: 0,
  });

  const router = useRouter();
  const pathname = usePathname();
  const [note, setNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleChangeStatus = (status: number) => {
    salaryCompanyApi
      .updateStatusSalaryCompany({
        status: status,
        note: status === 1 ? note : "",
        companyId: params.CompanyId,
        month: parseInt(params.Month),
        year: parseInt(params.Year),
      })
      .then((res) => {
        setIsOpen(false);
        setData((prev) => {
          return {
            ...prev,
            status: status,
            note: note,
          };
        });
        toast.success("Thay đổi trạng thái thành công");
      })
      .catch((e) => {
        toast.error("Thay đổi trạng thái thất bại");
      });
  };

  useEffect(() => {
    salaryCompanyApi
      .getSalaryCompanyDetail({
        CompanyId: params.CompanyId,
        Month: params.Month,
        Year: params.Year,
      })
      .then((res) => {
        setData(res.data.data);
        console.log("SALARY COMPANY DETAIL API RESPONSE", res.data.data);
      })
      .catch((e) => {
        console.log("SALARY DETAIL API ERROR", e);
        setData({
          totalSalaryMaterial: 0,
          totalSalaryProduct: 0,
          totalSalaryTotal: 0,
          materialResponses: [],
          productBrokenResponses: [],
          productExportResponses: [],
          companyId: "",
          note: "",
          salary: 0,
          status: 0,
          totalSalaryBroken: 0,
          month: 0,
          year: 0,
          rateBroken: -999999,
          rateProduct: -999999,
          totalBroken: 0,
          totalMaterial: 0,
          totalProduct: 0,
        });
      })
      .finally(() => {
        router.push(
          `${pathname}?CompanyId=${params.CompanyId}&Year=${params.Year}&Month=${params.Month}`
        );
      });
  }, [params, router, pathname]);

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
                <CardDescription>Tổng chi phí</CardDescription>
                <CardTitle className="text-4xl text-primary">
                  {data.salary === 0
                    ? 0
                    : formatCurrencyWithNegative(data.totalSalaryTotal)}{" "}
                  VNĐ
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div className="text-xs text-muted-foreground">
                  +10% so với tháng trước
                </div> */}
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>Tông sản phẩm</CardDescription>
                <CardTitle className="text-4xl text-primary">
                  {data.totalProduct}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div className="text-xs text-muted-foreground">
                  +25% so với tháng trước
                </div> */}
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription>Tổng hàng hỏng</CardDescription>
                <CardTitle className="text-4xl text-primary">
                  {data.totalBroken}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div className="text-xs text-muted-foreground">
                  +10% so với tháng trước
                </div> */}
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
          <Tabs defaultValue="product">
            <div className="flex items-center">
              <TabsList className="">
                <TabsTrigger value="product">Sản phẩm</TabsTrigger>
                <TabsTrigger value="material">Nguyên liệu</TabsTrigger>
                <TabsTrigger value="broken">Hàng Lỗi</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
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
                  <SelectTrigger className="h-8 w-32">
                    <SelectValue placeholder="Chọn năm" />
                  </SelectTrigger>
                  <SelectContent>
                    {listYear.map((Year) => (
                      <SelectItem
                        key={Year}
                        className="hover:bg-gray-100 h-8"
                        value={Year.toString()}
                      >
                        Năm {Year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <SelectTrigger className="h-8 w-32">
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
            {/* ------------------------------------------------------------Product------------------------------------------------------------ */}
            <TabsContent value="product">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle className="mb-3 text-primary">
                    Sản phẩm tạo ra
                  </CardTitle>
                  <div className="flex">
                    <div>
                      Số lượng sản phẩm tạo ra trong tháng {params.Month} năm{" "}
                      {params.Year}
                    </div>
                    <div className="ml-auto">
                      Tổng chi phí tạo sản phẩm:{" "}
                      <span className="font-bold text-primary">
                        {data.totalSalaryProduct === 0
                          ? 0
                          : formatCurrencyWithNegative(
                              data.totalSalaryProduct
                            )}{" "}
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
                        <TableHead className="">Chi phí</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">
                          Tổng
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.productExportResponses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Không có dữ liệu nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.productExportResponses.map((item) => (
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
                              {formatCurrencyWithNegative(item.price)}
                            </TableCell>
                            <TableCell className="text-right hidden sm:table-cell">
                              {formatCurrencyWithNegative(
                                item.price * item.quantity
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
            {/* ------------------------------------------------------------Material------------------------------------------------------------ */}
            <TabsContent value="material">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle className="mb-3 text-primary">
                    Nguyên liệu đã giao
                  </CardTitle>
                  <div className="flex">
                    <div>
                      Số lượng nguyên liệu đã giao trong tháng {params.Month}{" "}
                      năm {params.Year}
                    </div>
                    <div className="ml-auto">
                      Tổng giá trị vật liệu:{" "}
                      <span className="font-bold text-primary">
                        {data.totalSalaryMaterial === 0
                          ? 0
                          : formatCurrencyWithNegative(
                              data.totalSalaryMaterial
                            )}{" "}
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
                        <TableHead className="">Tên nguyên liệu</TableHead>
                        <TableHead className="">Số lượng</TableHead>
                        <TableHead className="">Chi phí</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">
                          Tổng
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.materialResponses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Không có dữ liệu nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.materialResponses.map((item) => (
                          <TableRow
                            key={item.materialId}
                            className="hover:bg-accent"
                          >
                            <TableCell className="hidden sm:table-cell">
                              <div className="bg-gray-400 size-10">
                                <Image
                                  src={item.materialImage}
                                  alt={item.materialName}
                                  width={100}
                                  height={100}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="">
                              {item.materialName}
                            </TableCell>
                            <TableCell className="">
                              {item.quantity}
                              {/* <Badge
                              className="text-xs"
                              variant="secondary"
                            ></Badge> */}
                            </TableCell>

                            <TableCell className="">
                              {formatCurrencyWithNegative(item.price)}
                            </TableCell>
                            <TableCell className="text-right hidden sm:table-cell">
                              {formatCurrencyWithNegative(
                                item.price * item.quantity
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
            {/* ------------------------------------------------------------Broken------------------------------------------------------------ */}
            <TabsContent value="broken">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle className="mb-3 text-primary">
                    Sản phẩm lỗi
                  </CardTitle>
                  <div className="flex">
                    <div>
                      Số lượng sản phẩm lỗi phát hiện trong tháng {params.Month}{" "}
                      năm {params.Year}
                    </div>
                    <div className="ml-auto">
                      Tổng giá trị sản phẩm lỗi:{" "}
                      <span className="font-bold text-primary">
                        {data.totalSalaryBroken === 0
                          ? 0
                          : formatCurrencyWithNegative(
                              data.totalSalaryBroken
                            )}{" "}
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
                        <TableHead className="">Chi phí</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">
                          Tổng
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.productBrokenResponses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Không có dữ liệu nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.productBrokenResponses.map((item) => (
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
                              {formatCurrencyWithNegative(item.price)}
                            </TableCell>
                            <TableCell className="text-right hidden sm:table-cell">
                              {formatCurrencyWithNegative(
                                item.price * item.quantity
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
          <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg text-primary">
                  Thanh Toán
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Tháng {params.Month} Năm {params.Year}
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className={`h-8 gap-1 ${
                    data.status === 1
                      ? "text-destructive hover:text-destructive"
                      : "text-primary hover:text-primary"
                  }`}
                >
                  {data.status == 0 ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                  <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    {data.status == 0 ? (
                      <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger>Hoàn thành</DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-primary">
                              Hoàn thành trả lương
                            </DialogTitle>
                            <DialogDescription>
                              Bạn có chắc chắn muốn thanh toán lương cho công ty
                              này ?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-5">
                            <div>Ghi chú</div>
                            <Textarea
                              value={note}
                              onChange={(e) => {
                                setNote(e.target.value);
                              }}
                            ></Textarea>
                          </div>
                          <div className="mt-5 w-full flex justify-end">
                            <Button
                              variant="default"
                              className=""
                              onClick={() => {
                                handleChangeStatus(1);
                              }}
                            >
                              Hoàn thành
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger>Hủy thanh toán</DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-destructive">
                              Hủy thanh toán
                            </DialogTitle>
                            <DialogDescription>
                              Bạn có chắc chắn muốn hủy thanh toán lương cho
                              công ty này ?
                            </DialogDescription>
                          </DialogHeader>

                          <div className="mt-5 w-full flex justify-end">
                            <Button
                              variant="destructive"
                              className=""
                              onClick={() => {
                                handleChangeStatus(0);
                              }}
                            >
                              Hủy
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <div className="font-semibold">Chi tiết</div>
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tiền hàng</span>
                    <span>
                      {data.totalSalaryProduct === 0
                        ? "0"
                        : formatCurrencyWithNegative(data.totalSalaryProduct)}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tiền vật liệu</span>
                    <span>
                      -
                      {data.totalSalaryMaterial === 0
                        ? "0"
                        : formatCurrencyWithNegative(data.totalSalaryMaterial)}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Tiền hàng hỏng
                    </span>
                    <span>
                      -
                      {data.totalSalaryBroken === 0
                        ? "0"
                        : formatCurrencyWithNegative(data.totalSalaryBroken)}
                    </span>
                  </li>
                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Tổng</span>
                    <span>
                      {data.totalSalaryTotal === 0
                        ? "0"
                        : formatCurrencyWithNegative(data.totalSalaryTotal)}
                    </span>
                  </li>
                </ul>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Thông tin thanh toán</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt
                        className={`flex items-center gap-1 text-muted-foreground `}
                      >
                        Trạng thái
                      </dt>
                      <dd
                        className={`${
                          data.status === 0
                            ? "text-destructive"
                            : "text-primary"
                        }`}
                      >
                        {data.status === 0
                          ? "Chưa thanh toán"
                          : "Đã thanh toán"}
                      </dd>
                    </div>
                  </dl>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        Ghi chú
                      </dt>
                      <dd className="max-w-[150px] break-words">{data.note}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
