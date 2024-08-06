import SalaryTable from "@/components/shared/dashboard/salary/salary-table";
import { SearchSalaryParams } from "@/types/salary.type";
import React from "react";

export default function page({ searchParams }: SearchSalaryParams) {
  const dateNow = new Date();
  searchParams.year = searchParams.year || dateNow.getFullYear().toString();
  searchParams.month = searchParams.month || dateNow.getMonth().toString();
  searchParams.companyId = searchParams.companyId || "";
  searchParams.searchUser = searchParams.searchUser || "";
  searchParams.pageIndex = searchParams.pageIndex || 1;

  return (
    <div className="min-h-[100vh] max-h-max">
      <div className="">
        <SalaryTable searchParams={searchParams} />
      </div>
    </div>
  );
}
