"use client";
import { attendanceApi } from "@/apis/attendance.api";
import DayOfCalender from "@/components/shared/employee/view-attendance/day-of-calender";
import DotStatus from "@/components/shared/employee/view-attendance/dot-status";
import { Card } from "@/components/ui/card";
import { AttendanceDateData } from "@/types/attendance.type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  searchParams: {
    year: number;
    month: number;
  };
};
export default function Page({ searchParams }: Props) {
  const [attendanceData, setAttendanceData] = useState<AttendanceDateData[]>(
    []
  );
  const [calenderData, setCalenderData] = useState<AttendanceDateData[]>([]);
  const [month, setMonth] = useState(
    Number(searchParams.month) || new Date().getMonth() + 1
  );
  const [year, setYear] = useState(
    Number(searchParams.year) || new Date().getFullYear()
  );
  const router = useRouter();
  const pathName = usePathname();
  function convertDateToISO(dateString: string) {
    // Tách chuỗi ngày được truyền vào thành các phần
    let parts = dateString.split("/");

    // Kiểm tra định dạng ngày nhập vào
    if (parts.length !== 3) {
      return null; // hoặc có thể throw new Error("Định dạng ngày không hợp lệ");
    }

    // Tái cấu trúc theo định dạng yyyy-MM-dd
    let convertedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    return convertedDate;
  }

  useEffect(() => {
    attendanceApi
      .getEmployeeAttendance({
        Year: year,
        Month: month,
      })
      .then(({ data }) => {
        // console.log("Attendance Data", data.data);
        setAttendanceData(
          data.data.attendances.map((item) => {
            return {
              date: convertDateToISO(item.date) || "",
              attedanceDateReport: {
                isHalfWork: item.attedanceDateReport.isHalfWork,
                isOneWork: item.attedanceDateReport.isOneWork,
                isSalaryByProduct: item.attedanceDateReport.isSalaryByProduct,
                isOverTime: item.attedanceDateReport.isOverTime,
              },
            };
          })
        );
      })
      .catch((error) => {
        // console.log("Error", error);
      });
  }, [year, month]);
  useEffect(() => {
    // console.log("Attendance Data", attendanceData);
    const attendanceDict: { [key: string]: AttendanceDateData } =
      attendanceData?.reduce((acc: any, entry: any) => {
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

      // Calculate the number of days from the previous month to display
      let daysInPreviousMonth = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // adjust to start week on Monday

      // Get the actual last day of the previous month
      const lastDayOfPreviousMonth = new Date(year, month - 1, 0).getDate();

      const calendarGrid: AttendanceDateData[] = [];

      // Add days from the previous month
      for (let i = daysInPreviousMonth; i > 0; i--) {
        const prevDate = new Date(
          year,
          month - 2,
          lastDayOfPreviousMonth - i + 1
        );
        calendarGrid.push({
          date: prevDate.toISOString().split("T")[0],
          attedanceDateReport: {
            isHalfWork: false,
            isOneWork: false,
            isSalaryByProduct: false,
            isOverTime: false,
          },
        });
      }

      // Add days from the current month
      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const currentDate = new Date(year, month - 1, day);
        const dateString = currentDate.toISOString().split("T")[0];
        if (attendanceDict && attendanceDict[dateString]) {
          calendarGrid.push(attendanceDict[dateString]);
        } else {
          calendarGrid.push({
            date: dateString,
            attedanceDateReport: {
              isHalfWork: false,
              isOneWork: false,
              isSalaryByProduct: false,
              isOverTime: false,
            },
          });
        }
      }

      // Add days from the next month to complete the grid (if needed)
      let nextMonthDay = 1;
      while (calendarGrid.length % 7 !== 0) {
        const nextDate = new Date(year, month, nextMonthDay++);
        calendarGrid.push({
          date: nextDate.toISOString().split("T")[0],
          attedanceDateReport: {
            isHalfWork: false,
            isOneWork: false,
            isSalaryByProduct: false,
            isOverTime: false,
          },
        });
      }

      // Ensure the grid has exactly 42 entries
      while (calendarGrid.length < 42) {
        const nextDate = new Date(year, month, nextMonthDay++);
        calendarGrid.push({
          date: nextDate.toISOString().split("T")[0],
          attedanceDateReport: {
            isHalfWork: false,
            isOneWork: false,
            isSalaryByProduct: false,
            isOverTime: false,
          },
        });
      }

      return calendarGrid;
    }
    setCalenderData(generateAttendanceGrid(year, month));
  }, [attendanceData, year, month]);

  useEffect(() => {
    router.push(`${pathName}?year=${year}&month=${month}`);
  }, [router, pathName, year, month]);

  useEffect(() => {
    // console.log("Calender Data", calenderData);
  }, [calenderData]);
  const handleIncreaseMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };
  const handleDecreaseMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  return (
    <div className="h-[94.8vh]">
      <Card className="p-5">
        <div className="bg-[#62d46d] h-10 text-center grid grid-cols-3 rounded-ss-md rounded-se-md p-2">
          <div
            className="mb-auto hover:cursor-pointer"
            onClick={handleDecreaseMonth}
          >
            <ChevronLeft />
          </div>
          <div className="my-auto mx-auto flex">
            <div className="hidden sm:block">Tháng&nbsp;</div>
            <div>{month}</div>
            <div>&nbsp;-&nbsp;</div>
            <div className="hidden sm:block">Năm&nbsp;</div>
            <div>{year}</div>
          </div>
          <div
            className="ml-auto mb-auto hover:cursor-pointer"
            onClick={handleIncreaseMonth}
          >
            <ChevronRight />
          </div>
        </div>
        <div className="grid grid-cols-7 border border-[#eeeeee]">
          <div className="flex items-center justify-center mb-3">CN</div>
          <div className="flex items-center justify-center mb-3">Th2</div>
          <div className="flex items-center justify-center mb-3">Th3</div>
          <div className="flex items-center justify-center mb-3">Th4</div>
          <div className="flex items-center justify-center mb-3">Th5</div>
          <div className="flex items-center justify-center mb-3">Th6</div>
          <div className="flex items-center justify-center mb-3">Th7</div>
        </div>
        <div className="calender grid grid-rows-6 grid-cols-7">
          {calenderData.map((dayData) => {
            return (
              <DayOfCalender
                key={dayData.date}
                dayData={dayData}
                month={month}
                year={year}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap mt-3">
          <div className="flex flex-auto">
            <DotStatus className="my-auto" variant="yellow" />
            &nbsp; 0.5 công
          </div>
          <div className="flex flex-auto">
            <DotStatus className="my-auto" variant="green" />
            &nbsp; 1 công
          </div>
          <div className="flex flex-auto">
            <DotStatus className="my-auto" variant="blue" />
            &nbsp; Lương theo sản phẩm
          </div>
          <div className="flex flex-auto">
            <DotStatus className="my-auto" variant="orange" />
            &nbsp; Tăng ca
          </div>
          <div className="flex flex-auto">
            <DotStatus className="my-auto" variant="gray" />
            &nbsp; Không làm
          </div>
        </div>
      </Card>
    </div>
  );
}
