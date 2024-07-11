import SalaryTable from "@/components/shared/dashboard/salary/salary-table";
import { SearchSalaryParams } from "@/types/salary.tpe";
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
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm ">
        <SalaryTable searchParams={searchParams} />
      </div>
    </div>
  );
}
