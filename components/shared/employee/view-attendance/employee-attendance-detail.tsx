import React, { useState } from "react";
import "./style.css";
import { EmployeeAttendanceDetailType } from "@/types/attendance.type";

const FakeData: EmployeeAttendanceDetailType[] = [
  {
    slotId: 1,
    products: [
      { name: "Product A", phase: "Phase 1", quantity: 10 },
      { name: "Product B", phase: "Phase 2", quantity: 5 },
    ],
    overTime: 2,
    isAttendance: true,
  },
  {
    slotId: 2,
    products: [
      { name: "Product C", phase: "Phase 1", quantity: 8 },
      { name: "Product D", phase: "Phase 3", quantity: 12 },
    ],
    overTime: 1.5,
    isAttendance: true,
  },
  {
    slotId: 3,
    products: [
      { name: "Product E", phase: "Phase 2", quantity: 15 },
      { name: "Product F", phase: "Phase 1", quantity: 7 },
    ],
    overTime: 3,
    isAttendance: false,
  },
];

export default function EmployeeAttendanceDetail() {
  const [data, setData] = useState<EmployeeAttendanceDetailType[]>(FakeData);
  return (
    <div className="bg-white w-full overflow-auto">
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
              {item.products.map((product, index) => (
                <tr key={index}>
                  {index === 0 ? (
                    <td rowSpan={item.products.length}>{item.slotId}</td>
                  ) : null}
                  <td>{product.name}</td>
                  <td>{product.phase}</td>
                  <td>{product.quantity}</td>
                  {index === 0 ? (
                    <td rowSpan={item.products.length}>{item.overTime}</td>
                  ) : null}
                  {index === 0 ? (
                    <td rowSpan={item.products.length}>
                      {item.isAttendance ? "Có" : "Không"}
                    </td>
                  ) : null}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
