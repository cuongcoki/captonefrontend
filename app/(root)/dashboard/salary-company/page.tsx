import SalaryCompanyTable from "@/components/shared/dashboard/salary-company/salary-company-table";
import { SearchSalaryCompanyParams } from "@/types/salary-company.type";
import React from "react";

export default function page({
  searchParams,
}: {
  searchParams: SearchSalaryCompanyParams;
}) {
  const dateNow = new Date();
  searchParams.Year = searchParams.Year || dateNow.getFullYear().toString();
  searchParams.Month = searchParams.Month || dateNow.getMonth().toString();
  searchParams.SearchCompany = searchParams.SearchCompany || "";
  searchParams.PageIndex = searchParams.PageIndex || 1;

  return (
    <div className="min-h-[100vh] max-h-max">
      <div className="">
        <SalaryCompanyTable searchParams={searchParams} />
      </div>
    </div>
  );
}
