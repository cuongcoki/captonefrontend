"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAttendanceStore } from "@/components/shared/dashboard/attendance/attendance-store";
import { CreateAttendanceSlotBody } from "@/types/attendance.type";
import { AttendanceContext } from "@/components/shared/dashboard/attendance/table/data-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTableForAttendanceForm<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = React.useState<TData[]>(
    useAttendanceStore().listUser as TData[]
  );
  const [selectedValue, setSelectedValue] = useState("1");
  const { ForceRender } = useContext(AttendanceContext);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

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
      slotId: selectedValue,
      createAttendances: tableData,
    };

    console.log("createAttendanceSlotBody", createAttendanceSlotBody);

    // attendanceApi
    //   .createAttendance(createAttendanceSlotBody)
    //   .then(({ data }) => {
    //     console.log(data);
    //     ForceRender();
    //     toast.success(data.message);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     toast.error(error.message);
    //   });
  };

  return (
    <>
      <div className="w-full grid grid-rows-2 py-4">
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
        <div className="flex items-center mt-4">
          <div className=" h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ">
            <select
              id="slot"
              value={selectedValue}
              onChange={(event: any) => {
                setSelectedValue(event.target.value);
              }}
            >
              <option value={1}>Slot Sáng</option>
              <option value={2}>Slot Chiều</option>
              <option value={3}>Tăng ca</option>
            </select>
          </div>

          <Button
            className="ml-auto"
            onClick={createSlot}
            onChange={(event: any) => {
              setSelectedValue(event.target.value);
            }}
          >
            Tạo báo cáo
          </Button>
        </div>
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
