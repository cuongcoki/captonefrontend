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
import { usePathname, useRouter } from "next/navigation";
import { materialHistoryProp } from "@/types/material-history.type";
import { materiaHistoryApi } from "@/apis/material-history.api";
import DatePicker from "@/components/shared/common/datapicker/date-picker";
import { format } from "date-fns";
import { useMaterialHistoryStore } from "@/components/shared/dashboard/material-history/table/material-history-store";
import { materialApi } from "@/apis/material.api";
import { ComboboxDataType } from "@/components/shared/common/combobox/combobox-for-form";
import "./material-history.css";

type MaterialHistoryContextType = {
  ForceRender: () => void;
};

export const MaterialHistoryContext =
  React.createContext<MaterialHistoryContextType>({
    ForceRender: () => {},
  });
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
  const [totalPage, setTotalPage] = React.useState<number>(0);
  const [force, setForce] = React.useState<number>(1);
  const ForceRender = () => {
    setForce(force + 1);
  };
  const pathname = usePathname();
  const router = useRouter();

  const { setListMaterial } = useMaterialHistoryStore();

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

  // Convert date format from dd/MM/yyyy to yyyy-MM-dd
  function convertDateFormat(inputDate: string) {
    let parts = inputDate.split("/");
    let formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
    return formattedDate;
  }
  useEffect(() => {
    materialApi
      .searchMaterial({
        SearchTerm: "",
        pageIndex: 1,
        pageSize: 1000,
      })
      .then(({ data }) => {
        const listMaterial: ComboboxDataType[] = data.data.data.map(
          (item: any) => {
            return {
              value: String(item.id),
              label: item.name,
            };
          }
        );
        setListMaterial(listMaterial);
      });
    setListMaterial;
  }, [setListMaterial]);

  const validateDate = () => {
    if (searchParams.from && searchParams.to) {
      if (
        new Date(convertDateFormat(searchParams.from)) >
        new Date(convertDateFormat(searchParams.to))
      ) {
        alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    materiaHistoryApi
      .searchMaterialHistory({
        SearchTerms: searchParams.searchTerm || "",
        PageIndex: searchParams.pageIndex || 1,
        PageSize: 10,
        StartDateImport: searchParams.from || "",
        EndDateImport: searchParams.to || "",
      })
      .then((res) => {
        console.log("MATERIAL_HISTORY_DATA", res.data.data);

        setTotalPage(res.data.data.totalPages);

        setData(res.data.data.data as TData[]);
        router.push(
          `${pathname}?searchTerm=${searchParams.searchTerm || ""}&from=${
            searchParams.from || ""
          }&to=${searchParams.to || ""}&pageIndex=${searchParams.pageIndex}`
        );
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setData([]);
        }
        console.log("ERROR", err);
      });
  }, [searchParams, router, pathname, force]);

  return (
    <div>
      <div className="py-4 grid grid-row-3 md:grid-cols-2 xl:grid-cols-3">
        <Input
          placeholder="Filter name..."
          className="max-w-sm shadow-sm"
          value={searchParams.searchTerm}
          onChange={(event) => {
            setSearchParams({
              ...searchParams,
              searchTerm: event.target.value,
              pageIndex: 1,
            });
          }}
        />
        <div className="mt-4 md:ml-10 md:mt-0">
          <div className="grid grid-cols-2 gap-x-6">
            <DatePicker
              selected={new Date(convertDateFormat(searchParams.from || ""))}
              name="from"
              title={searchParams.from || "Từ ngày"}
              className="w-full"
              value={"2024-06-16"}
              onDayClick={(event: any) => {
                if (event > new Date(convertDateFormat(searchParams.to))) {
                  alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
                  return;
                }
                if (format(event, "dd/MM/yyyy") === searchParams.from) {
                  setSearchParams((prev) => {
                    return {
                      ...prev,
                      from: "",
                    };
                  });
                  return;
                }

                setSearchParams((prev) => {
                  return { ...prev, from: format(event, "dd/MM/yyyy") };
                });
                console.log(format(event, "dd/MM/yyyy"));
              }}
            />
            <DatePicker
              selected={new Date(convertDateFormat(searchParams.to || ""))}
              name="to"
              title={searchParams.to || "Đến ngày"}
              className="w-full"
              onDayClick={(event: any) => {
                if (new Date(convertDateFormat(searchParams.from)) > event) {
                  alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
                  return;
                }
                if (format(event, "dd/MM/yyyy") === searchParams.to) {
                  setSearchParams((prev) => {
                    return {
                      ...prev,
                      to: "",
                    };
                  });
                  return;
                }
                setSearchParams((prev) => {
                  return { ...prev, to: format(event, "dd/MM/yyyy") };
                });
                console.log(format(event, "dd/MM/yyyy"));
              }}
            />
          </div>
        </div>
        <MaterialHistoryContext.Provider value={{ ForceRender }}>
          <AddNewMeterialHistory />
        </MaterialHistoryContext.Provider>
      </div>

      <div className="rounded-md border">
        <MaterialHistoryContext.Provider value={{ ForceRender }}>
          <Table className="material-history-table">
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
        </MaterialHistoryContext.Provider>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchParams((prev) => {
                return { ...prev, pageIndex: Number(prev.pageIndex) - 1 };
              });
            }}
            disabled={Number(searchParams.pageIndex) === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchParams((prev) => {
                return { ...prev, pageIndex: Number(prev.pageIndex) + 1 };
              });
            }}
            disabled={Number(searchParams.pageIndex) >= totalPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
