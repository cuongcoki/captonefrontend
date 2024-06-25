import DotStatus from "@/components/shared/employee/view-attendance/dot-status";
import { AttendanceDateData } from "@/types/attendance.type";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmployeeAttendanceDetail from "@/components/shared/employee/view-attendance/employee-attendance-detail";

type Props = {
  dayData: AttendanceDateData;
  month: number;
  year: number;
};

export default function DayOfCalender({ dayData, month, year }: Props) {
  const day = new Date(dayData.date);
  const isDayOfMonth = day.getMonth() + 1 === month;

  const oneEffort =
    dayData.attedanceDateReport.isPresentSlot1 &&
    dayData.attedanceDateReport.isPresentSlot2;
  const halfEffort =
    !oneEffort &&
    (dayData.attedanceDateReport.isPresentSlot1 ||
      dayData.attedanceDateReport.isPresentSlot2);
  const noEffort =
    !oneEffort && !halfEffort && !dayData.attedanceDateReport.isPresentSlot3;
  return (
    <>
      {isDayOfMonth ? (
        <Dialog>
          <DialogTrigger asChild>
            <div
              className={`border border-[#eeeeee] hover:bg-gray-300 h-[65px] xl:h-[80px]`}
            >
              <div className="ml-1">{day.getDate()}</div>
              <div className="w-full ">
                <div className="grid grid-rows-1 gap-1 ">
                  {noEffort && (
                    <DotStatus variant="gray" className="ml-auto mr-1" />
                  )}
                  {oneEffort && (
                    <DotStatus variant="green" className="ml-auto mr-1" />
                  )}
                  {halfEffort && (
                    <DotStatus variant="yellow" className="ml-auto mr-1" />
                  )}
                  {dayData.attedanceDateReport.isSalaryByProduct &&
                    !noEffort && (
                      <DotStatus variant="blue" className="ml-auto mr-1" />
                    )}
                  {dayData.attedanceDateReport.isPresentSlot3 && (
                    <DotStatus variant="orange" className="ml-auto mr-1" />
                  )}
                </div>
              </div>
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
            <DialogHeader>
              <DialogTitle className="mb-5">Chi tiết điểm danh</DialogTitle>
            </DialogHeader>
            <EmployeeAttendanceDetail
              Date={`${day.getDate()}/${
                month < 10 ? "0" + month : month
              }/${year}`}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <div
          className={`border border-[#eeeeee] hover:bg-gray-300 h-[65px] xl:h-[80px] relative bg-[#fafafa] text-[#c8c8c8]`}
        >
          <div className="ml-1">{day.getDate()}</div>
        </div>
      )}
    </>
  );
}
