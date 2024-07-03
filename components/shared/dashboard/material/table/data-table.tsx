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
import "./material.css";
import { filesApi } from "@/apis/files.api";
import { Item } from "@radix-ui/react-dropdown-menu";

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

    const searchMaterial = async (searchTerm: string) => {
      console.log("searchTerm", searchTerm);
      try {
        const data = await materialApi.searchMaterial({
          SearchTerm: searchTerm,
          IsInProcessing: true,
          pageIndex: pageIndex,
          pageSize: 10,
        });

        data.data.data.data.forEach((item) => {
          if (item.image === "") {
            item.image = " ";
          }
        });
        const tableData = data.data.data.data;
        console.log("Table Data", tableData);
        // const imagePromises = tableData.map(async (item) => {

        //   const res = await filesApi.getFile(item.image as string);
        //   item.image = res.data.data;
        //   // console.log("Image" + item.name, item.image);
        // });

        // await Promise.all(imagePromises);

        setData(tableData as TData[]);
        setTotalPages(data.data.data.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        router.push(
          `${pathname}?searchTerm=${searchTerm || ""}&pageIndex=${pageIndex}`
        );
      }
    };

    searchMaterial(searchTerm);
  }, [searchTerm, pathname, router, pageIndex, force]);

  return (
    <div className="p-2">
      <div className="text-3xl text-[#22c55e] w-full text-center mb-3 font-semibold mt-5">
        DANH SÁCH VẬT LIỆU
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center py-4">
        <Input
          placeholder="Tìm theo tên vật liệu..."
          value={searchTerm}
          onChange={(event) => {
            setPageIndex(1);
            setSearchTerm(event.target.value);
          }}
          className="max-w-sm shadow-sm"
        />
        <MyContext.Provider value={{ forceUpdate }}>
          <AddNewMeterial />
        </MyContext.Provider>
      </div>
      <div className="rounded-md border">
        <MyContext.Provider value={{ forceUpdate }}>
          <Table className="material-table">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className={`${header.id}`}>
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
                table.getRowModel().rows.map((row) => {
                  // console.log("row", row);
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className={row.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
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
        <div className="grid grid-cols-2 w-[300px] justify-end space-x-2 py-4 ml-auto mr-5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Number(prev) - 1)}
            disabled={Number(pageIndex) === 1}
            className=""
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Number(prev) + 1)}
            disabled={pageIndex >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
