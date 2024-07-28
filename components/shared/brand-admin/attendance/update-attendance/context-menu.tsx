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

import CountProduct from "@/components/shared/dashboard/attendance/update-attendance/count-product";
import { useUpdateAttendanceStore } from "@/components/shared/dashboard/attendance/update-attendance/update-attendance-store";
var indexData: any | null = null;

export function ContextMenuForAttendance({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const [indexData, setIndexData] = useState<any | null>(null);
  const { tableData, updateManufacture, updateSalaryByProduct } =
    useUpdateAttendanceStore();

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
          {/* <CountProduct index={index} /> */}
          {/* <ContextMenuSeparator />
              <div
                className="hover:bg-slate-100 pl-8 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                id="updateProduct"
                onClick={() => {
                  const isSalaryByProduct = indexData?.getAttribute(
                    "data-issalarybyproduct"
                  );
                  updateSalaryByProduct(
                    index,
                    isSalaryByProduct === "true" ? false : true
                  );
                }}
              >
                Thay đổi phương thức tính lương
              </div>
              <ContextMenuSeparator /> */}

          {/* <div
            className="hover:bg-slate-100 pl-8 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            id="updateProduct"
            onClick={() => {
              const isManufacture =
                indexData?.getAttribute("data-ismanufacture");
              updateManufacture(index, isManufacture === "true" ? false : true);
            }}
          >
            Cập nhập có tạo sản phẩm ?
          </div> */}
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
