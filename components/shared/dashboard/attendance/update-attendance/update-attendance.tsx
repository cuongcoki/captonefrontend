"use client";
import React, { use, useEffect, useState } from "react";
import { AttendanceDetailType } from "@/schema/attendance";
import Image from "next/image";
import "./style-update-attendance.css";
import { Card } from "@/components/ui/card";
import { ContextMenuForAttendance } from "@/components/shared/dashboard/attendance/update-attendance/context-menu";

export default function UpdateAttendance({
  data,
}: {
  data: AttendanceDetailType[];
}): JSX.Element {
  const [tableData, setTableData] = useState<AttendanceDetailType[]>(data);

  const colorSlaryByProduct = "bg-[#f1eeee]";

  const handleAttendanceChange = (index: number, checked: boolean) => {
    setTableData((prev) => {
      const newData = [...prev];
      newData[index].isAttendance = checked ? "true" : "false";
      return newData;
    });
  };
  useEffect(() => {
    console.log("tableData", tableData);
  }, [tableData]);
  return (
    <Card>
      <div className="flex justify-center text-[2rem]">FORM ĐIỂM DANH</div>
      <div className="flex items-center m-5">
        <div className="">
          <div>Ngày: 2/3/2024</div>
          <div>Cơ sở: 1</div>
          <div>Slot: Chiều</div>
        </div>
        <div className="space-y-2 ml-auto">
          <div className="flex items-center">
            <div className="size-10 bg-[#ffff] border border-black"></div>
            <div className="ml-3"> :Có tạo sản phẩm và lương theo sản phẩm</div>
          </div>
          <div className="flex items-center ">
            <div className="size-10 bg-[#f1eeee] border border-black"></div>
            <div className="ml-3"> :Có tạo sản phẩm nhưng lương công nhật</div>
          </div>
          <div className="flex items-center ">
            <div className="size-10 bg-[#b1aeae] border border-black"></div>
            <div className="ml-3"> :Không tạo sản phẩm và lương công nhật</div>
          </div>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th rowSpan={2}>Ảnh</th>
            <th rowSpan={2}>Tên</th>
            <th rowSpan={2}>CCCD</th>
            <th colSpan={3}>Sản phẩm</th>
            <th rowSpan={2}>Điểm danh</th>
          </tr>
          <tr>
            <th>Tên</th>
            <th>Giai đoạn</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <React.Fragment key={index}>
              {item.products.length > 0 && item.isManufacture === "true" ? (
                item.products.map((product, productIndex) => (
                  <tr key={product.productID}>
                    {productIndex === 0 && (
                      <>
                        <td rowSpan={item.products.length}>
                          <div className="w-[90px] h-[120px] bg-gray-400 mx-auto">
                            <Image
                              width={90}
                              height={120}
                              src={item.image}
                              alt={item.userName}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </td>
                        <td rowSpan={item.products.length}>{item.userName}</td>
                        <td rowSpan={item.products.length}>{item.userID}</td>
                      </>
                    )}
                    <ContextMenuForAttendance
                      setTableData={setTableData}
                      index={index}
                    >
                      <td
                        className={
                          item.isSalaryByProduct === "true"
                            ? ""
                            : colorSlaryByProduct
                        }
                        data-index={index}
                        data-ismanufacture={item.isManufacture}
                        data-issalarybyproduct={item.isSalaryByProduct}
                      >
                        {product.productName}
                      </td>
                    </ContextMenuForAttendance>
                    <ContextMenuForAttendance
                      setTableData={setTableData}
                      index={index}
                    >
                      <td
                        className={
                          item.isSalaryByProduct === "true"
                            ? ""
                            : colorSlaryByProduct
                        }
                        data-index={index}
                        data-ismanufacture={item.isManufacture}
                        data-issalarybyproduct={item.isSalaryByProduct}
                      >
                        {product.phaseName}
                      </td>
                    </ContextMenuForAttendance>
                    <ContextMenuForAttendance
                      setTableData={setTableData}
                      index={index}
                    >
                      <td
                        className={
                          item.isSalaryByProduct === "true"
                            ? ""
                            : colorSlaryByProduct
                        }
                        data-index={index}
                        data-ismanufacture={item.isManufacture}
                        data-issalarybyproduct={item.isSalaryByProduct}
                      >
                        {product.quantity}
                      </td>
                    </ContextMenuForAttendance>
                    {productIndex === 0 && (
                      <td rowSpan={item.products.length}>
                        <input
                          className="size-[30px]"
                          type="checkbox"
                          checked={item.isAttendance === "true"}
                          onChange={(event) =>
                            handleAttendanceChange(index, event.target.checked)
                          }
                        />
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                // Hiển thị hàng trống nếu không có sản phẩm
                <tr>
                  <td>
                    <div className="w-[90px] h-[120px] bg-gray-400 mx-auto"></div>
                  </td>
                  <td>{item.userName}</td>
                  <td>{item.userID}</td>
                  {item.isManufacture === "true" ? (
                    <>
                      <ContextMenuForAttendance
                        setTableData={setTableData}
                        index={index}
                      >
                        <td
                          className={
                            item.isSalaryByProduct === "true"
                              ? ""
                              : colorSlaryByProduct
                          }
                          data-index={index}
                          data-ismanufacture={item.isManufacture}
                          data-issalarybyproduct={item.isSalaryByProduct}
                        >
                          Click chuột phải
                        </td>
                      </ContextMenuForAttendance>
                      <ContextMenuForAttendance
                        setTableData={setTableData}
                        index={index}
                      >
                        <td
                          className={
                            item.isSalaryByProduct === "true"
                              ? ""
                              : colorSlaryByProduct
                          }
                          data-index={index}
                          data-ismanufacture={item.isManufacture}
                          data-issalarybyproduct={item.isSalaryByProduct}
                        >
                          Để tạo
                        </td>
                      </ContextMenuForAttendance>
                      <ContextMenuForAttendance
                        setTableData={setTableData}
                        index={index}
                      >
                        <td
                          className={
                            item.isSalaryByProduct === "true"
                              ? ""
                              : colorSlaryByProduct
                          }
                          data-index={index}
                          data-ismanufacture={item.isManufacture}
                          data-issalarybyproduct={item.isSalaryByProduct}
                        >
                          Sản phẩm
                        </td>
                      </ContextMenuForAttendance>
                    </>
                  ) : (
                    <ContextMenuForAttendance
                      setTableData={setTableData}
                      index={index}
                    >
                      <td
                        className="bg-[#b1aeae]"
                        colSpan={3}
                        data-index={index}
                        data-ismanufacture={item.isManufacture}
                        data-issalarybyproduct={item.isSalaryByProduct}
                      ></td>
                    </ContextMenuForAttendance>
                  )}

                  <td>
                    <input
                      className="size-[30px]"
                      type="checkbox"
                      checked={item.isAttendance === "true"}
                      onChange={(event) =>
                        handleAttendanceChange(index, event.target.checked)
                      }
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
