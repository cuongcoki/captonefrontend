"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAttendanceStore } from "@/components/shared/dashboard/attendance/attendance-store";
import { CreateAttendanceSlotBody } from "@/types/attendance.type";
import { AttendanceContext } from "@/components/shared/dashboard/attendance/table/data-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  date: string;
  slot: string;
}

export function AddEmployeeToAttendance<TData, TValue>({
  columns,
  date,
  slot,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = React.useState<TData[]>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // useEffect(() => {
  //   attendanceApi
  //     .getAttendance({
  //       Date: date,
  //       SlotId: slot,
  //       PageIndex: "1",
  //       PageSize: "100",
  //       SearchTerm: "",
  //     })
  //     .then(({ data }) => {
  //       console.log("data", data.data.data);
  //       const dataAttend = data.data.data;
  //       const setDataAttendance: Set<string> = new Set();
  //       dataAttend.forEach((item) => {
  //         setDataAttendance.add(item.userId);
  //       });
  //       const userLeftOver = listUser.filter((user) => {
  //         return !setDataAttendance.has(user.id);
  //       });
  //       // console.log("userLeftOver", userLeftOver);
  //       setData(userLeftOver as TData[]);
  //     });
  // }, [date, slot, listUser]);

  useEffect(() => {}, []);

  const createSlot = () => {
    const tableData = table
      .getRowModel()
      .rows.filter((row: any) => row.original.select == true)
      .map((row: any) => ({
        userId: row.original.id,
        isManufacture: row.original.isManufactureSelected || false,
        isSalaryByProduct: row.original.isSalaryByProductSelected || false,
      }));
    const createAttendanceSlotBody: CreateAttendanceSlotBody = {
      slotId: slot,
      createAttendances: tableData,
    };

    console.log("createAttendanceSlotBody", createAttendanceSlotBody);

    // attendanceApi
    //   .createAttendance(createAttendanceSlotBody)
    //   .then(({ data }) => {
    //     console.log(data);
    //     ForceRender();
    //     toast.success("data.message");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     toast.error("error.message");
    //   });
  };

  return (
    <>
      <div className="w-full flex items-center space-x-5">
        <div className="font-semibold text-xl">Tạo thêm nhân viên</div>
        <div>
          {date} - Slot {slot}
        </div>
      </div>
      <div className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 py-4">
        <Input
          placeholder="Filter name..."
          value={
            (table.getColumn("userName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("userName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm shadow-ssm"
        />

        <Button className="ml-auto mt-2 sm:mt-0" onClick={createSlot}>
          Thêm nhân viên
        </Button>
      </div>
      <div className="rounded-md border w-full overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4"></div>
      </div>
    </>
  );
}
