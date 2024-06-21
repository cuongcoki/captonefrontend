"use client";
import DayOfCalender from "@/components/shared/employee/view-attendance/day-of-calender";
import DotStatus from "@/components/shared/employee/view-attendance/dot-status";
import { Card } from "@/components/ui/card";
import { AttendanceDateData } from "@/types/attendance.type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const attendanceData: AttendanceDateData[] = [
  {
    date: "2024-06-02",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: false,
  },
  {
    date: "2024-06-04",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: true,
  },
  {
    date: "2024-06-05",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: true,
  },
  {
    date: "2024-06-06",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: true,
  },
  {
    date: "2024-06-07",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: false,
  },
  {
    date: "2024-06-08",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: true,
  },
  {
    date: "2024-06-09",
    isAttendanceSlot1: false,
    isAttendanceSlot2: false,
    isAttendanceSlot3: false,
    isMakeProduct: false,
  },
  {
    date: "2024-06-10",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: true,
  },
  {
    date: "2024-06-12",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: true,
  },
  {
    date: "2024-06-14",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: false,
  },
  {
    date: "2024-06-16",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: true,
    isMakeProduct: true,
  },
  {
    date: "2024-06-17",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: true,
    isMakeProduct: false,
  },
  {
    date: "2024-06-18",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: true,
    isMakeProduct: true,
  },
  {
    date: "2024-06-19",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: true,
  },
  {
    date: "2024-06-21",
    isAttendanceSlot1: false,
    isAttendanceSlot2: false,
    isAttendanceSlot3: false,
    isMakeProduct: false,
  },
  {
    date: "2024-06-22",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: false,
  },
  {
    date: "2024-06-25",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: false,
  },
  {
    date: "2024-06-26",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: true,
  },
  {
    date: "2024-06-29",
    isAttendanceSlot1: true,
    isAttendanceSlot2: true,
    isAttendanceSlot3: false,
    isMakeProduct: false,
  },
  {
    date: "2024-06-30",
    isAttendanceSlot1: false,
    isAttendanceSlot2: false,
    isAttendanceSlot3: false,
    isMakeProduct: false,
  },
];

type Props = {
  searchParams: {
    year: number;
    month: number;
  };
};
export default function page({ searchParams }: Props) {
  console.log("searchParams", searchParams);
  // Convert attendance data to a dictionary for easy lookup
  const attendanceDict: { [key: string]: AttendanceDateData } =
    attendanceData.reduce((acc: any, entry: any) => {
      acc[entry.date] = entry;
      return acc;
    }, {});

  function generateAttendanceGrid(
    year: number,
    month: number
  ): AttendanceDateData[] {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const endDayOfWeek = lastDayOfMonth.getDay();

    const daysInPreviousMonth = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // adjust to start week on Monday
    let daysInNextMonth = endDayOfWeek === 6 ? 0 : 7 - endDayOfWeek - 1;

    const calendarGrid: AttendanceDateData[] = [];

    // Add days from the previous month
    for (let i = 0; i < daysInPreviousMonth; i++) {
      const prevDate = new Date(year, month - 1, -i);
      calendarGrid.unshift({
        date: prevDate.toISOString().split("T")[0],
        isAttendanceSlot1: false,
        isAttendanceSlot2: false,
        isAttendanceSlot3: false,
        isMakeProduct: false,
      });
    }

    // Add days from the current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const currentDate = new Date(year, month - 1, day);
      const dateString = currentDate.toISOString().split("T")[0];
      if (attendanceDict[dateString]) {
        calendarGrid.push(attendanceDict[dateString]);
      } else {
        calendarGrid.push({
          date: dateString,
          isAttendanceSlot1: false,
          isAttendanceSlot2: false,
          isAttendanceSlot3: false,
          isMakeProduct: false,
        });
      }
    }

    // Add days from the next month
    for (let i = 1; i <= daysInNextMonth; i++) {
      const nextDate = new Date(year, month, i);
      calendarGrid.push({
        date: nextDate.toISOString().split("T")[0],
        isAttendanceSlot1: false,
        isAttendanceSlot2: false,
        isAttendanceSlot3: false,
        isMakeProduct: false,
      });
    }

    // Ensure the grid has exactly 42 entries
    while (calendarGrid.length < 42) {
      const nextDate = new Date(year, month, daysInNextMonth + 1);
      calendarGrid.push({
        date: nextDate.toISOString().split("T")[0],
        isAttendanceSlot1: false,
        isAttendanceSlot2: false,
        isAttendanceSlot3: false,
        isMakeProduct: false,
      });
      daysInNextMonth += 1;
    }

    return calendarGrid;
  }

  const calenderData = generateAttendanceGrid(2024, 6);
  console.log("calenderData", calenderData);
  return (
    <Card className="p-5">
      <div className="bg-[#62d46d] h-10 text-center grid grid-cols-3 rounded-ss-md rounded-se-md p-2">
        <div className="mb-auto">
          <ChevronLeft />
        </div>
        <div className="my-auto mx-auto flex">
          <div className="hidden sm:block">Tháng&nbsp;</div>
          <div>6</div>
          <div>&nbsp;-&nbsp;</div>
          <div className="hidden sm:block">Năm&nbsp;</div>
          <div>2024</div>
        </div>
        <div className="ml-auto mb-auto">
          <ChevronRight />
        </div>
      </div>
      <div className="grid grid-cols-7 border border-[#eeeeee]">
        <div className="flex items-center justify-center mb-3">Th2</div>
        <div className="flex items-center justify-center mb-3">Th3</div>
        <div className="flex items-center justify-center mb-3">Th4</div>
        <div className="flex items-center justify-center mb-3">Th5</div>
        <div className="flex items-center justify-center mb-3">Th6</div>
        <div className="flex items-center justify-center mb-3">Th7</div>
        <div className="flex items-center justify-center mb-3">CN</div>
      </div>
      <div className="calender grid grid-rows-6 grid-cols-7">
        {calenderData.map((dayData) => {
          return (
            <DayOfCalender
              key={dayData.date}
              dayData={dayData}
              month={Number(searchParams.month)}
              year={Number(searchParams.year)}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-auto">
          <DotStatus className="my-auto" variant="yellow" />
          &nbsp;: 0.5 công
        </div>
        <div className="flex flex-auto">
          <DotStatus className="my-auto" variant="green" />
          &nbsp;: 1 công
        </div>
        <div className="flex flex-auto">
          <DotStatus className="my-auto" variant="blue" />
          &nbsp;: làm sp
        </div>
        <div className="flex flex-auto">
          <DotStatus className="my-auto" variant="orange" />
          &nbsp;: tăng ca
        </div>
        <div className="flex flex-auto">
          <DotStatus className="my-auto" variant="gray" />
          &nbsp;: không làm
        </div>
      </div>
    </Card>
  );
}
