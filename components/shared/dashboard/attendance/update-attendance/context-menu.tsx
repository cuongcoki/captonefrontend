"use client";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { AttendanceDetailType } from "@/schema/attendance";
import { set } from "date-fns";
import React, { useEffect, useState } from "react";
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
var indexData: any | null = null;

export function ContextMenuForAttendance({
  children,
  setTableData,
  index,
}: {
  children: React.ReactNode;
  setTableData: React.Dispatch<React.SetStateAction<AttendanceDetailType[]>>;
  index: number;
}) {
  const [indexData, setIndexData] = useState<any | null>(null);

  const updateManufacture = (value: boolean) => {
    console.log("updateManufacture");
    setTableData((prev) => {
      const newData = [...prev];
      newData[index].isManufacture = value ? "true" : "false";
      if (!value) {
        newData[index].isSalaryByProduct = "false";
      }
      return newData;
    });
  };

  const updateSalaryByProduct = (value: boolean) => {
    console.log("updateSalaryByProduct");
    setTableData((prev) => {
      const newData = [...prev];
      newData[index].isSalaryByProduct = value ? "true" : "false";
      return newData;
    });
  };

  useEffect(() => {
    setIndexData(document.querySelector(`td[data-index="${index}"]`));
  }, [index]);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger className="cursor-pointer" asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {indexData?.getAttribute("data-ismanufacture") === "true" ? (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className="hover:bg-slate-100 pl-8 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    id="updateProduct"
                  >
                    Cập nhật sản phẩm tạo ra
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value="Pedro Duarte"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value="@peduarte"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <ContextMenuSeparator />
              <div
                className="hover:bg-slate-100 pl-8 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                id="updateProduct"
                onClick={() => {
                  const isSalaryByProduct = indexData?.getAttribute(
                    "data-issalarybyproduct"
                  );
                  updateSalaryByProduct(
                    isSalaryByProduct === "true" ? false : true
                  );
                }}
              >
                Thay đổi phương thức tính lương
              </div>
              <ContextMenuSeparator />
            </>
          ) : (
            <></>
          )}

          <div
            className="hover:bg-slate-100 pl-8 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            id="updateProduct"
            onClick={() => {
              const isManufacture =
                indexData?.getAttribute("data-ismanufacture");
              updateManufacture(isManufacture === "true" ? false : true);
            }}
          >
            Cập nhập có tạo sản phẩm ?
          </div>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
