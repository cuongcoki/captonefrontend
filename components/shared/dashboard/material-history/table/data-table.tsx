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
import FillterByDate from "@/components/shared/dashboard/material-history/table/filter-by-date";
import { usePathname, useRouter } from "next/navigation";
import { materialHistoryProp } from "@/types/material-history.type";
import { materiaHistoryApi } from "@/apis/material-history.api";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  searchParamsProp: materialHistoryProp;
}

export function DataTableForMaterialHistory<TData, TValue>({
  columns,
  searchParamsProp,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = React.useState<TData[]>([]);
  const [searchParams, setSearchParams] =
    React.useState<materialHistoryProp>(searchParamsProp);
  const pathname = usePathname();
  const router = useRouter();

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
    materiaHistoryApi
      .searchMaterial({
        SearchTerms: searchParams.searchTerm,
        PageIndex: searchParams.pageIndex,
        PageSize: 10,
        DateImport: "",
      })
      .then((res) => {
        console.log("MATERIAL_HISTORY_DATA", res.data.data.data);
        setData(res.data.data.data as TData[]);
        router.push(`${pathname}?searchTerm=${searchParams.searchTerm}`);
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  }, [searchParams, router, pathname]);

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter name..."
          className="max-w-sm shadow-sm"
          value={searchParams.searchTerm}
          onChange={(event) => {
            setSearchParams({
              ...searchParams,
              searchTerm: event.target.value,
            });
          }}
        />
        <div className="ml-14">
          <FillterByDate />
        </div>
        <AddNewMeterialHistory />
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
