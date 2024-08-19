"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Gender, Role, isActive } from "./data/data";
import { Eye, Mail, MapPin, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { IdCardIcon } from "@radix-ui/react-icons";
import { formatCurrency, formatDate, formatDateShort } from "@/lib/utils";
import { format, parse } from "date-fns";

export type Roles = {
  id: string;
  title: string;
  description: string;
};

type salaryHistoryResponse = {
  salaryByDayResponses: {
    salary: number,
    startDate: string,
  }
  salaryByOverTimeResponses: {
    salary: number,
    startDate: string,
  }
}

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  roleId: number;
  isActive: boolean;
  companyId: string;
  avatar: string;
  companyName: string;
  salaryHistoryResponse: salaryHistoryResponse;
};

export const columns: ColumnDef<Employee>[] = [

  {
    accessorKey: "id",
    header: ({ column }) => <Button variant="ghost">CMND/CCCD</Button>,
    cell: ({ row }) => (
      <div>{row.getValue("id")}</div>
    ),
  },

  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return <Button variant="ghost">Tên nhân viên</Button>;
    },
    cell: ({ row }) => <div className="">{row.original.firstName}</div>,
  },

  {
    accessorKey: "gender",
    header: ({ column }) => <div>Giới tính</div>,
    cell: ({ row }) => {
      const gender = Gender.find(
        (gender) => gender.value === row.getValue("gender")
      );

      if (!gender) {
        return null;
      }

      return <span>{gender.label}</span>;
    },
  },

  {
    accessorKey: "phone",
    header: ({ column }) => {
      return <Button variant="ghost">Số điện thoại</Button>;
    },
  },

  {
    accessorKey: "roleId",
    header: ({ column }) => <Button variant="ghost">Vai trò</Button>,
    cell: ({ row }) => {
      const role = Role.find((role) => role.value === row.getValue("roleId"));

      if (!role) {
        return null;
      }

      return <span>{role.label}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hoạt động
        </Button>
      );
    },
    cell: ({ row }) => {
      const active = isActive.find(
        (isactive) => isactive.value === row.getValue("isActive")
      );

      if (!active) {
        return null;
      }

      return (
        <span
          className={`p-2 ${active.value ? "text-primary" : "text-red-500"}`}
        >
          {active.label}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const formatDateData = (dateString: any) => {
        const formattedDate =
          typeof dateString === "string"
            ? dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
            : dateString;

        const parsedDate = parse(formattedDate, "yyyy-MM-dd", new Date());
        return format(parsedDate, "dd/MM/yyyy");
      };

      return (
        <>
          <Dialog>
            <DialogTrigger><Eye /></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thông tin chi tiết nhân viên</DialogTitle>
                <DialogDescription>
                  <Card className="bg-white shadow-md rounded-lg overflow-hidden transition-all ease-in-out duration-300 hover:shadow-xl m-2 dark:bg-black">
                    <span className="flex justify-end m-2">
                      {Role.find(role => role.value === row.original.roleId)?.label || 'Không có'}
                    </span>
                    <CardContent className="flex flex-row items-center gap-4 p-6">
                      <Avatar>
                        <AvatarImage src={row.original.avatar} className="w-24 h-24 object-cover" alt="Channel Logo" />
                        <AvatarFallback>YT</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-primary">{row.original.lastName}{row.original.firstName}</h2>
                        <div className="flex gap-2 items-center">
                          <Badge variant="secondary" className="text-xs">
                            {formatDateShort(row.original.dob)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {row.original.gender === "Male" ? "Nam" : "Nữ"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>

                    <div className="flex">
                      <CardContent>
                        <h2 className="font-semibold text-[15px] text-primary">Thông tin cá nhân</h2>
                        <div className="flex items-center gap-3 p-2">
                          <Phone className="w-5 h-5" />
                          <span>{row.original.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 p-2">
                          <IdCardIcon className="w-5 h-5" />
                          <span>{row.original.id}</span>
                        </div>
                        <div className="flex items-center gap-3 p-2">
                          <MapPin className="w-5 h-5" />
                          <span>{row.original.address}</span>
                        </div>
                      </CardContent>
                      <CardContent>
                        <h2 className="font-semibold text-[15px] text-primary">Cở sở làm việc</h2>
                        <div className="flex items-center gap-3 p-2">
                          <span>{row.original.companyName}</span>
                        </div>
                      </CardContent>
                    </div>
                    <CardContent>
                      <h2 className="font-semibold text-[15px] text-primary ">Thông tin lương</h2>
                      <div className="flex flex-col gap-2 p-2">
                        <div>
                          <div className="font-bold text-[0.8rem]">
                            Lương công nhật
                          </div>
                          <span className="text-sm "><span>Ngày bắt đầu</span>: <span>{formatDateShort(row.original.salaryHistoryResponse.salaryByDayResponses?.startDate)}</span></span>
                          <div>
                            {formatCurrency(row.original.salaryHistoryResponse.salaryByDayResponses?.salary)}
                            <span className="text-gray-400"> VND/Ngày</span>
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-[0.8rem]">
                            Lương tăng ca
                          </div>
                          <span className="text-sm "><span>Ngày bắt đầu</span>: {formatDateShort(row.original.salaryHistoryResponse.salaryByOverTimeResponses?.startDate)}</span>
                          <div>
                            {formatCurrency(row.original.salaryHistoryResponse.salaryByOverTimeResponses?.salary)}
                            <span className="text-gray-400"> VND/giờ</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </>
      )
    }
    ,
  },
];
