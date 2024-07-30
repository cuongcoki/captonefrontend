import SalaryCompanyDetail from "@/components/shared/dashboard/salary-company/salary-company-detail";
import { GetSalaryCompanyDetailParams } from "@/types/salary-company.type";
import React from "react";

export default function page({
  searchParams,
}: {
  searchParams: GetSalaryCompanyDetailParams;
}) {
  return (
    <>
      <SalaryCompanyDetail SearchParams={searchParams} />
    </>
  );
}
