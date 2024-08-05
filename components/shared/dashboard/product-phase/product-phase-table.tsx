"use client";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productPhaseStore } from "@/components/shared/dashboard/product-phase/product-phase-store";
import { SearchProductPhaseParams } from "@/types/product-phase.type";
import { usePathname, useRouter } from "next/navigation";
import { productPhaseApi } from "@/apis/product-phase.api";
import Image from "next/image";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { companyApi } from "@/apis/company.api";
import { CompanyResponse } from "@/types/company.type";
import { Combobox } from "@/components/shared/common/combobox/combobox";
import { ComboboxDataType } from "@/components/shared/common/combobox/combobox-for-form";
import { Input } from "@/components/ui/input";
import { attendanceApi } from "@/apis/attendance.api";
import HeaderComponent from "@/components/shared/common/header";
import ProductPhaseChangeQuantityType from "@/components/shared/dashboard/product-phase/product-phase-change-quantity-type";

export default function ProductPhaseTable({
  searchParams,
}: {
  searchParams: SearchProductPhaseParams;
}) {
  const {
    tableData,
    setTableData,
    companyData,
    setCompanyData,
    force,
    setPhaseData,
  } = productPhaseStore();
  const [params, setParams] =
    React.useState<SearchProductPhaseParams>(searchParams);
  const [loading, setLoading] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    attendanceApi
      .getAllPhase()
      .then((res) => {
        setPhaseData(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [setPhaseData]);

  useEffect(() => {
    let firtCompany: CompanyResponse;
    let listData: ComboboxDataType[] = [];
    const getOwnCompany = async () => {
      try {
        const res = await companyApi.getCompanyByType(0);
        firtCompany = res.data.data[0];
        listData = res.data.data.map((item) => ({
          label: item.name,
          value: item.name,
        }));
      } catch (e) {
        console.log(e);
      }
    };

    const getThirdCompany = async () => {
      try {
        const res = await companyApi.getCompanyByType(2);
        listData = listData.concat(
          res.data.data.map((item) => ({
            label: item.name,
            value: item.name,
          }))
        );
      } catch (error) { }
    };
    const fetchData = async () => {
      try {
        await getOwnCompany();
        await getThirdCompany();
        setCompanyData(listData);
        const res = await productPhaseApi.searchProductPhase({
          PageIndex: params.PageIndex,
          PageSize: params.PageSize,
          SearchCompany: params.SearchCompany
            ? params.SearchCompany
            : firtCompany.name,
          SearchPhase: params.SearchPhase,
          SearchProduct: params.SearchProduct,
        });
        console.log("TABLE DATA", res.data.data.data);
        setTableData(res.data.data.data);
        setTotal(res.data.data.totalPages);

        router.push(
          `${pathname}?PageIndex=${params.PageIndex}&SearchCompany=${params.SearchCompany}&SearchPhase=${params.SearchPhase}&SearchProduct=${params.SearchProduct}`
        );
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [router, params, pathname, setTableData, setCompanyData, force]);

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
        title="Quản lý kho"
        description={`Quản lý các giai đoạn của từng sản phẩm.`}
      />
      <div className="mb-3 grid grid-cols-10">
        <div className="col-span-2">
          <Combobox
            data={companyData}
            title="Vui lòng chọn công ty"
            setValue={(value: string) => {
              setParams({ ...params, SearchCompany: value });
            }}
            value={
              params.SearchCompany
                ? params.SearchCompany
                : companyData[0]?.value
            }
          />
        </div>
        <div className="col-span-2">
          <Select
            value={params.SearchPhase}
            onValueChange={(value) => {
              if (value == "-1") {
                setParams({ ...params, SearchPhase: "" });
                return;
              }
              setParams({ ...params, SearchPhase: value });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn giai đoạn" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="PH_001">Giai đoạn tạo khung</SelectItem>
                <SelectItem value="PH_002">Giai đoạn gia công</SelectItem>
                <SelectItem value="PH_003">
                  Giai đoạn hoàn thiện đóng gói
                </SelectItem>
                <SelectItem value="-1">Bỏ chọn</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Input
          className="col-end-11 col-span-5 "
          value={params.SearchProduct}
          placeholder="Tìm kiếm theo tên hoặc mã sản phẩm"
          onChange={(event) => {
            setParams({ ...params, SearchProduct: event.target.value });
          }}
        />
      </div>
      <Card>
        <CardContent className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ảnh</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Mã</TableHead>
                <TableHead>Giai đoạn</TableHead>
                <TableHead>Bình thường</TableHead>
                <TableHead>Lỗi bên mình</TableHead>
                <TableHead>Lỗi bên hợp tác</TableHead>
                <TableHead>Hàng hỏng</TableHead>
                {/* <TableHead className="text-center">Hành động</TableHead> */}
              </TableRow>
            </TableHeader>

            <TableBody>
              {tableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((item, index) => (
                  <ProductPhaseChangeQuantityType
                    index={index}
                    key={item.productId + item.phaseId}
                  >
                    <TableRow className="hover:cursor-pointer">
                      <TableCell>
                        <div className="size-10 bg-gray-400">
                          <Image
                            className="object-cover size-10"
                            src={item.imageUrl}
                            width={100}
                            height={100}
                            alt={item.productName}
                          />
                        </div>
                      </TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.productCode}</TableCell>
                      <TableCell>{item.phaseDescription}</TableCell>
                      <TableCell>
                        {formatCurrency(item.availableQuantity)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.failureAvailabeQuantity)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.errorAvailableQuantity)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.brokenAvailableQuantity)}
                      </TableCell>
                      {/* <TableCell className="flex justify-center">
                      <ProductPhaseAction index={index} />
                    </TableCell> */}
                    </TableRow>
                  </ProductPhaseChangeQuantityType>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
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
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setParams((prev) => {
              return { ...prev, PageIndex: Number(prev.PageIndex) + 1 };
            });
          }}
          disabled={Number(searchParams.PageIndex) >= total}
        >
          Tiếp
        </Button>
      </div>
    </>
  );
}
