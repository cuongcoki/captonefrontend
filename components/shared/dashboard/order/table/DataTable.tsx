import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
interface OrderData {
  id: string;
  status: string;
  // Các thuộc tính khác của dữ liệu nếu có
}

export function DataTable<TData extends OrderData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });
  const router = useRouter();
  const handleGotoDetail = (id: string) => {
    router.push(`/dashboard/order/${id}`);
    console.log('id',id)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="py-1 text-inherit text-center">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
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
                  <TableCell key={cell.id} className="py-3 text-center cursor-pointer" onClick={() => handleGotoDetail(row.original.id)}>
                    {/* <Link href={`/dashboard/order/${row.original.id}`} > */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    {/* </Link> */}
                  </TableCell>
                ))}

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
