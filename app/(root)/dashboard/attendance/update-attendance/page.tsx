import UpdateAttendance from "@/components/shared/dashboard/attendance/update-attendance/update-attendance";
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
  console.log("searchParams", searchParams);
  searchParams.warehouse =
    searchParams.warehouse || "b6897f71-491b-43d4-9234-36bef2290c2b";
  return (
    <>
      <UpdateAttendance
        dateProp={searchParams.date}
        slotProp={searchParams.slot}
        warehouseProp={searchParams.warehouse}
      />
    </>
  );
}
