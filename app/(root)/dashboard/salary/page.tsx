import SalaryTable from "@/components/shared/dashboard/salary/salary-table";
import { SearchSalaryParams } from "@/types/salary.type";
import React from "react";

export default function page({ searchParams }: SearchSalaryParams) {
  const dateNow = new Date();
  searchParams.year = searchParams.year || dateNow.getFullYear().toString();
  searchParams.month =
    searchParams.month || (dateNow.getMonth() + 1).toString();
  searchParams.companyId = searchParams.companyId || "";
  searchParams.name = searchParams.name || "";

  return (
    <div className="min-h-[100vh] max-h-max">
      <div className="">
        <SalaryTable searchParams={searchParams} />
      </div>
    </div>
  );
}
