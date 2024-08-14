import SalaryDetailEm from "@/components/shared/employee/salary/salary-detail";
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
    : dateNow.getMonth().toString();

  // console.log(params.id)
  return (
    <>
      <SalaryDetailEm id={params.id} SearchParams={searchParams} />
    </>
  );
}
