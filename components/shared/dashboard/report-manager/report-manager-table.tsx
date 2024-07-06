"use client";
import React, { useCallback, useEffect } from "react";
import "./report-manager-table.css";
import { Input } from "@/components/ui/input";
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

const ColorOfTypeStatus: { [key: number]: string } = {
  0: "text-gray-500",
  1: "text-green-500",
  2: "text-red-500",
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
  return (
    <div className="p-2 ">
      <div className="text-3xl text-[#22c55e] w-full text-center font-semibold mt-3 mb-5">
        DANH SÁCH ĐƠN BÁO CÁO
      </div>
      <div className="my-5 grid grid-cols-10 space-x-5">
        <div className="col-span-2">
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
        <div className="col-span-2">
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
        <div className="col-span-2">
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
        {/* <div className="row-start-2 col-start-9 md:col-start-11 xl:row-start-1 xl:col-start-12">
          <ReportManagerAdd />
        </div> */}
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className=" min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Nhân viên
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Loại Đơn
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-white "
                      >
                        Nội dung
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Ngày Tạo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Phản Hồi
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 ">
                    {tableData.map((report, index) => (
                      <ReportManagerUpdate key={report.id} index={index}>
                        <tr className="hover:bg-gray-100 dark:hover:bg-[#685d55] hover:cursor-pointer ">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                            <div className="mx-auto text-center">
                              {report.fullName}
                            </div>
                            <div className="w-32 h-44 bg-gray-300">
                              {/* <Image
                              src={}
                              alt="avatar"
                              width={100}
                              height={100}
                            /> */}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                            <div className="mx-auto text-center">
                              {report.reportTypeDescription}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white ">
                            <div className="mx-auto whitespace-normal break-words w-72 ">
                              {report.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                            <div className="mx-auto text-center">
                              {report.createdDate}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                            <div className="mx-auto whitespace-normal break-words w-72">
                              {report.replyMessage}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                            <div
                              className={`mx-auto text-center ${
                                ColorOfTypeStatus[report.status]
                              }`}
                            >
                              {report.statusDesscription}
                            </div>
                          </td>
                        </tr>
                      </ReportManagerUpdate>
                    ))}
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
          Previous
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
          Next
        </Button>
      </div>
    </div>
  );
}
