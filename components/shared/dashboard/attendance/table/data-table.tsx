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
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import AddNewMeterialHistory from "@/components/shared/dashboard/material-history/add-new-material-history/add-new-material-history";
import DatePicker from "@/components/shared/common/datapicker/date-picker";
import FillterByDate from "@/components/shared/dashboard/material-history/table/filter-by-date";
import AddNewAttendanceSLot from "@/components/shared/dashboard/attendance/add-new-slot/add-new-slot";
import { attendanceApi } from "@/apis/attendance.api";
import { AttendanceOverallProps } from "@/types/attendance.type";
import { useAttendanceStore } from "@/components/shared/dashboard/attendance/attendance-store";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  searchParams: AttendanceOverallProps;
}

export function DataTableForAttendance<TData, TValue>({
  columns,
  searchParams,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = React.useState<TData[]>([]);
  const { listUser, setListUser } = useAttendanceStore();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  useEffect(() => {
    attendanceApi
      .searchAttendance({
        PageIndex: searchParams.PageIndex,
        StartDate:
          searchParams.StartDate === "" ? "01/01/0001" : searchParams.StartDate,
        EndDate:
          searchParams.EndDate === "" ? "30/12/3000" : searchParams.EndDate,
        PageSize: searchParams.PageSize,
      })
      .then(({ data }) => {
        setData(data.data.data as TData[]);
        console.log("Attendance Data: ", data.data.data);
      });
  }, [searchParams]);

  useEffect(() => {
    attendanceApi
      .getUers({
        SearchTerm: "",
        IsActive: "true",
        PageIndex: "1",
        PageSize: "200",
        RoleId: "2",
      })
      .then(({ data }) => {
        setListUser(data.data.data);
      });
  }, [setListUser]);

  return (
    <div>
      <div className="my-2 grid grid-cols-2">
        <div className="mr-auto h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-max">
          <select id="slot">
            <option value={1}>Cơ sở 1</option>
            <option value={2}>Cơ sở 2</option>
          </select>
        </div>
        <AddNewAttendanceSLot />
      </div>

      <div className="rounded-md border">
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
                  className="hover:bg-white"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="hover:bg-gray-100 " key={cell.id}>
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
