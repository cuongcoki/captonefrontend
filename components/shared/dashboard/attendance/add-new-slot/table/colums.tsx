"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types/attendance.type";
import { ColumnDef, Table } from "@tanstack/react-table";
import React from "react";

export const columnsForAttendanceForm: ColumnDef<User>[] = [
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
      <div className="flex justify-center items-center ">
        <div className="w-[60px] h-[80px] bg-gray-400"></div>
      </div>
    ),
  },
  {
    accessorKey: "userName",
    header: () => <div className="text-center">Tên nhân viên </div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.original.firstName + " " + row.original.lastName}
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
        dependentOnSecondary="isManufactureSelected" // Thêm phụ thuộc thứ hai
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

interface ColumnCheckboxHeaderProps {
  table: Table<User>;
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
        if (
          columnId === "isSalaryByProductSelected" &&
          row.original.isManufactureSelected
        ) {
          row.original[columnId] = true;
        } else if (columnId === "isManufactureSelected") {
          row.original[columnId] = true;
        }
      } else if (columnId === "select") {
        row.original["select"] = true;
      }
    });

    table.setRowSelection({});
  };

  const handleDeselectAll = () => {
    table.getRowModel().rows.forEach((row: any) => {
      if (columnId === "select") {
        row.original["select"] = false;
        row.original["isManufactureSelected"] = false;
        row.original["isSalaryByProductSelected"] = false;
      } else if (columnId === "isManufactureSelected") {
        row.original["isManufactureSelected"] = false;
        row.original["isSalaryByProductSelected"] = false;
      } else {
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
  dependentOnSecondary?: string; // Thêm phụ thuộc thứ hai
}

const CheckboxCell: React.FC<CheckboxCellProps> = ({
  row,
  columnId,
  dependentOn,
  dependentOnSecondary,
}) => {
  const handleChange = (value: boolean) => {
    // Kiểm tra phụ thuộc đầu tiên
    if (dependentOn && !row.original[dependentOn]) return;

    // Kiểm tra phụ thuộc thứ hai
    if (dependentOnSecondary && !row.original[dependentOnSecondary]) return;

    row.original[columnId] = value;

    if (columnId === "select" && !value) {
      row.original["isManufactureSelected"] = false;
      row.original["isSalaryByProductSelected"] = false;
    }

    if (columnId === "isManufactureSelected" && !value) {
      row.original["isSalaryByProductSelected"] = false;
    }

    row.toggleSelected(false);
  };

  return (
    <div className="flex justify-center items-center">
      <Checkbox
        checked={row.original[columnId]}
        onCheckedChange={(value) => handleChange(!!value)}
        disabled={
          dependentOn
            ? !row.original[dependentOn]
            : false || dependentOnSecondary
            ? !row.original[dependentOnSecondary]
            : false
        }
        aria-label={`Select row for ${columnId}`}
        className="size-[30px]"
      />
    </div>
  );
};
