"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Combobox } from "@/components/shared/common/combobox/combobox";
import { ComboboxDataType } from "@/components/shared/common/combobox/combobox-for-form";
import { X } from "lucide-react";
import { useUpdateAttendanceStore } from "@/components/shared/dashboard/attendance/update-attendance/update-attendance-store";
import { useAttendanceStore } from "@/components/shared/dashboard/attendance/attendance-store";
import SearchAndChose from "@/components/shared/common/search";
import { GetAllProductResponse, Product } from "@/types/attendance.type";
import { attendanceApi } from "@/apis/attendance.api";
export default function CountProduct({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const { tableData, setTableDataIndex } = useUpdateAttendanceStore();
  // const UserData = tableData[index];
  const [userData, setUserData] = useState(tableData[index]);
  const [productValue, setProductValue] = useState<string>("");
  const [phaseValue, setPhaseValue] = useState<string>("");
  // const { listProduct, listPhase } = useAttendanceStore();
  const [listProduct, setListProduct] = useState(
    useAttendanceStore().listProduct
  );
  const [listPhase, setListPhase] = useState(useAttendanceStore().listPhase);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [dataProduct, setDataProduct] = useState<ComboboxDataType[]>([]);
  const [dataPhase, setDataPhase] = useState<ComboboxDataType[]>([]);

  // useEffect(() => {
  //   console.log("List Product", listProduct);
  //   setDataProduct(
  //     listProduct.data.data.map((product) => ({
  //       label: product.name,
  //       value: product.id,
  //     }))
  //   );
  // }, [listProduct]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchData, setSearchData] = useState<GetAllProductResponse | null>(
    null
  );

  useEffect(() => {
    if (searchInput) {
      attendanceApi
        .getALlProduct({
          SearchTerm: searchInput,
          pageIndex: 1,
          pageSize: 10,
        })
        .then(({ data }) => {
          console.log("Search Data: ", data);
          const setProduct = new Set<string>();
          userData.products.forEach((product) => {
            setProduct.add(product.productID);
          });
          data.data.data = data.data.data.filter(
            (product) => !setProduct.has(product.id)
          );
          setSearchData(data);
        })
        .catch((error) => {
          if (error.response.data.status === 404) {
          }
        });
    } else {
      setSearchData(null); // Clear search data when input is empty
    }
  }, [searchInput, userData]);

  useEffect(() => {
    console.log("List Phase", listPhase);
    setDataPhase(
      listPhase.data.map((phase) => ({
        label: phase.name,
        value: phase.id,
      }))
    );
  }, [listPhase]);

  const AddNewProductForUser = (product: Product) => {
    setUserData((prev) => {
      return {
        ...prev,
        products: [
          ...prev.products,
          {
            productID: product.id,
            productName: product.name,
            image: product.imageResponses[0].imageUrl || "",
            phaseID: dataPhase[0].value as string,
            phaseName: dataPhase.find((phase) => phase.value === phaseValue)
              ?.label as string,
            quantity: "0",
          },
        ],
      };
    });
    setIsUpdate(true);
  };
  const updateQuantityOfProduct = (indexP: number, value: string) => {
    setUserData((prev) => {
      const newProducts = [...prev.products];
      newProducts[indexP].quantity = value;
      return {
        ...prev,
        products: newProducts,
      };
    });
    setIsUpdate(true);
  };

  const updatePhaseOfProduct = (indexP: number, value: string) => {
    setUserData((prev) => {
      const newProducts = [...prev.products];
      newProducts[indexP].phaseID = value;
      newProducts[indexP].phaseName = dataPhase.find(
        (phase) => phase.value === value
      )?.label as string;
      return {
        ...prev,
        products: newProducts,
      };
    });
    setIsUpdate(true);
  };

  const removeProduct = (indexP: number) => {
    setUserData((prev) => {
      const newProducts = [...prev.products];
      newProducts.splice(indexP, 1);
      return {
        ...prev,
        products: newProducts,
      };
    });
    setIsUpdate(true);
  };

  useEffect(() => {
    if (!dialogIsOpen && isUpdate) {
      console.log("Update Table Data");
      const data = userData;
      data.products = data.products.filter(
        (product) => product.quantity !== "0"
      );
      setTableDataIndex(index, data);
      setIsUpdate(false);
    }
  }, [dialogIsOpen, userData, index, setTableDataIndex, isUpdate]);

  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger asChild>
        {/* <div
          className="hover:bg-slate-100 pl-8 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          id="updateProduct"
        >
          Cập nhật sản phẩm tạo ra
        </div> */}
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Cập nhật sản phẩm tạo ra</DialogTitle>
          <DialogDescription>{tableData[index].userName}</DialogDescription>
        </DialogHeader>
        <div className="mr-auto ">
          <div style={{ position: "relative", width: "400px" }}>
            <Input
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
              placeholder="Nhập tên sản phẩm ..."
            />
            {searchData && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {searchData.data.data.map((item) => (
                  <li
                    key={item.id}
                    style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      AddNewProductForUser(item);
                      setSearchInput("");
                    }}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
            {searchInput !== "" && !searchData && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  zIndex: 1000,
                  padding: "8px",
                }}
              >
                No data found
              </div>
            )}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giai đoạn</th>
              <th>Số lượng</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {userData.products.map((product, indexP) => (
              <tr key={product.productID}>
                <td>
                  <div className="size-[50px] bg-gray-400 mx-auto ">
                    <Image
                      width={90}
                      height={120}
                      src={
                        "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/4/8/1177370/Thepxaydung.jpg"
                      }
                      alt={product.productName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </td>
                <td className="text-center">{product.productName}</td>
                {/* <td className="text-center">{product.phaseName}</td> */}
                <td className="text-center">
                  <select
                    onChange={(event) => {
                      updatePhaseOfProduct(indexP, event.target.value);
                    }}
                  >
                    {dataPhase.map((phase) => (
                      <option
                        key={phase.value}
                        value={phase.value}
                        selected={phase.value === product.phaseID}
                      >
                        {phase.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => {
                      updateQuantityOfProduct(indexP, e.target.value);
                    }}
                  />
                </td>
                <td>
                  {
                    <button
                      onClick={() => {
                        removeProduct(indexP);
                      }}
                    >
                      <X />
                    </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <DialogFooter>
          {/* <Button type="submit">Lưu thay đổi</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
