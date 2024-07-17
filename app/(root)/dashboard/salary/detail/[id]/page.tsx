import SalaryDetail from "@/components/shared/dashboard/salary/salary-detail";
import { SalaryDetailParams } from "@/types/salary.type";
import React from "react";

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: SalaryDetailParams;
}) {
  const dateNow = new Date();
  searchParams.year = searchParams.year
    ? searchParams.year
    : dateNow.getFullYear().toString();
  searchParams.month = searchParams.month
    ? searchParams.month
    : (dateNow.getMonth() + 1).toString();
  return (
    <>
      <SalaryDetail id={params.id} SearchParams={searchParams} />
    </>
  );
}
