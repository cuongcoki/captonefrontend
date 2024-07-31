"use client";
import React, { useEffect, useState } from "react";
import "./style.css";
import { AttendanceSlotDetail } from "@/types/attendance.type";
import { attendanceApi } from "@/apis/attendance.api";

type Props = {
  Date: string;
};

const SlotName: { [key: number]: string } = {
  1: "Sáng",
  2: "Chiều",
  3: "Tối",
};

export default function EmployeeAttendanceDetail({ Date }: Props) {
  const [data, setData] = useState<AttendanceSlotDetail[]>([]);
  function formatDate(dateStr: string) {
    const [day, month, year] = dateStr.split("/");
    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");
    return `${formattedDay}/${formattedMonth}/${year}`;
  }
  useEffect(() => {
    attendanceApi
      .getEmployeeAttendanceDetail({
        Date: formatDate(Date),
      })
      .then(({ data }) => {
        console.log("Attendance Detail", data.data.attendanceSlotReports);
        setData(data.data.attendanceSlotReports);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, [Date]);
  return (
    <div className="employee-attendance-table bg-white w-full overflow-auto">
      <table>
        <thead>
          <tr>
            <th className="dark:bg-[#1c1917]" rowSpan={2}>
              Buổi
            </th>
            <th className="dark:bg-[#1c1917]" colSpan={2}>
              Sản phẩm
            </th>
            <th className="dark:bg-[#1c1917]" rowSpan={2}>
              Tăng ca
            </th>
            <th className="dark:bg-[#1c1917]" rowSpan={2}>
              Điểm danh
            </th>
          </tr>
          <tr>
            <th className="dark:bg-[#1c1917]">Tên</th>
            {/* <th className="dark:bg-[#1c1917]">Giai đoạn</th> */}
            <th className="dark:bg-[#1c1917]">Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              {item.employeeProductResponses.length > 0 ? (
                item.employeeProductResponses.map((product, index) => (
                  <tr key={index}>
                    {index === 0 ? (
                      <td
                        className="dark:bg-[#1c1917]"
                        rowSpan={item.employeeProductResponses.length}
                      >
                        {SlotName[item.slotId]}
                      </td>
                    ) : null}
                    <td className="dark:bg-[#1c1917]">{product.productName}</td>
                    {/* <td className="dark:bg-[#1c1917]">{product.phaseName}</td> */}
                    <td className="dark:bg-[#1c1917]">{product.quantity}</td>
                    {index === 0 ? (
                      <td
                        className="dark:bg-[#1c1917]"
                        rowSpan={item.employeeProductResponses.length}
                      >
                        {item.hourOverTime}h
                      </td>
                    ) : null}
                    {index === 0 ? (
                      <td
                        className="dark:bg-[#1c1917]"
                        rowSpan={item.employeeProductResponses.length}
                      >
                        {item.isAttendance ? "Có" : "Không"}
                      </td>
                    ) : null}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="dark:bg-[#1c1917]">{SlotName[item.slotId]}</td>
                  <td colSpan={2} className="bg-gray-300 dark:bg-black "></td>

                  <td className="dark:bg-[#1c1917]">{item.hourOverTime}h</td>
                  <td className="dark:bg-[#1c1917]">
                    {item.isAttendance ? "Có" : "Không"}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
