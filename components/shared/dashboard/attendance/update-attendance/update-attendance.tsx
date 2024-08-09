"use client";
import React, { use, useEffect, useRef, useState } from "react";
import {
  AttendanceDetailProductType,
  AttendanceDetailType,
} from "@/schema/attendance";
import Image from "next/image";
import "./style-update-attendance.css";
import { Card } from "@/components/ui/card";

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
import CountProduct from "@/components/shared/dashboard/attendance/update-attendance/count-product";
import { filesApi } from "@/apis/files.api";
import { companyApi } from "@/apis/company.api";
import HeaderComponent from "@/components/shared/common/header";
import { error } from "console";

const comboboxData: ComboboxDataType[] = [
  {
    label: "Buổi Sáng",
    value: "1",
  },
  {
    label: "Buổi Chiều",
    value: "2",
  },
  {
    label: "Buổi Tối",
    value: "3",
  },
];
const noIamge =
  "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";
export default function UpdateAttendance({
  dateProp,
  slotProp,
  warehouseProp,
}: {
  dateProp: string;
  slotProp: string;
  warehouseProp: string;
}): JSX.Element {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const colorSlaryByProduct = "bg-white";
  function formatDate(dateStr: string) {
    const [day, month, year] = dateStr.split("/");
    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");
    return `${formattedDay}/${formattedMonth}/${year}`;
  }
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

  const [date, setDate] = useState<string>(formatDate(dateProp));
  const [slot, setSlot] = useState<string>(slotProp);
  const [warehouse, setWarehouse] = useState<string>(
    userData.roleId == "2" ? userData.companyId : warehouseProp
  );
  const [users, setUsers] = useState<User[]>(user);
  const [isCreated, setIsCreated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [selectWareHouseData, setSelectWareHouseData] = useState<
    ComboboxDataType[]
  >([]);
  const [imageOfUser, setImageOfUser] = useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [isChangeCompany, setIsChangeCompany] = useState(false);

  const wareHouseRef = useRef(warehouse);
  const selectWareHouseDataRef = useRef(selectWareHouseData);
  const usersRef = useRef(users);
  const imageOfUserRef = useRef(imageOfUser);
  const isChangeCompanyRef = useRef(isChangeCompany);

  useEffect(() => {
    wareHouseRef.current = warehouse;
  }, [warehouse]);

  useEffect(() => {
    selectWareHouseDataRef.current = selectWareHouseData;
  }, [selectWareHouseData]);

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  useEffect(() => {
    imageOfUserRef.current = imageOfUser;
  }, [imageOfUser]);

  useEffect(() => {
    isChangeCompanyRef.current = isChangeCompany;
  }, [isChangeCompany]);

  useEffect(() => {
    let localWareHouse = wareHouseRef.current || "";
    let userD: User[] = [];
    // GET WAREHOUSE DATA
    if (selectWareHouseDataRef.current.length === 0) {
      companyApi.getCompanyByType(0).then(({ data }) => {
        console.log("Company Data: ", data);
        setSelectWareHouseData(
          data.data.map((item) => ({ label: item.name, value: item.id }))
        );
        if (wareHouseRef.current === "") {
          localWareHouse = data.data[0].id;
          setWarehouse(data.data[0].id);
        }
      });
    }
    // GET USERS DATA
    const FetchGetUser = async () => {
      // if (userD.length > 0 && !isChangeCompany) return;
      try {
        const response = await attendanceApi.getUserByCompanyId({
          CompanyId: localWareHouse,
        });
        const data = response.data.data;
        console.log("GetUSERS:", data);
        // setUsers(data);
        // setUser(data);
        userD = data;
      } catch (error) {
        console.log("Error getUserByCompanyId: ", error);
      }
    };
    // GET IMAGE OF USER
    const FetchImageOfUser = async () => {
      if (!isChangeCompanyRef.current && imageOfUserRef.current.size > 0)
        return;
      const iamges = new Map<string, string>();
      for (let i = 0; i < userD.length; i++) {
        try {
          const response = await filesApi.getFile(userD[i].avatar);
          // userD[i].avatar = response.data.data;
          iamges.set(userD[i].id, response.data.data);
        } catch (error) {
          console.log("Error get image: ", error);
        }
      }
      console.log("iamges of user", iamges.size);
      setImageOfUser(iamges);
      setUsers(userD);
      setUser(userD);
    };
    // GET IMAGE OF PRODUCT
    const getImage = async (name: string) => {
      try {
        const res = await filesApi.getFile(name);
        console.log("Get Image", res.data.data);
        return res.data.data;
      } catch (error: any) {
        console.log("Error get image: ", error.response.data);
      }
    };
    const setOfUser = new Set<string>();
    // GET ATTENDANCE DATA
    const getAttendanceData = async () => {
      attendanceApi
        .getAttendance({
          Date: date,
          SlotId: slot,
          PageIndex: "1",
          PageSize: "1000",
          SearchTerm: "",
          CompanyId: warehouse,
        })
        .then(async ({ data }) => {
          // console.log("data", data.data.data);
          setIsCreated(true);
          const attendanceData = await Promise.all(
            data.data.data.map(async (item): Promise<AttendanceDetailType> => {
              setOfUser.add(item.userId);
              const products = await Promise.all(
                item.employeeProductResponses.map(
                  async (product): Promise<AttendanceDetailProductType> => {
                    return {
                      productID: product.productId,
                      productName: product.productName,
                      image: await getImage(product.imageUrl),
                      phaseID: product.phaseId,
                      phaseName: product.phaseName,
                      quantity: product.quantity.toString(),
                    };
                  }
                )
              );
              return {
                userID: item.userId,
                userName: item.fullName,
                image: "",
                hourOverTime: item.hourOverTime,
                isAttendance: item.isAttendance,
                isSalaryByProduct: item.isSalaryByProduct,
                isManufacture: item.isManufacture,
                products: products,
              };
            })
          );
          console.log("attendanceData", attendanceData);

          setTableData(attendanceData);
        })
        .catch((error) => {
          console.log("Error getAttendance: ", error.response.data.status);
          if (404 === error.response.data.status) {
            const attendanceData = userD?.map((item): AttendanceDetailType => {
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
          router.push(
            `${pathname}?${userData.roleId == "2" ? "" : `warehouse=${warehouse}&`
            }date=${date}&slot=${slot}`
          );
        });
      await FetchImageOfUser();
    };

    const FetchData = async () => {
      await FetchGetUser();
      await getAttendanceData();
      setIsChangeCompany(false);
    };
    FetchData();

    console.log("RERENDER DATA ATTENDANCE");
  }, [
    setUser,
    pathname,
    router,
    date,
    slot,
    setTableData,
    warehouse,
    userData.roleId,
  ]);

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
      companyId: warehouse,
      createQuantityProducts: employeeProductData,
    };
    console.log("updateEmployeeProductData", updateEmployeeProductData);
    attendanceApi
      .updateEmployeeProduct(updateEmployeeProductData)
      .then(({ data }) => {
        console.log(data);
        // ForceRender();
        // toast.success(data.message);
      })
      .catch((error) => { });
  };

  const handleSubmit = (isCreate: boolean) => {
    let DataBody = {};
    if (isCreate) {
      DataBody = {
        slotId: Number(slot),
        date: date,
        companyId: warehouse,
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
        companyId: warehouse,
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
          setIsCreated(true);
        })
        .catch((error) => {
          if (error.response.data.error) {
            for (const key in error.response.data.error) {
              toast.error(error.response.data.error[key][0]);
            }
          } else {
            toast.error(error.response.data.message);
          }
        })
        .finally(() => {
          // ForceRender();
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
          if (error.response.data.error) {
            for (const key in error.response.data.error) {
              toast.error(error.response.data.error[key][0]);
            }
          } else {
            toast.error(error.response.data.message);
          }
        })
        .finally(() => {
          // ForceRender();
        });
    }
  };
  // Convert date format from dd/MM/yyyy to yyyy-MM-dd
  function convertDateFormat(inputDate: string) {
    const parts = inputDate.split("/");
    const formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
    return formattedDate;
  }
  useEffect(() => {
    console.log("tableData", tableData);
  }, [tableData]);
  return (
    <div>
      <HeaderComponent
        title="Điểm danh nhân viên"
        description={`Điểm danh nhân viên ngày ${dateProp} - ${comboboxData.find((item) => item.value === slotProp)?.label
          }.`}
      />
      <div className="flex space-y-2 sm:space-y-0 sm:space-x-5 mb-5 flex-wrap ">
        {userData.roleId != "2" && (
          <Combobox
            title="Vui lòng chọn cơ sở"
            data={selectWareHouseData}
            value={warehouse}
            setValue={(value: string) => {
              setWarehouse(value);
              setIsChangeCompany(true);
            }}
          />
        )}
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
        <table className="update-attendance-table w-full border-collapse overflow-x-hidden overflow-auto rounded-md">
          <thead>
            <tr>
              <th className="dark:bg-[#1c1917] dark:text-primary" rowSpan={2}>
                Ảnh
              </th>
              <th className="dark:bg-[#1c1917] dark:text-primary" rowSpan={2}>
                Tên nhân viên
              </th>
              <th className="dark:bg-[#1c1917] dark:text-primary" rowSpan={2}>
                CCCD/CMND
              </th>
              <th className="dark:bg-[#1c1917] dark:text-primary" rowSpan={2}>
                <div className="flex flex-col items-center dark:text-primary">
                  <div>Lương theo SP</div>
                  <div className="flex text-sm font-light w-full justify-around">
                    <div
                      onClick={() => {
                        checkAllSalaryByProduct(true);
                      }}
                      className="hover:cursor-pointer hover:text-blue-400"
                    >
                      <span className="text-primary">Chọn tất cả</span>
                    </div>
                    <div>|</div>
                    <div
                      onClick={() => {
                        checkAllSalaryByProduct(false);
                      }}
                      className="hover:cursor-pointer hover:text-blue-400"
                    >
                      <span className="text-red-500">Bỏ chọn</span>
                    </div>
                  </div>
                </div>
              </th>
              <th className="dark:bg-[#1c1917] dark:text-primary" colSpan={3}>
                Sản phẩm
              </th>
              <th className="dark:bg-[#1c1917] dark:text-primary" rowSpan={2}>
                Tăng ca
              </th>
              <th className="dark:bg-[#1c1917] dark:text-primary" rowSpan={2}>
                <div className="flex flex-col items-center">
                  <div>Điểm danh</div>
                  <div className="flex text-sm font-light w-full justify-around">
                    <div
                      onClick={() => {
                        checkAllAttendance(true);
                      }}
                      className="hover:cursor-pointer hover:text-blue-400"
                    >
                      <span className="text-primary">Chọn tất cả</span>
                    </div>
                    <div>|</div>
                    <div
                      onClick={() => {
                        checkAllAttendance(false);
                      }}
                      className="hover:cursor-pointer hover:text-blue-400"
                    >
                      <span className="text-red-500">Bỏ chọn</span>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th className="dark:bg-[#1c1917] dark:text-primary">Tên</th>
              <th className="dark:bg-[#1c1917] dark:text-primary">Mã</th>
              <th className="dark:bg-[#1c1917] dark:text-primary">Số lượng</th>
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
                              <Image
                                width={90}
                                height={120}
                                src={
                                  (imageOfUser.get(item.userID) as string) ||
                                  noIamge
                                }
                                alt={item.userName}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </td>
                          <td
                            className="dark:bg-[#1c1917]"
                            rowSpan={item.products.length}
                          >
                            {item.userName}
                          </td>
                          <td
                            className="dark:bg-[#1c1917]"
                            rowSpan={item.products.length}
                          >
                            {item.userID}
                          </td>
                          <td
                            className="dark:bg-[#1c1917]"
                            rowSpan={item.products.length}
                          >
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
                      <CountProduct index={index}>
                        <td
                          className={
                            item.isSalaryByProduct === true
                              ? "dark:bg-[#1c1917]"
                              : colorSlaryByProduct + " dark:bg-black"
                          }
                          data-index={index}
                          data-ismanufacture={item.isManufacture}
                          data-issalarybyproduct={item.isSalaryByProduct}
                        >
                          {product.productName}
                        </td>
                      </CountProduct>
                      <CountProduct index={index}>
                        <td
                          className={
                            item.isSalaryByProduct === true
                              ? "dark:bg-[#1c1917]"
                              : colorSlaryByProduct + " dark:bg-black"
                          }
                          data-index={index}
                          data-ismanufacture={item.isManufacture}
                          data-issalarybyproduct={item.isSalaryByProduct}
                        >
                          {product.phaseName}
                        </td>
                      </CountProduct>
                      <CountProduct index={index}>
                        <td
                          className={
                            item.isSalaryByProduct === true
                              ? "dark:bg-[#1c1917]"
                              : colorSlaryByProduct + " dark:bg-black"
                          }
                          data-index={index}
                          data-ismanufacture={item.isManufacture}
                          data-issalarybyproduct={item.isSalaryByProduct}
                        >
                          {product.quantity}
                        </td>
                      </CountProduct>
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
                                step={0.5}
                                disabled={
                                  item.isAttendance === false ||
                                  item.isSalaryByProduct === true
                                }
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
                        <Image
                          width={90}
                          height={120}
                          src={
                            (imageOfUser.get(item.userID) as string) || noIamge
                          }
                          alt={item.userName}
                          className="object-cover w-full h-full"
                        />
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

                    <>
                      <CountProduct index={index}>
                        <td
                          data-index={index}
                          data-ismanufacture={item.isManufacture}
                          data-issalarybyproduct={item.isSalaryByProduct}
                          className={`${item.isSalaryByProduct === true
                            ? "dark:bg-[#1c1917] "
                            : "bg-white dark:bg-card "
                            }`}
                        >
                          Nhấn vào
                        </td>
                      </CountProduct>
                      <CountProduct index={index}>
                        <td
                          data-index={index}
                          data-ismanufacture={item.isManufacture}
                          data-issalarybyproduct={item.isSalaryByProduct}
                          className={`${item.isSalaryByProduct === true
                            ? "dark:bg-[#1c1917] "
                            : "bg-white dark:bg-card"
                            }`}
                        >
                          Để tạo
                        </td>
                      </CountProduct>
                      <CountProduct index={index}>
                        <td
                          data-index={index}
                          data-ismanufacture={item.isManufacture}
                          data-issalarybyproduct={item.isSalaryByProduct}
                          className={`${item.isSalaryByProduct === true
                            ? "dark:bg-[#1c1917] "
                            : "bg-white dark:bg-card"
                            }`}
                        >
                          Sản phẩm
                        </td>
                      </CountProduct>
                    </>

                    <td>
                      <div className="flex items-center">
                        <Input
                          className="w-[70px] mx-auto"
                          type="number"
                          value={item.hourOverTime}
                          onChange={(event) => {
                            updateOverTime(index, event.target.value);
                          }}
                          step={0.5}
                          disabled={
                            item.isAttendance === false ||
                            item.isSalaryByProduct === true
                          }
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
            className="bg-[#00dd00] hover:bg-[#00aa00]"
            onClick={() => handleSubmit(false)}
          >
            Lưu điểm danh
          </Button>
        ) : (
          <Button
            className="bg-[#00dd00] hover:bg-[#00aa00]"
            onClick={() => handleSubmit(true)}
          >
            Lưu điểm danh
          </Button>
        )}
      </div>
    </div>
  );
}
