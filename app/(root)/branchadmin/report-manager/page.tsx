import ReportManagerTable from "@/components/shared/dashboard/report-manager/report-manager-table";
import { ReportManagerParams } from "@/types/report.type";
import React from "react";

export default async function page({ searchParams }: ReportManagerParams) {
  searchParams.PageIndex = searchParams.PageIndex || 1;
  searchParams.ReportType = searchParams.ReportType || "";
  searchParams.StartDate = searchParams.StartDate || "";
  searchParams.EndDate = searchParams.EndDate || "";
  searchParams.Status = searchParams.Status || "";
  searchParams.UserId = searchParams.UserId || "";
  searchParams.CompanyId = searchParams.CompanyId || "";

  return (
    <div className="min-h-[100vh] max-h-max">
      <div className="">
        <ReportManagerTable searchParams={searchParams} />
      </div>
    </div>
  );
}
