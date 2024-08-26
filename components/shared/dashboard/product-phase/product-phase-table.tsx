"use client";
import React, { useEffect, useRef, useState } from "react";
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
import useDebounce from "@/components/shared/common/customer-hook/use-debounce";

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
    setOwnCompanyData,
    CompanyThirdData,
    setCompanyThirdData,
  } = productPhaseStore();
  const [params, setParams] =
    React.useState<SearchProductPhaseParams>(searchParams);
  const paramsDebounce = useDebounce(params, 300);
  const [total, setTotal] = React.useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const CompanyIDSetRef = useRef(new Set<string>());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    attendanceApi
      .getAllPhase()
      .then((res) => {
        setPhaseData(res.data.data);
      })
      .catch((e) => {
        // console.log(e);
      });
  }, [setPhaseData]);

  useEffect(() => {
    setIsLoading(true);
    let firtCompany: CompanyResponse;
    let listData: ComboboxDataType[] = [];
    const getOwnCompany = async () => {
      try {
        const res = await companyApi.getCompanyByType(0);
        firtCompany = res.data.data[0];
        listData = res.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        res.data.data.forEach((item) => {
          CompanyIDSetRef.current.add(item.id);
        });
        setOwnCompanyData(listData);
      } catch (e) {
        // console.log(e);
      }
    };

    const getThirdCompany = async () => {
      try {
        const res = await companyApi.getCompanyByType(2);
        listData = listData.concat(
          res.data.data.map((item) => ({
            label: item.name,
            value: item.id,
          }))
        );
      } catch (error) {}
    };
    const fetchData = async () => {
      try {
        await getOwnCompany();
        await getThirdCompany();
        setCompanyData(listData);
        if (
          CompanyIDSetRef.current.has(
            paramsDebounce.SearchCompany !== ""
              ? paramsDebounce.SearchCompany
              : firtCompany.id
          )
        ) {
          const res = await productPhaseApi.searchProductPhase({
            PageIndex: paramsDebounce.PageIndex,
            PageSize: paramsDebounce.PageSize,
            SearchCompany:
              paramsDebounce.SearchCompany !== ""
                ? paramsDebounce.SearchCompany
                : firtCompany.id,
            SearchPhase: paramsDebounce.SearchPhase,
            SearchProduct: paramsDebounce.SearchProduct,
          });
          // console.log("TABLE DATA", res.data.data.data);
          setTableData(res.data.data.data);
          setTotal(res.data.data.totalPages);

          router.push(
            `${pathname}?PageIndex=${paramsDebounce.PageIndex}&SearchCompany=${paramsDebounce.SearchCompany}&SearchPhase=${paramsDebounce.SearchPhase}&SearchProduct=${paramsDebounce.SearchProduct}`
          );
        } else {
          const res = await productPhaseApi.searchProductPhaseShip(
            paramsDebounce.SearchProduct,
            paramsDebounce.SearchCompany,
            paramsDebounce.PageIndex,
            paramsDebounce.PageSize
          );
          setTableData(res.data.data.data);
          setTotal(res.data.totalPages);
          router.push(
            `${pathname}?PageIndex=${paramsDebounce.PageIndex}&SearchCompany=${paramsDebounce.SearchCompany}&SearchProduct=${paramsDebounce.SearchProduct}`
          );
        }
      } catch (e) {
        // console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // console.log("PRODUCT PHASE RERENDER");
  }, [
    router,
    paramsDebounce,
    pathname,
    setTableData,
    setCompanyData,
    force,
    setOwnCompanyData,
    setCompanyThirdData,
  ]);

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
      <div className="flex flex-col md:flex-row   gap-3 mb-5">
        <Input
          className="md:w-[500px] ww-full"
          value={params.SearchProduct}
          placeholder="Tìm kiếm theo tên hoặc mã sản phẩm"
          onChange={(event) => {
            setParams({
              ...params,
              SearchProduct: event.target.value,
              PageIndex: 1,
            });
          }}
        />
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <div>
            <Combobox
              data={companyData}
              title="Vui lòng chọn công ty"
              setValue={(value: string) => {
                setParams({ ...params, SearchCompany: value, PageIndex: 1 });
                setTableData([]);
              }}
              value={
                params.SearchCompany
                  ? params.SearchCompany
                  : companyData[0]?.value
              }
            />
          </div>
          {CompanyIDSetRef.current.has(params.SearchCompany) ? (
            <div>
              <Select
                value={params.SearchPhase}
                onValueChange={(value) => {
                  if (value == "-1") {
                    setParams({ ...params, SearchPhase: "", PageIndex: 1 });
                    return;
                  }
                  setParams({ ...params, SearchPhase: value, PageIndex: 1 });
                }}
              >
                <SelectTrigger className="sm:w-[180px] w-full">
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
          ) : (
            <></>
          )}
        </div>
      </div>
      <Card>
        <CardContent className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ảnh minh họa</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Mã sản phẩm</TableHead>
                {params.SearchCompany === "" ||
                CompanyIDSetRef.current.has(params.SearchCompany) ? (
                  <>
                    <TableHead>Giai đoạn</TableHead>
                    <TableHead>Bình thường</TableHead>
                    <TableHead>Lỗi bên mình</TableHead>
                    <TableHead>Lỗi bên hợp tác</TableHead>
                    <TableHead>Hàng hỏng</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>Số lượng đã nhận</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {!tableData && (
                <TableRow>
                  <TableCell
                    colSpan={
                      CompanyIDSetRef.current.has(params.SearchCompany) ? 9 : 4
                    }
                    className="text-center"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
              {tableData?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      CompanyIDSetRef.current.has(params.SearchCompany) ? 9 : 4
                    }
                    className="text-center"
                  >
                    {isLoading ? "Đang tải dữ liệu" : "Không có dữ liệu"}
                  </TableCell>
                </TableRow>
              ) : (
                tableData?.map((item: any, index) => {
                  if (CompanyIDSetRef.current.has(item.companyId)) {
                    return (
                      <ProductPhaseChangeQuantityType
                        index={index}
                        companyId={item.companyId}
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
                    );
                  } else {
                    return (
                      <TableRow key={item.id + item.size}>
                        <TableCell>
                          <div className="size-10 bg-gray-400">
                            <Image
                              className="object-cover size-10"
                              src={item.image}
                              width={100}
                              height={100}
                              alt={"Anh minh hoa"}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>
                          {formatCurrency(item.totalAvailableQuantity)}
                        </TableCell>
                      </TableRow>
                    );
                  }
                })
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
