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
import "./style.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { createContext, useEffect } from "react";
import AddNewAttendanceSLot from "@/components/shared/dashboard/attendance/add-new-slot/add-new-slot";
import { attendanceApi } from "@/apis/attendance.api";
import { AttendanceOverallProps } from "@/types/attendance.type";
import { useAttendanceStore } from "@/components/shared/dashboard/attendance/attendance-store";
import { usePathname, useRouter } from "next/navigation";
import { set } from "date-fns";

type ContextType = {
  ForceRender: () => void;
};

export const AttendanceContext = createContext<ContextType>({
  ForceRender: () => {},
});

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
  const { setListUser } = useAttendanceStore();
  const [force, setForce] = React.useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [serachData, setSearchData] =
    React.useState<AttendanceOverallProps>(searchParams);
  const ForceRender = () => {
    setForce(force + 1);
  };

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
        PageIndex: serachData.PageIndex,
        StartDate:
          serachData.StartDate === "" ? "01/01/0001" : serachData.StartDate,
        EndDate: serachData.EndDate === "" ? "30/12/3000" : serachData.EndDate,
        PageSize: serachData.PageSize,
      })
      .then(({ data }) => {
        setData(data.data.data as TData[]);
        setTotalPages(data.data.totalPages);
        console.log("Attendance Data: ", data.data.data);
      })
      .catch((error) => {
        console.log("Error: ", error);
      })
      .finally(() => {
        router.push(`${pathname}?PageIndex=${serachData.PageIndex}`);
      });
  }, [serachData, force, router, pathname]);

  useEffect(() => {
    attendanceApi
      .getUsers({
        SearchTerm: "",
        IsActive: "true",
        PageIndex: "1",
        PageSize: "200",
        RoleId: "1",
      })
      .then(({ data }) => {
        setListUser(data.data.data);
      })
      .catch((error) => {
        console.log("Error: ", error);
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
        <AttendanceContext.Provider value={{ ForceRender }}>
          <AddNewAttendanceSLot />
        </AttendanceContext.Provider>
      </div>

      <div className="rounded-md attendance-table-overall">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="border border-gray-200"
                      key={header.id}
                    >
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
                    <TableCell
                      className="hover:bg-gray-100 border border-gray-200"
                      key={cell.id}
                    >
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
            onClick={() => {
              setSearchData((prev) => ({
                ...prev,
                PageIndex: (parseInt(prev.PageIndex) - 1).toString(),
              }));
            }}
            disabled={Number(serachData.PageIndex) === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchData((prev) => ({
                ...prev,
                PageIndex: (parseInt(prev.PageIndex) + 1).toString(),
              }));
            }}
            disabled={Number(serachData.PageIndex) >= Number(totalPages)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
