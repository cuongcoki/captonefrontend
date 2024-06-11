"use client";
import { attendanceHomeType } from "@/schema/attendance";
import { ColumnDef } from "@tanstack/react-table";
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
        <div>
          {data ? (
            <div>
              <div>
                Sĩ số: {data.present}/{data.totalUser}
              </div>
              <div>
                Vắng:{" "}
                {parseInt(data.totalUser, 10) - parseInt(data.present, 10)}
              </div>
              <div>Tổng sản phẩm: {data.totalProduct}</div>
            </div>
          ) : (
            <div>Không có dữ liệu</div>
          )}
        </div>
      );
    },
  },
  {
    id: "afternoon",
    header: "Chiều",
    cell: ({ row }) => {
      const data = row.original.slots.find((p) => p.slotID === "2");
      return (
        <div>
          {data ? (
            <div>
              <div>
                Sĩ số: {data.present}/{data.totalUser}
              </div>
              <div>
                Vắng:{" "}
                {parseInt(data.totalUser, 10) - parseInt(data.present, 10)}
              </div>
              <div>Tổng sản phẩm: {data.totalProduct}</div>
            </div>
          ) : (
            <div>Không có dữ liệu</div>
          )}
        </div>
      );
    },
  },
  {
    id: "overtime",
    header: "Tăng ca",
    cell: ({ row }) => {
      const data = row.original.slots.find((p) => p.slotID === "3");
      return (
        <div>
          {data ? (
            <div>
              <div>Số người : {data.present}</div>
              <div>Tổng thời gian: {data.overTime}</div>
              <div>Tổng sản phẩm: {data.totalProduct}</div>
            </div>
          ) : (
            <div>Không có dữ liệu</div>
          )}
        </div>
      );
    },
  },
];
