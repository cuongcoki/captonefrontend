"use client";
import React, { useCallback, useEffect, useState } from "react";
import "./report-manager-table.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReportManagerParams } from "@/types/report.type";
import { reportApi } from "@/apis/report.api";
import { Button } from "@/components/ui/button";
import { ReportManagerStore } from "@/components/shared/dashboard/report-manager/report-manager-store";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companyApi } from "@/apis/company.api";
import { set } from "date-fns";
import { ReportManagerUpdate } from "@/components/shared/dashboard/report-manager/report-manager-update";
import HeaderComponent from "@/components/shared/common/header";
import { Card } from "@/components/ui/card";

const ColorOfTypeStatus: { [key: number]: string } = {
  0: "text-gray-500",
  1: "text-green-500",
  2: "text-red-500",
};

const StatusDescription: { [key: number]: string } = {
  0: "Đang chờ xử lý",
  1: "Đã xử lý",
  2: "Đã từ chối",
};

export default function ReportManagerTable({
  searchParams,
}: ReportManagerParams) {
  const [params, setParams] = React.useState(searchParams);
  const [totalPage, setTotalPage] = React.useState(0);
  const { force, tableData, setTableData, companyData, setCompanyData } =
    ReportManagerStore();
  const router = useRouter();
  const pathName = usePathname();
  const [user, setUserData] = useState<any>();
  const buildUrlParams = useCallback(
    (pathName: string, params: any): string => {
      let url = pathName + "?";
      for (const key in params) {
        if (params[key] !== "") {
          url += `${key}=${params[key]}&`;
        }
      }
      if (url.endsWith("&")) {
        url = url.slice(0, -1);
      }
      return url;
    },
    []
  );
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    setUserData(userData);

    let companyId =
      userData?.roleId == "2" ? userData?.companyId : params.CompanyId;

    const fetchGetCompanies = async () => {
      try {
        const res = await companyApi.getCompanyByType(0);
        setCompanyData(res.data.data);
        if (companyId == "") {
          companyId = res.data.data[0].id;
          setParams((prev) => {
            return { ...prev, CompanyId: companyId };
          });
        }
        console.log("COMPANIES", res.data.data);
      } catch (e) {
        console.log("ERROR IN GET COMPANIES", e);
      }
    };

    const fetchGetReports = async () => {
      try {
        const res = await reportApi.getReports({
          UserId: params.UserId,
          Status: params.Status,
          CompanyId: companyId,
          Description: "",
          StartDate: params.StartDate,
          EndDate: params.EndDate,
          PageIndex: params.PageIndex,
          PageSize: 5,
          ReportType: params.ReportType,
        });

        setTableData(res.data.data.data);
        setTotalPage(res.data.data.totalPages);
        console.log("REPORTS", res.data.data.data);
        router.push(buildUrlParams(pathName, params));
      } catch (e) {
        console.log("ERROR IN GET REPORTS", e);
      }
    };

    const LoadTableData = async () => {
      try {
        if (userData.roleId == "1") {
          await fetchGetCompanies();
          await fetchGetReports();
        } else {
          await fetchGetReports();
        }
      } catch (error) {
        console.log("ERROR IN LOAD TABLE DATA", error);
      }
    };
    LoadTableData();
  }, [
    params,
    force,
    setTableData,
    router,
    pathName,
    setCompanyData,
    buildUrlParams,
  ]);
  const formatDate = (date: string) => {
    const data = date.split("-");
    return `${data[2]}/${data[1]}/${data[0]}`;
  };
  return (
    <div className="">
      <HeaderComponent
        title="Danh sách đơn khiếu nại"
        description="Danh sách đơn khiếu nại từ nhân viên công ty."
      />
      <div className="my-5 grid gap-2 xl:grid-cols-6">
        {user && user.roleDescription === "MAIN_ADMIN" && (
          <div className="col-span-2 xl:col-span-1 xl:row-start-1">
            <Select
              value={params.CompanyId}
              onValueChange={(value) => {
                setParams((prev) => ({
                  ...prev,
                  CompanyId: value,
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn cơ sở" />
              </SelectTrigger>
              <SelectContent>
                {companyData.map((company) => (
                  <SelectItem
                    key={company.id}
                    className="hover:bg-gray-100"
                    value={company.id}
                  >
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="row-start-2 xl:row-start-1">
          <Select
            value={params.ReportType}
            onValueChange={(value) => {
              setParams((prev) => ({
                ...prev,
                ReportType: value === "-1" ? "" : value,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại đơn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="hover:bg-gray-100" value="0">
                Báo cáo về điểm danh
              </SelectItem>
              <SelectItem className="hover:bg-gray-100" value="1">
                Báo cáo về chấm công
              </SelectItem>
              <SelectItem className="hover:bg-gray-100" value="2">
                Báo cáo về lương
              </SelectItem>
              <SelectItem className="hover:bg-gray-100" value="3">
                Các loại đơn khác
              </SelectItem>
              {params.ReportType !== "" && (
                <SelectItem className="hover:bg-gray-100" value="-1">
                  Bỏ chọn
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="row-start-2 xl:row-start-1">
          <Select
            value={params.Status}
            onValueChange={(value) => {
              setParams((prev) => ({
                ...prev,
                Status: value === "-1" ? "" : value,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="hover:bg-gray-100" value="0">
                Đang chờ xử lý
              </SelectItem>
              <SelectItem className="hover:bg-gray-100" value="1">
                Đã xử lý
              </SelectItem>
              <SelectItem className="hover:bg-gray-100" value="2">
                Đã từ chối
              </SelectItem>

              {params.Status !== "" && (
                <SelectItem className="hover:bg-gray-100" value="-1">
                  Bỏ chọn
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Ảnh Đại Diện</TableHead>
              <TableHead className="text-center">Nhân viên</TableHead>
              <TableHead className="text-center">Loại Đơn</TableHead>
              <TableHead className="text-center">Nội dung</TableHead>
              <TableHead className="text-center">Ngày Tạo</TableHead>
              <TableHead className="text-center">Phản Hồi</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((report, index) => (
                <ReportManagerUpdate index={index} key={report.id}>
                  <TableRow className="hover:cursor-pointer">
                    <TableCell className="flex justify-center">
                      <div className="w-32 h-44 bg-gray-300">
                        <Image
                          src={report.avatar}
                          alt="avatar"
                          width={320}
                          height={440}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">{report.fullName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        {report.reportTypeDescription}
                      </div>
                    </TableCell>
                    <TableCell className="px-0">
                      <div className="whitespace-normal break-words w-64 mx-auto text-center">
                        {report.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        {formatDate(report.createdDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="whitespace-normal break-words w-64 mx-auto text-center">
                        {report.replyMessage}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`text-center ${ColorOfTypeStatus[report.status]
                          }`}
                      >
                        {StatusDescription[report.status]}
                      </div>
                    </TableCell>
                  </TableRow>
                </ReportManagerUpdate>
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
