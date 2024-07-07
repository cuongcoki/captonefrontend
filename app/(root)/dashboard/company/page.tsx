import CompanyTable from "@/components/shared/dashboard/company/company-table";
import { CompanyParams } from "@/types/company.type";
import React from "react";

export default function page({ searchParams }: CompanyParams) {
  console.log("searchParams", searchParams);
  searchParams.name = searchParams.name || "";
  searchParams.companyType = searchParams.companyType || "";
  searchParams.pageIndex = searchParams.pageIndex || 1;
  return (
    <div className="min-h-[100vh] max-h-max">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm ">
        <CompanyTable searchParams={searchParams} />
      </div>
    </div>
  );
}
