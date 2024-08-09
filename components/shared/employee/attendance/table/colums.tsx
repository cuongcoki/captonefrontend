"use client";
import { AttendanceOverall } from "@/types/attendance.type";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, {  useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AddEmployeeToAttendance } from "@/components/shared/dashboard/attendance/add-employee-to-attendance/add-employee-to-attendance";
import { columnsForAttendanceForm } from "@/components/shared/dashboard/attendance/add-new-slot/table/colums";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    if (slotId && !isDialogOpen) {
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
        <>
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="">
                <div>
                  Sĩ số: {data.present}/{data.totalUser}
                </div>
                <div className="hidden md:block">
                  Vắng:{" "}
                  {parseInt(data.totalUser, 10) - parseInt(data.present, 10)}
                </div>
                <div className="hidden xl:block">
                  Làm sản phẩm: {data.totalProduct}
                </div>
                <div className="hidden sm:block">Tăng ca: {data.overTime}h</div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent onClick={(e) => e.stopPropagation()}>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="hover:bg-slate-100 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    Thêm nhân viên
                  </div>
                </DialogTrigger>
                <DialogContent
                  className=" max-w-[80vw] max-h-[80vh]  overflow-y-auto"
                  style={{
                    msOverflowStyle: "none" /* IE, Edge */,
                    scrollbarWidth: "none" /* Firefox */,
                  }}
                >
                  <style jsx>{`
                    .dialog-content::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <AddEmployeeToAttendance
                    date={format(date, "dd/MM/yyyy")}
                    slot={String(slotId)}
                    columns={columnsForAttendanceForm}
                  />
                </DialogContent>
              </Dialog>
            </ContextMenuContent>
          </ContextMenu>
        </>
      ) : (
        <div>Không có dữ liệu</div>
      )}
    </div>
  );
};

const NoCell = () => {
  return <div>Không có dữ liệu</div>;
};
