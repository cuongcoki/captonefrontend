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
  CreateAttendanceBody,
  GetUsersResponse,
  ProductEmployee,
  UpdateAttendanceBody,
  UpdateEmployeeProductBody,
  User,
} from "@/types/attendance.type";
import toast from "react-hot-toast";
import { useAttendanceStore } from "@/components/shared/dashboard/attendance/attendance-store";
import DatePicker from "@/components/shared/common/datapicker/date-picker";
import { format, set } from "date-fns";
import { ComboboxDataType } from "@/components/shared/common/combobox/combobox-for-form";
import { Combobox } from "@/components/shared/common/combobox/combobox";
import { usePathname, useRouter } from "next/navigation";

const comboboxData: ComboboxDataType[] = [
  {
    label: "Slot Sáng",
    value: "1",
  },
  {
    label: "Slot Chiều",
    value: "2",
  },
  {
    label: "Slot Tối",
    value: "3",
  },
];

export default function UpdateAttendance({
  dateProp,
  slotProp,
}: {
  dateProp: string;
  slotProp: string;
}): JSX.Element {
  const colorSlaryByProduct = "bg-[#f1eeee]";
  const {
    tableData,
    setTableData,
    handleAttendanceChange,
    updateOverTime,
    updateSalaryByProduct,
    checkAllAttendance,
    checkAllSalaryByProduct,
    user,
    setUser,
  } = useUpdateAttendanceStore();
  const { setListProduct, setListPhase } = useAttendanceStore();
  const [force, setForce] = useState(0);
  const ForceRender = () => {
    setForce(force + 1);
  };
  const [date, setDate] = useState<string>(dateProp);
  const [slot, setSlot] = useState<string>(slotProp);
  const [users, setUsers] = useState<User[]>(user);
  const [isCreated, setIsCreated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (users.length > 0) return;
    attendanceApi
      .getUsers({
        SearchTerm: "",
        PageIndex: "1",
        PageSize: "1000",
        IsActive: "true",
        RoleId: "1",
      })
      .then(({ data }) => {
        console.log("GetUSERS:", data.data.data);
        setUsers(data.data.data);
        setUser(data.data.data);
      });
  }, [users, setUser]);

  useEffect(() => {
    const setUser = new Set<string>();
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
        setIsCreated(true);
        const attendanceData = data.data.data.map(
          (item): AttendanceDetailType => {
            setUser.add(item.userId);
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
        users.forEach((u) => {
          if (!setUser.has(u.id)) {
            attendanceData.push({
              userID: u.id,
              userName: u.firstName + " " + u.lastName,
              image: "",
              hourOverTime: "0",
              isAttendance: false,
              isSalaryByProduct: false,
              isManufacture: false,
              products: [],
            });
          }
        });
        setTableData(attendanceData);
      })
      .catch((error) => {
        console.log("Error getAttendance: ", error.response.data.message);
        if ("Attendance is not found" === error.response.data.message) {
          const attendanceData = users?.map((item): AttendanceDetailType => {
            return {
              userID: item.id,
              userName: item.firstName + " " + item.lastName,
              image: "",
              hourOverTime: "0",
              isAttendance: false,
              isSalaryByProduct: false,
              isManufacture: false,
              products: [],
            };
          });
          setTableData(attendanceData as AttendanceDetailType[]);
          setIsCreated(false);
        }
      })
      .finally(() => {
        router.push(`${pathname}?date=${date}&slot=${slot}`);
      });
  }, [date, slot, setTableData, force, router, pathname, users]);

  useEffect(() => {
    attendanceApi
      .getALlProduct({
        SearchTerm: "",
        pageIndex: 1,
        pageSize: 10000,
      })
      .then(({ data }) => {
        console.log("Product Data: ", data);
        setListProduct(data);
      })
      .catch((error) => {
        console.log("Error getALlProduct: ", error);
      });
  }, [setListProduct]);

  useEffect(() => {
    attendanceApi
      .getAllPhase()
      .then(({ data }) => {
        console.log("Phase Data: ", data);
        setListPhase(data);
      })
      .catch((error) => {
        console.log("Error getAllPhase: ", error);
      });
  }, [setListPhase]);

  // const saveDraft = () => {
  //   console.log("Save draft");
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("DataAttendanceDetail", JSON.stringify(tableData));
  //   }
  // };
  useEffect(() => {
    console.log("tableData", tableData);
  }, [tableData]);

  const updateEmployeeProduct = () => {
    const employeeProductData: ProductEmployee[] = [];
    tableData.forEach((item) => {
      item.products.forEach((product) => {
        employeeProductData.push({
          productId: product.productID,
          phaseId: product.phaseID,
          userId: item.userID,
          quantity: Number(product.quantity),
          isMold: true,
        });
      });
    });
    const updateEmployeeProductData: UpdateEmployeeProductBody = {
      date: date,
      slotId: Number(slot),
      createQuantityProducts: employeeProductData,
    };
    console.log("updateEmployeeProductData", updateEmployeeProductData);
    attendanceApi
      .updateEmployeeProduct(updateEmployeeProductData)
      .then(({ data }) => {
        console.log(data);

        // toast.success(data.message);
      });
  };

  const handleSubmit = (isCreate: boolean) => {
    let DataBody = {};
    if (isCreate) {
      DataBody = {
        slotId: Number(slot),
        date: date,
        createAttendances: tableData.map((item): AttendanceForUpdate => {
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
    } else {
      DataBody = {
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
    }

    console.log("updateData", DataBody);
    if (isCreate) {
      attendanceApi
        .createAttendance(DataBody as CreateAttendanceBody)
        .then(({ data }) => {
          console.log(data);
          updateEmployeeProduct();
          toast.success(data.message);
        })
        .catch((error) => {
          console.log("Create error", error.response.data);
          toast.error(error.response.data.message);
        })
        .finally(() => {
          ForceRender();
        });
    } else {
      attendanceApi
        .updateAttendance(DataBody as UpdateAttendanceBody)
        .then(({ data }) => {
          console.log(data);
          updateEmployeeProduct();

          toast.success(data.message);
        })
        .catch((error) => {
          console.log("Update error", error.response.data);
          toast.error(error.response.data.message);
        })
        .finally(() => {
          ForceRender();
        });
    }
  };
  // Convert date format from dd/MM/yyyy to yyyy-MM-dd
  function convertDateFormat(inputDate: string) {
    let parts = inputDate.split("/");
    let formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
    return formattedDate;
  }

  return (
    <Card>
      <div className="flex justify-center text-[2rem]">QUẢN LÝ ĐIỂM DANH</div>
      <div className="flex space-y-2 sm:space-y-0 sm:space-x-5 m-5 flex-wrap">
        <div className="">
          <DatePicker
            selected={new Date(convertDateFormat(date || ""))}
            name="from"
            title={date || "Chọn ngày"}
            className="w-full"
            value={"2024-06-16"}
            onDayClick={(event: any) => {
              setDate(format(event, "dd/MM/yyyy"));
            }}
          />
        </div>
        <Combobox
          title="Vui lòng chọn slot"
          data={comboboxData}
          value={slot}
          setValue={(value: string) => {
            setSlot(value);
          }}
        />
      </div>
      <div className="w-full overflow-auto">
        <table className="update-attendance-table w-full border-collapse overflow-x-hidden overflow-auto">
          <thead>
            <tr>
              <th rowSpan={2}>Ảnh</th>
              <th rowSpan={2}>Tên</th>
              <th rowSpan={2}>CCCD</th>
              <th className="" rowSpan={2}>
                <div className="flex flex-col items-center">
                  <div>Lương theo SP</div>
                  <div className="flex text-sm font-light">
                    <div
                      onClick={() => {
                        checkAllSalaryByProduct(true);
                      }}
                      className="hover:cursor-pointer hover:text-blue-400"
                    >
                      Chọn hết
                    </div>
                    <div>|</div>
                    <div
                      onClick={() => {
                        checkAllSalaryByProduct(false);
                      }}
                      className="hover:cursor-pointer hover:text-blue-400"
                    >
                      Bỏ hết
                    </div>
                  </div>
                </div>
              </th>
              <th colSpan={3}>Sản phẩm</th>
              <th rowSpan={2}>Tăng ca</th>
              <th rowSpan={2}>
                <div className="flex flex-col items-center">
                  <div>Điểm danh</div>
                  <div className="flex text-sm font-light">
                    <div
                      onClick={() => {
                        checkAllAttendance(true);
                      }}
                      className="hover:cursor-pointer hover:text-blue-400"
                    >
                      Chọn hết
                    </div>
                    <div>|</div>
                    <div
                      onClick={() => {
                        checkAllAttendance(false);
                      }}
                      className="hover:cursor-pointer hover:text-blue-400"
                    >
                      Bỏ hết
                    </div>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th>Tên</th>
              <th>Giai đoạn</th>
              <th>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((item, index) => (
              <React.Fragment key={index}>
                {item.products.length > 0 ? (
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
                          <td rowSpan={item.products.length}>
                            <input
                              className="size-[30px]"
                              type="checkbox"
                              checked={item.isSalaryByProduct === true}
                              onChange={(event) =>
                                updateSalaryByProduct(
                                  index,
                                  event.target.checked
                                )
                              }
                            />
                          </td>
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
                    <td>
                      <input
                        className="size-[30px]"
                        type="checkbox"
                        checked={item.isSalaryByProduct === true}
                        onChange={(event) =>
                          updateSalaryByProduct(index, event.target.checked)
                        }
                      />
                    </td>
                    {item.products.length === 0 && item.isSalaryByProduct ? (
                      <>
                        <ContextMenuForAttendance index={index}>
                          <td
                            data-index={index}
                            data-ismanufacture={item.isManufacture}
                            data-issalarybyproduct={item.isSalaryByProduct}
                          >
                            Click chuột phải
                          </td>
                        </ContextMenuForAttendance>
                        <ContextMenuForAttendance index={index}>
                          <td
                            data-index={index}
                            data-ismanufacture={item.isManufacture}
                            data-issalarybyproduct={item.isSalaryByProduct}
                          >
                            Để tạo
                          </td>
                        </ContextMenuForAttendance>
                        <ContextMenuForAttendance index={index}>
                          <td
                            data-index={index}
                            data-ismanufacture={item.isManufacture}
                            data-issalarybyproduct={item.isSalaryByProduct}
                          >
                            Sản phẩm
                          </td>
                        </ContextMenuForAttendance>
                      </>
                    ) : (
                      <td
                        className="bg-[#f1eeee]"
                        colSpan={3}
                        data-index={index}
                        data-ismanufacture={item.isManufacture}
                        data-issalarybyproduct={item.isSalaryByProduct}
                      ></td>
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
        {isCreated ? (
          <Button
            className="bg-[#00a9ff] hover:bg-[#0087cc]"
            onClick={() => handleSubmit(false)}
          >
            Lưu thay đổi
          </Button>
        ) : (
          <Button
            className="bg-[#00dd00] hover:bg-[#00aa00]"
            onClick={() => handleSubmit(true)}
          >
            Tạo điểm danh
          </Button>
        )}
      </div>
    </Card>
  );
}
