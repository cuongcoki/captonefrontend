"use client";
import React, { useEffect } from "react";
import "./report-table.css";
import { Input } from "@/components/ui/input";
import { GetReportsResponse, ReportParams } from "@/types/report.type";
import { reportApi } from "@/apis/report.api";
import { ReportStore } from "@/components/shared/employee/report/report-store";
import { ReportAdd } from "@/components/shared/employee/report/report-add";
import { Button } from "@/components/ui/button";

const ColorOfTypeStatus: { [key: number]: string } = {
  0: "text-gray-500",
  1: "text-green-500",
  2: "text-red-500",
};

export default function ReportTable({ searchParams }: ReportParams) {
  const [params, setParams] = React.useState(searchParams);
  const [totalPage, setTotalPage] = React.useState(0);
  const { force, tableData, setTableData } = ReportStore();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    reportApi
      .getReports({
        UserId: userData?.id || "",
        Status: "",
        CompanyId: userData?.companyId || "",
        Description: "",
        EndDate: "",
        PageIndex: params.PageIndex,
        PageSize: 10,
        ReportType: params.ReportType,
        StartDate: "",
      })
      .then((res) => {
        setTableData(res.data.data.data);
        setTotalPage(res.data.data.totalPages);
        console.log("REPORTS", res.data.data.data);
      })
      .catch((e) => {
        console.log("ERROR IN GET REPORTS", e);
      });
  }, [params, force, setTableData]);
  return (
    <div className="p-2 ">
      <div className="text-3xl text-[#22c55e] w-full text-center font-semibold mt-3 mb-5">
        DANH SÁCH ĐƠN BÁO CÁO
      </div>
      <div className="mb-5 mt-2 grid grid-cols-12 space-y-1 grid-rows-2 xl:space-y-0 xl:grid-rows-1">
        {/* <Input
          className="col-span-11 xl:col-span-6 xl:row-start-1"
          placeholder="Tìm kiếm công ty"
          value={params.name}
          onChange={(event) => {
            setParams((prev) => {
              return {
                ...prev,
                name: event.target.value,
              };
            });
          }}
        /> */}
        {/* <div className="col-span-6 row-start-2 xl:row-start-1 xl:row-span-2 xl:col-start-7 xl:col-span-2 md:ml-2">
          <Select
            value={params.companyType}
            onValueChange={handleChangeCompanyType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại công ty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="hover:bg-gray-100" value="0">
                Nhà xưởng
              </SelectItem>
              <SelectItem className="hover:bg-gray-100" value="1">
                Công ty mua đặt hàng
              </SelectItem>
              <SelectItem className="hover:bg-gray-100" value="2">
                Công ty hợp tác sản xuất
              </SelectItem>
              <SelectItem className="hover:bg-gray-100" value="-1">
                Bỏ chọn
              </SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        <div className="row-start-2 col-start-9 md:col-start-11 xl:row-start-1 xl:col-start-12">
          <ReportAdd />
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
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
                      <tr
                        key={report.id}
                        className="hover:bg-gray-100 dark:hover:bg-[#685d55] hover:cursor-pointer "
                      >
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
              return { ...prev, pageIndex: Number(prev.PageIndex) - 1 };
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
              return { ...prev, pageIndex: Number(prev.PageIndex) + 1 };
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
