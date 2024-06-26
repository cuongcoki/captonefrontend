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

  useEffect(() => {
    attendanceApi
      .getEmployeeAttendanceDetail({
        Date: Date,
      })
      .then(({ data }) => {
        console.log("Attendance Detail", data.data.attendanceSlotReports);
        setData(data.data.attendanceSlotReports);
      });
  }, [Date]);
  return (
    <div className="employee-attendance-table bg-white w-full overflow-auto">
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>Slot</th>
            <th colSpan={3}>Sản phẩm </th>
            <th rowSpan={2}>Tăng ca</th>
            <th rowSpan={2}>Điểm danh</th>
          </tr>
          <tr>
            <th>Tên</th>
            <th>Giai đoạn</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              {item.employeeProductResponses.length > 0 ? (
                item.employeeProductResponses.map((product, index) => (
                  <tr key={index}>
                    {index === 0 ? (
                      <td rowSpan={item.employeeProductResponses.length}>
                        {SlotName[item.slotId]}
                      </td>
                    ) : null}
                    <td>{product.productName}</td>
                    <td>{product.phaseName}</td>
                    <td>{product.quantity}</td>
                    {index === 0 ? (
                      <td rowSpan={item.employeeProductResponses.length}>
                        {item.hourOverTime}h
                      </td>
                    ) : null}
                    {index === 0 ? (
                      <td rowSpan={item.employeeProductResponses.length}>
                        {item.isAttendance ? "Có" : "Không"}
                      </td>
                    ) : null}
                  </tr>
                ))
              ) : (
                <tr>
                  <td>{SlotName[item.slotId]}</td>
                  <td colSpan={3} className="bg-gray-300"></td>

                  <td>{item.hourOverTime}h</td>
                  <td>{item.isAttendance ? "Có" : "Không"}</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
