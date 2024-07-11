import SalaryTable from "@/components/shared/dashboard/salary/salary-table";
import React from "react";

export default function page() {
  return (
    <div className="min-h-[100vh] max-h-max">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm ">
        <SalaryTable />
      </div>
    </div>
  );
}
