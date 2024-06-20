import UpdateAttendance from "@/components/shared/dashboard/attendance/update-attendance/update-attendance";
import { AttendanceDetailProps } from "@/types/attendance.type";
import React from "react";

type Props = {
  searchParams: AttendanceDetailProps;
};

export default async function page({ searchParams }: Props) {
  console.log("searchParams", searchParams);
  return (
    <>
      <UpdateAttendance date={searchParams.date} slot={searchParams.slot} />
    </>
  );
}
