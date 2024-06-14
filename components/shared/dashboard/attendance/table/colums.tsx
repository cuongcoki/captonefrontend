"use client";
import { attendanceHomeType } from "@/schema/attendance";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";

export const columnsForAttendance: ColumnDef<attendanceHomeType>[] = [
  {
    id: "date",
    header: "Ngày",
    accessorKey: "date",
  },
  {
    id: "morning",
    header: "Sáng",
    cell: ({ row }) => {
      const data = row.original.slots.find((p) => p.slotID === "1");
      return (
        <RedirectCell
          wareHouseId={row.original.wareHouseId}
          date={row.original.date}
          slotId={data?.slotID}
          data={data}
        />
      );
    },
  },
  {
    id: "afternoon",
    header: "Chiều",
    cell: ({ row }) => {
      const data = row.original.slots.find((p) => p.slotID === "2");
      return (
        <RedirectCell
          wareHouseId={row.original.wareHouseId}
          date={row.original.date}
          slotId={data?.slotID}
          data={data}
        />
      );
    },
  },
  {
    id: "overtime",
    header: "Tối",
    cell: ({ row }) => {
      const data = row.original.slots.find((p) => p.slotID === "3");
      return (
        <RedirectCell
          wareHouseId={row.original.wareHouseId}
          date={row.original.date}
          slotId={data?.slotID}
          data={data}
        />
      );
    },
  },
];

const RedirectCell = ({
  wareHouseId,
  date,
  slotId,
  data,
}: {
  wareHouseId: string;
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
        `/dashboard/attendance/update-attendance/${wareHouseId}/${format(
          new Date(date),
          "dd-MM-yyyy"
        )}/${slotId}`
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
          <div>
            Vắng: {parseInt(data.totalUser, 10) - parseInt(data.present, 10)}
          </div>
          <div>Tổng sản phẩm: {data.totalProduct}</div>
          <div>Tổng thời gian: {data.overTime}</div>
        </div>
      ) : (
        <div>Không có dữ liệu</div>
      )}
    </div>
  );
};
