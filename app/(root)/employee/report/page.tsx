import ReportTable from "@/components/shared/employee/report/report-table";
import { Card } from "@/components/ui/card";
import { ReportParams } from "@/types/report.type";
import React from "react";

export default function page({ searchParams }: ReportParams) {
  searchParams.PageIndex = searchParams.PageIndex || 1;
  searchParams.ReportType = searchParams.ReportType || "";
  return (
    <div className="min-h-[100vh] max-h-max">
      <div className="">
        <ReportTable searchParams={searchParams} />
      </div>
    </div>
  );
}
