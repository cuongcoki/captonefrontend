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
import AddNewMeterial from "@/components/shared/dashboard/material/add-new-material/add-new-material";
import { materialApi } from "@/apis/material.api";
import { usePathname, useRouter } from "next/navigation";
import { useMaterialStore } from "@/components/shared/dashboard/material/material-store";
import { error } from "console";

type ContexType = {
  forceUpdate: () => void;
};
export const MyContext = React.createContext<ContexType>({
  forceUpdate: () => {},
});
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  searchTermProp: string;
  pageIndexProp: number;
}

export function DataTableForMaterial<TData, TValue>({
  columns,
  searchTermProp,
  pageIndexProp,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState<number>(
    (pageIndexProp as number) || 1
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [data, setData] = React.useState<TData[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>(
    searchTermProp || ""
  );
  const [force, setForce] = React.useState<number>(1);
  const forceUpdate = () => setForce((prev) => prev + 1);

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
    console.log("Call API");

    const searchMaterial = (searchTerm: string) => {
      console.log("searchTerm", searchTerm);
      materialApi
        .searchMaterial({
          SearchTerm: searchTerm,
          pageIndex: pageIndex,
          pageSize: 10,
        })
        .then((data) => {
          console.log("DATA Call API", data);
          setData(data.data.data.data as TData[]);
          setTotalPages(data.data.data.totalPages);
        })
        .catch((error) => console.log(error))
        .finally(() => {
          router.push(
            `${pathname}?searchTerm=${searchTerm || ""}&pageIndex=${pageIndex}`
          );
        });
    };

    searchMaterial(searchTerm);
  }, [searchTerm, pathname, router, pageIndex, force]);

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter name..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm shadow-sm"
        />
        <MyContext.Provider value={{ forceUpdate }}>
          <AddNewMeterial />
        </MyContext.Provider>
      </div>
      <div className="rounded-md border">
        <MyContext.Provider value={{ forceUpdate }}>
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
        </MyContext.Provider>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Number(prev) - 1)}
            disabled={Number(pageIndex) === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Number(prev) + 1)}
            // disabled={pageIndex < totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
