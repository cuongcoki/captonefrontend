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
import React from "react";
import { Input } from "@/components/ui/input";
import AddNewMeterialHistory from "@/components/shared/dashboard/material-history/add-new-material-history/add-new-material-history";
import DatePicker from "@/components/shared/common/datapicker/date-picker";
import FillterByDate from "@/components/shared/dashboard/material-history/table/filter-by-date";
import AddNewAttendanceSLot from "@/components/shared/dashboard/attendance/add-new-slot/add-new-slot";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableForAttendanceForm<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

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

  const createSlot = () => {
    const combobox = document.getElementById("slot") as HTMLSelectElement;
    const slot = combobox.value;
    console.log(
      table.getRowModel().rows.map((row) => ({ ...row.original, slot: slot }))
    );
  };

  return (
    <div>
      <div className="flex items-center py-4">
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
        <div className="ml-5 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ">
          <select id="slot">
            <option value={1}>Slot Sáng</option>
            <option value={2}>Slot Chiều</option>
            <option value={3}>Tăng ca</option>
          </select>
        </div>
        <Button className="ml-auto" onClick={createSlot}>
          Tạo báo cáo
        </Button>
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
    </div>
  );
}
