import { columnsForAttendance } from "@/components/shared/dashboard/attendance/table/colums";
import { DataTableForAttendance } from "@/components/shared/dashboard/attendance/table/data-table";
import { Card } from "@/components/ui/card";

import { AttendanceOverallProps } from "@/types/attendance.type";
import React from "react";

type Props = {
  searchParams: AttendanceOverallProps;
};

export default async function page({ searchParams }: Props) {
  searchParams.StartDate = searchParams.StartDate;
  searchParams.EndDate = searchParams.EndDate;
  searchParams.PageIndex = searchParams.PageIndex || "1";
  searchParams.PageSize = searchParams.PageSize || "10";

  return (
    <>
      <Card className="p-3">
        <DataTableForAttendance
          columns={columnsForAttendance}
          searchParams={searchParams}
        />
      </Card>
    </>
  );
}
