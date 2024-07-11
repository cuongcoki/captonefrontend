import SalaryDetail from "@/components/shared/dashboard/salary/salary-detail";
import React from "react";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <SalaryDetail id={params.id} />
    </>
  );
}
