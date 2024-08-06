"use client";
import React, { useEffect } from "react";
import "./report-table.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetReportsResponse, ReportParams } from "@/types/report.type";
import { reportApi } from "@/apis/report.api";
import { ReportStore } from "@/components/shared/employee/report/report-store";
import { ReportAdd } from "@/components/shared/employee/report/report-add";
import { Button } from "@/components/ui/button";
import HeaderComponent from "@/components/shared/common/header";
import { Card } from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";

const ColorOfTypeStatus: { [key: number]: string } = {
  0: "text-gray-500",
  1: "text-green-500",
  2: "text-red-500",
};

export default function ReportTable({ searchParams }: ReportParams) {
  const [params, setParams] = React.useState(searchParams);
  const [totalPage, setTotalPage] = React.useState(0);
  const { force, tableData, setTableData } = ReportStore();
  const router = useRouter();
  const pathName = usePathname();

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
      })
      .finally(() => {
        console.log("FINALLY");
        router.push(`${pathName}?PageIndex=${params.PageIndex}`);
      });
  }, [params, force, setTableData, router, pathName]);

  const formatDate = (date: string) => {
    const data = date.split("-");
    return `${data[2]}/${data[1]}/${data[0]}`;
  };
  return (
    <div className="">
      <HeaderComponent
        title="Đơn khiếu nại"
        description="Thông tin trạng thái xử lý đơn khiếu nại."
      />
      <div className="mb-5 mt-2 grid grid-cols-12 space-y-1 grid-rows-2 xl:space-y-0 xl:grid-rows-1">
        <div className="row-start-2 col-start-9 md:col-start-11 xl:row-start-1 xl:col-start-12">
          <ReportAdd />
        </div>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Loại đơn</TableHead>
              <TableHead className="text-center">Nội dung</TableHead>
              <TableHead className="text-center">Ngày tạo</TableHead>
              <TableHead className="text-center">Phản hồi</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((report, index) => (
                <TableRow
                  key={report.id}
                  className="hover:bg-gray-100 dark:hover:bg-[#685d55] hover:cursor-pointer"
                >
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                    <div className="mx-auto text-center">
                      {report.reportTypeDescription}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                    <div className="mx-auto whitespace-normal break-words w-72 text-center">
                      {report.description}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                    <div className="mx-auto text-center">
                      {formatDate(report.createdDate)}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                    <div className="mx-auto whitespace-normal break-words w-72 text-center">
                      {report.replyMessage}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                    <div
                      className={`mx-auto text-center ${ColorOfTypeStatus[report.status]
                        }`}
                    >
                      {report.statusDesscription}
                    </div>
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
              return { ...prev, PageIndex: Number(prev.PageIndex) - 1 };
            });
          }}
          disabled={Number(searchParams.PageIndex) == 1}
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
