"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { AttendanceFormEmployeeType } from "@/schema/attendance";
import { ColumnDef, Table } from "@tanstack/react-table";
import Image from "next/image";
import React from "react";

export const columnsForAttendanceForm: ColumnDef<AttendanceFormEmployeeType>[] =
  [
    {
      accessorKey: "select",
      header: ({ table }) => (
        <ColumnCheckboxHeader
          table={table}
          columnId="select"
          label="Chọn nhân viên"
        />
      ),
      cell: ({ row }) => <CheckboxCell row={row} columnId="select" />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "image",
      header: () => <div className="text-center">Ảnh</div>,
      cell: ({ row }) => (
        <div className="flex justify-center items-center w-[60px] h-[80px] bg-gray-400">
          <Image src={row.original.image} width={60} height={80} alt="Ảnh" />
        </div>
      ),
    },
    {
      accessorKey: "userName",
      header: "Tên nhân viên",
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          {row.original.userName}
        </div>
      ),
    },
    {
      accessorKey: "isManufactureSelected",
      header: ({ table }) => (
        <ColumnCheckboxHeader
          table={table}
          columnId="isManufactureSelected"
          label="Có tạo sản phẩm"
        />
      ),
      cell: ({ row }) => (
        <CheckboxCell
          row={row}
          columnId="isManufactureSelected"
          dependentOn="select"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "isSalaryByProductSelected",
      header: ({ table }) => (
        <ColumnCheckboxHeader
          table={table}
          columnId="isSalaryByProductSelected"
          label="Lương theo sản phẩm"
        />
      ),
      cell: ({ row }) => (
        <CheckboxCell
          row={row}
          columnId="isSalaryByProductSelected"
          dependentOn="select"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

interface ColumnCheckboxHeaderProps {
  table: Table<AttendanceFormEmployeeType>;
  columnId: string;
  label: string;
}

const ColumnCheckboxHeader: React.FC<ColumnCheckboxHeaderProps> = ({
  table,
  columnId,
  label,
}) => {
  const handleSelectAll = () => {
    const rows = table.getRowModel().rows;

    rows.forEach((row: any) => {
      if (columnId !== "select" && row.original.select) {
        row.original[columnId] = true;
      } else if (columnId === "select") {
        row.original["select"] = true;
      }
    });

    // const selectionObject = rows.reduce(
    //   (acc: Record<string, boolean>, row: any) => {
    //     if (row.original.select) {
    //       acc[row.id] = true;
    //     }
    //     return acc;
    //   },
    //   {}
    // );

    // table.setRowSelection(selectionObject);
    table.setRowSelection({});
  };

  const handleDeselectAll = () => {
    table.getRowModel().rows.forEach((row: any) => {
      if (columnId !== "select") {
        row.original[columnId] = false;
      } else {
        row.original["select"] = false;
        row.original["isManufactureSelected"] = false;
        row.original["isSalaryByProductSelected"] = false;
      }
    });

    table.setRowSelection({});
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2">{label}</div>
      <div className="text-sm font-extralight">
        <div className="flex space-x-2 mb-2">
          <div className="cursor-pointer underline" onClick={handleSelectAll}>
            (Chọn tất
          </div>
          <div>/</div>
          <div className="cursor-pointer underline" onClick={handleDeselectAll}>
            Bỏ chọn)
          </div>
        </div>
      </div>
    </div>
  );
};

interface CheckboxCellProps {
  row: any;
  columnId: string;
  dependentOn?: string;
}

const CheckboxCell: React.FC<CheckboxCellProps> = ({
  row,
  columnId,
  dependentOn,
}) => {
  const handleChange = (value: boolean) => {
    if (dependentOn && !row.original[dependentOn]) return;

    row.original[columnId] = value;

    if (columnId === "select" && !value) {
      row.original["isManufactureSelected"] = false;
      row.original["isSalaryByProductSelected"] = false;
    }

    row.toggleSelected(false);
  };

  return (
    <div className="flex justify-center items-center">
      <Checkbox
        checked={row.original[columnId]}
        onCheckedChange={(value) => handleChange(!!value)}
        disabled={dependentOn ? !row.original[dependentOn] : false}
        aria-label={`Select row for ${columnId}`}
        className="size-[30px]"
      />
    </div>
  );
};
