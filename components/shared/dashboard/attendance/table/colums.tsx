"use client";
import { attendanceHomeType } from "@/schema/attendance";
import { AttendanceOverall } from "@/types/attendance.type";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";

export const columnsForAttendance: ColumnDef<AttendanceOverall>[] = [
  {
    id: "date",
    header: "Ngày",
    accessorKey: "date",
  },
  {
    id: "morning",
    header: "Sáng",
    cell: ({ row }) => {
      const data = row.original.attendanceStatisticResponses.find(
        (p) => p.slotId == "1"
      );
      return data ? (
        <RedirectCell
          // wareHouseId={row.original.wareHouseId}
          date={row.original.date}
          slotId={data?.slotId}
          data={{
            present: data?.numberOfPresent as string,
            overTime: data?.totalHourOverTime as string,
            totalProduct: data?.totalSalaryByProduct as string,
            totalUser: data?.totalAttendance as string,
          }}
        />
      ) : (
        <NoCell />
      );
    },
  },
  {
    id: "afternoon",
    header: "Chiều",
    cell: ({ row }) => {
      const data = row.original.attendanceStatisticResponses.find(
        (p) => p.slotId == "2"
      );
      return data ? (
        <RedirectCell
          // wareHouseId={row.original.wareHouseId}
          date={row.original.date}
          slotId={data?.slotId}
          data={{
            present: data?.numberOfPresent as string,
            overTime: data?.totalHourOverTime as string,
            totalProduct: data?.totalSalaryByProduct as string,
            totalUser: data?.totalAttendance as string,
          }}
        />
      ) : (
        <NoCell />
      );
    },
  },
  {
    id: "night",
    header: "Tối",
    cell: ({ row }) => {
      const data = row.original.attendanceStatisticResponses.find(
        (p) => p.slotId == "3"
      );
      return data ? (
        <RedirectCell
          // wareHouseId={row.original.wareHouseId}
          date={row.original.date}
          slotId={data?.slotId}
          data={{
            present: data?.numberOfPresent as string,
            overTime: data?.totalHourOverTime as string,
            totalProduct: data?.totalSalaryByProduct as string,
            totalUser: data?.totalAttendance as string,
          }}
        />
      ) : (
        <NoCell />
      );
    },
  },
];

const RedirectCell = ({
  // wareHouseId,
  date,
  slotId,
  data,
}: {
  // wareHouseId: string;
  date: string;
  slotId?: string;
  data?: {
    present: string;
    totalUser: string;
    totalProduct: string;
    overTime: string;
  };
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (slotId) {
      router.push(
        `/dashboard/attendance/update-attendance?date=${format(
          date,
          "dd/MM/yyyy"
        )}&slot=${slotId}`
      );
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {data ? (
        <div>
          <div>
            Sĩ số: {data.present}/{data.totalUser}
          </div>
          <div className="">
            Vắng: {parseInt(data.totalUser, 10) - parseInt(data.present, 10)}
          </div>
          <div className="">Làm sản phẩm: {data.totalProduct}</div>
          <div className="">Tăng ca: {data.overTime}h</div>
        </div>
      ) : (
        <div>Không có dữ liệu</div>
      )}
    </div>
  );
};

const NoCell = () => {
  return <div>Không có dữ liệu</div>;
};
