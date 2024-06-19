"use client";
import React, { use, useEffect, useState } from "react";
import {
  AttendanceDetailProductType,
  AttendanceDetailType,
} from "@/schema/attendance";
import Image from "next/image";
import "./style-update-attendance.css";
import { Card } from "@/components/ui/card";
import { ContextMenuForAttendance } from "@/components/shared/dashboard/attendance/update-attendance/context-menu";
import { Button } from "@/components/ui/button";
import { useUpdateAttendanceStore } from "@/components/shared/dashboard/attendance/update-attendance/update-attendance-store";
import { Input } from "@/components/ui/input";
import { attendanceApi } from "@/apis/attendance.api";
import {
  AttendanceForUpdate,
  UpdateAttendanceBody,
} from "@/types/attendance.type";
import toast from "react-hot-toast";

export default function UpdateAttendance({
  date,
  slot,
}: {
  date: string;
  slot: string;
}): JSX.Element {
  const { tableData, setTableData, handleAttendanceChange, updateOverTime } =
    useUpdateAttendanceStore();
  const [force, setForce] = useState(0);
  const ForceRender = () => {
    setForce(force + 1);
  };

  const colorSlaryByProduct = "bg-[#f1eeee]";

  useEffect(() => {
    attendanceApi
      .getAttendance({
        Date: date,
        SlotId: slot,
        PageIndex: "1",
        PageSize: "1000",
        SearchTerm: "",
      })
      .then(({ data }) => {
        console.log("data", data.data.data);
        const attendanceData = data.data.data.map(
          (item): AttendanceDetailType => {
            return {
              userID: item.userId,
              userName: item.fullName,
              image: "",
              hourOverTime: item.hourOverTime,
              isAttendance: item.isAttendance,
              isSalaryByProduct: item.isSalaryByProduct,
              isManufacture: item.isManufacture,
              products: item.employeeProductResponses.map(
                (product): AttendanceDetailProductType => {
                  return {
                    productID: product.productId,
                    productName: product.productName,
                    image: product.imageUrl,
                    phaseID: product.phaseId,
                    phaseName: product.phaseName,
                    quantity: product.quantity.toString(),
                  };
                }
              ),
            };
          }
        );
        console.log("attendanceData", attendanceData);
        setTableData(attendanceData);
      });
  }, [date, slot, setTableData, force]);

  const saveDraft = () => {
    console.log("Save draft");
    if (typeof window !== "undefined") {
      localStorage.setItem("DataAttendanceDetail", JSON.stringify(tableData));
    }
  };
  useEffect(() => {
    console.log("tableData", tableData);
  }, [tableData]);

  const handleSubmit = () => {
    const updateData: UpdateAttendanceBody = {
      slotId: Number(slot),
      date: date,
      updateAttendances: tableData.map((item): AttendanceForUpdate => {
        return {
          userId: item.userID,
          hourOverTime: item.hourOverTime,
          isAttendance: Boolean(item.isAttendance),
          isOverTime: false,
          isSalaryByProduct: Boolean(item.isSalaryByProduct),
          isManufacture: Boolean(item.isManufacture),
        };
      }),
    };
    console.log("updateData", updateData);

    attendanceApi
      .updateAttendance(updateData)
      .then(({ data }) => {
        console.log(data);
        ForceRender();
        toast.success(data.message);
      })
      .catch((error) => {
        // console.log("Update error", error.response.data.error);
        // toast.error(error.response.data.error);
      });
  };

  return (
    <Card>
      <div className="flex justify-center text-[2rem]">FORM ĐIỂM DANH</div>
      <div className="grid grid-rows-4 m-5">
        <div className="">
          {/* <div>Cơ sở: {warehouseID}</div> */}
          <div>Ngày: {date}</div>
          <div>Slot: {slot}</div>
        </div>
        <div className="row-span-3 space-y-2 ml-auto">
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
      <div className="w-full overflow-auto">
        <table className="update-attendance-table w-full border-collapse overflow-x-hidden overflow-auto">
          <thead>
            <tr>
              <th rowSpan={2}>Ảnh</th>
              <th rowSpan={2}>Tên</th>
              <th rowSpan={2}>CCCD</th>
              <th colSpan={3}>Sản phẩm</th>
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
            {tableData.map((item, index) => (
              <React.Fragment key={index}>
                {item.products.length > 0 && item.isManufacture === true ? (
                  item.products.map((product, productIndex) => (
                    <tr key={product.productID}>
                      {productIndex === 0 && (
                        <>
                          <td rowSpan={item.products.length}>
                            <div className="w-[90px] h-[120px] bg-gray-400 mx-auto">
                              {/* <Image
                              width={90}
                              height={120}
                              src={item.image}
                              alt={item.userName}
                              className="object-cover w-full h-full"
                            /> */}
                            </div>
                          </td>
                          <td rowSpan={item.products.length}>
                            {item.userName}
                          </td>
                          <td rowSpan={item.products.length}>{item.userID}</td>
                        </>
                      )}
                      <ContextMenuForAttendance index={index}>
                        <td
                          className={
                            item.isSalaryByProduct === true
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
                      <ContextMenuForAttendance index={index}>
                        <td
                          className={
                            item.isSalaryByProduct === true
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
                      <ContextMenuForAttendance index={index}>
                        <td
                          className={
                            item.isSalaryByProduct === true
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
                      {productIndex == 0 && (
                        <>
                          <td rowSpan={item.products.length}>
                            <div className="flex items-center">
                              <Input
                                className="w-[70px] mx-auto"
                                type="number"
                                value={item.hourOverTime}
                                onChange={(event) => {
                                  updateOverTime(index, event.target.value);
                                }}
                              />
                              <div>giờ</div>
                            </div>
                          </td>
                          <td rowSpan={item.products.length}>
                            <input
                              className="size-[30px]"
                              type="checkbox"
                              checked={item.isAttendance === true}
                              onChange={(event) =>
                                handleAttendanceChange(
                                  index,
                                  event.target.checked
                                )
                              }
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  // Hiển thị hàng trống nếu không có sản phẩm
                  <tr>
                    <td>
                      <div className="w-[90px] h-[120px] bg-gray-400 mx-auto">
                        {/* <Image
                        width={90}
                        height={120}
                        src={item.image}
                        alt={item.userName}
                        className="object-cover w-full h-full"
                      /> */}
                      </div>
                    </td>
                    <td>{item.userName}</td>
                    <td>{item.userID}</td>
                    {item.isManufacture === true ? (
                      <>
                        <ContextMenuForAttendance index={index}>
                          <td
                            className={
                              item.isSalaryByProduct === true
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
                        <ContextMenuForAttendance index={index}>
                          <td
                            className={
                              item.isSalaryByProduct === true
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
                        <ContextMenuForAttendance index={index}>
                          <td
                            className={
                              item.isSalaryByProduct === true
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
                      <ContextMenuForAttendance index={index}>
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
                      <div className="flex items-center">
                        <Input
                          className="w-[70px] mx-auto"
                          type="number"
                          value={item.hourOverTime}
                          onChange={(event) => {
                            updateOverTime(index, event.target.value);
                          }}
                        />
                        <div>giờ</div>
                      </div>
                    </td>
                    <td>
                      <input
                        className="size-[30px]"
                        type="checkbox"
                        checked={item.isAttendance === true}
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
      </div>
      <div className="flex justify-end items-center gap-5 m-5 mt-10">
        {/* <Button className="bg-[#00a9ff] hover:bg-[#0087cc]" onClick={saveDraft}>
          Lưu bản nháp
        </Button> */}
        <Button
          className="bg-[#00dd00] hover:bg-[#00aa00]"
          onClick={handleSubmit}
        >
          Lưu thay đổi
        </Button>
      </div>
    </Card>
  );
}
