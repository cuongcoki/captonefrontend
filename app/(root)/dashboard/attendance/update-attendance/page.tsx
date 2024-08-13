import UpdateAttendance from "@/components/shared/dashboard/attendance/update-attendance/update-attendance";
import { AttendanceDetailProps } from "@/types/attendance.type";
import React from "react";

type Props = {
  searchParams: AttendanceDetailProps;
};

export default async function page({ searchParams }: Props) {
  const options = { timeZone: "Asia/Ho_Chi_Minh", hour12: false };
  const day = new Date();
  const vietnamTime = new Intl.DateTimeFormat("en-US", options).formatToParts(
    day
  );

  const vietnamHours = parseInt(
    vietnamTime.find((part) => part.type === "hour")?.value || "0",
    10
  );
  const vietnamMonth = vietnamTime.find((part) => part.type === "month")?.value;
  const vietnamDate = vietnamTime.find((part) => part.type === "day")?.value;
  const vietnamYear = vietnamTime.find((part) => part.type === "year")?.value;

  const toDay = `${vietnamDate}/${vietnamMonth}/${vietnamYear}`;
  searchParams.date = searchParams.date || toDay;

  const slot = vietnamHours < 12 ? "1" : vietnamHours < 18 ? "2" : "3";
  searchParams.slot = searchParams.slot || slot;
  searchParams.warehouse = searchParams.warehouse || "";

  return (
    <div className="">
      <UpdateAttendance
        dateProp={searchParams.date}
        slotProp={searchParams.slot}
        warehouseProp={searchParams.warehouse}
      />
    </div>
  );
}
