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
export default function CountProduct({ index }: { index: number }) {
  const { tableData, setTableDataIndex } = useUpdateAttendanceStore();
  // const UserData = tableData[index];
  const [userData, setUserData] = useState(tableData[index]);
  const [productValue, setProductValue] = useState<string>("");
  const [phaseValue, setPhaseValue] = useState<string>("");
  const { listProduct, listPhase } = useAttendanceStore();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [dataProduct, setDataProduct] = useState<ComboboxDataType[]>([]);
  const [dataPhase, setDataPhase] = useState<ComboboxDataType[]>([]);

  useEffect(() => {}, []);
  useEffect(() => {
    setDataProduct(
      listProduct.data.data.map((product) => ({
        label: product.name,
        value: product.id,
      }))
    );
  }, [listProduct]);

  useEffect(() => {
    setDataPhase(
      listPhase.data.map((phase) => ({
        label: phase.name,
        value: phase.id,
      }))
    );
  }, [listPhase]);

  const AddNewProductForUser = () => {
    setUserData((prev) => {
      return {
        ...prev,
        products: [
          ...prev.products,
          {
            productID: productValue,
            productName: dataProduct.find(
              (product) => product.value === productValue
            )?.label as string,
            image: "",
            phaseID: phaseValue,
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
        <div
          className="hover:bg-slate-100 pl-8 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          id="updateProduct"
        >
          Cập nhật sản phẩm tạo ra
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Cập nhật sản phẩm tạo ra</DialogTitle>
          <DialogDescription>{tableData[index].userName}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-5 ml-auto mt-3">
          <Combobox
            title="Chọn sản phẩm thêm"
            data={dataProduct}
            value={productValue}
            setValue={(value: string) => {
              setProductValue(value);
            }}
          />
          <Combobox
            title="Chọn giai đoạn "
            data={dataPhase}
            value={phaseValue}
            setValue={(value: string) => {
              setPhaseValue(value);
            }}
          />
          <Button
            disabled={productValue === "" || phaseValue === ""}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              // setDialogIsOpen(true);
              AddNewProductForUser();
            }}
          >
            Thêm sản phẩm
          </Button>
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
                <td>{product.productName}</td>
                <td>{product.phaseName}</td>
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
