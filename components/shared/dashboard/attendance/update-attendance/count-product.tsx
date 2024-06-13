"use client";
import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { useUpdateAttendanceStore } from "@/components/shared/dashboard/attendance/update-attendance/update-attendance";
import Image from "next/image";
import { Combobox } from "@/components/shared/common/combobox/combobox";
import { ComboboxDataType } from "@/components/shared/common/combobox/combobox-for-form";
import { X } from "lucide-react";
export default function CountProduct({ index }: { index: number }) {
  const { tableData, updateQuantityOfProduct, addNewProduct, removeProduct } =
    useUpdateAttendanceStore();
  const UserData = tableData[index];
  const [productValue, setProductValue] = useState<string>("");
  const [phaseValue, setPhaseValue] = useState<string>("");
  const dataProduct: ComboboxDataType[] = [
    { label: "Sản phẩm 1", value: "0" },
    { label: "Sản phẩm 2", value: "1" },
    { label: "Sản phẩm 3", value: "2" },
  ];
  const dataPhase: ComboboxDataType[] = [
    { label: "Công đoạn 1", value: "0" },
    { label: "Công đoạn 2", value: "1" },
    { label: "Công đoạn 3", value: "2" },
  ];

  const AddNewProductForUser = () => {
    addNewProduct(index, {
      productID: productValue,
      productName: dataProduct[parseInt(productValue)].label,
      image: "",
      phaseID: phaseValue,
      phaseName: dataPhase[parseInt(phaseValue)].label,
      quantity: "0",
    });
  };

  return (
    <Dialog>
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
            onClick={AddNewProductForUser}
          >
            {" "}
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
            {UserData.products.map((product, indexP) => (
              <tr key={index}>
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
                      updateQuantityOfProduct(index, indexP, e.target.value);
                    }}
                  />
                </td>
                <td>
                  {
                    <button
                      onClick={() => {
                        removeProduct(index, indexP);
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
