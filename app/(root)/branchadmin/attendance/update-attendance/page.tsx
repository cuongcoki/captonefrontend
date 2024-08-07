import UpdateAttendanceBrandAdmin from "@/components/shared/brand-admin/attendance/update-attendance/update-attendance";
import { AttendanceDetailProps } from "@/types/attendance.type";
import React from "react";

type Props = {
  searchParams: AttendanceDetailProps;
};

export default async function page({ searchParams }: Props) {
  const day = new Date();
  const month =
    day.getMonth() + 1 < 10 ? "0" + (day.getMonth() + 1) : day.getMonth() + 1;
  const toDay = day.getDate() + "/" + month + "/" + day.getFullYear();
  searchParams.date = searchParams.date || toDay;
  const slot = day.getHours() < 12 ? "1" : day.getHours() < 18 ? "2" : "3";
  searchParams.slot = searchParams.slot || slot;
  searchParams.warehouse = searchParams.warehouse || "";
  // console.log("searchParams", searchParams);

  return (
    <div className="">
      <UpdateAttendanceBrandAdmin
        dateProp={searchParams.date}
        slotProp={searchParams.slot}
        warehouseProp={searchParams.warehouse}
      />
    </div>
  );
}
