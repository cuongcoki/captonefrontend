import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { salaryApi } from "@/apis/salary.api";
import { SalaryHistoryType } from "@/types/salary.type";
import toast from "react-hot-toast";
import { salaryStore } from "@/components/shared/dashboard/salary/salary-store";
import { format } from "date-fns";
import TitleComponent from "@/components/shared/common/Title";
export default function SalaryHistoryReceived({ id }: { id: string }) {
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistoryType[]>([]);
  const { force, forceRender, setSalaryAvailiable, salaryAvailiable } =
    salaryStore();
  const [index, setIndex] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [salaryHistoryDelete, setSalaryHistoryDelete] =
    useState<SalaryHistoryType>({
      id: "",
      salary: 0,
      createdAt: "",
      note: "",
      userId: "",
    });
  useEffect(() => {
    salaryApi
      .getPaidSalaries({
        UserId: id,
        PageIndex: index,
        PageSize: 4,
      })
      .then((res) => {
        setSalaryHistory(res.data.data.data);
        setTotalPage(res.data.data.totalPages);
        console.log("Lich Su nhan luong", res.data.data.data);
      })
      .catch((e) => {
        console.log({ e });
      });
  }, [id, force, index]);

  const formatCurrency = (value: any): string => {
    if (!value) return "";
    let valueString = value.toString();

    // Remove all non-numeric characters, including dots
    valueString = valueString.replace(/\D/g, "");

    // Remove leading zeros
    valueString = valueString.replace(/^0+/, "");

    if (valueString === "") return "0";

    // Reverse the string to handle grouping from the end
    let reversed = valueString.split("").reverse().join("");

    // Add dots every 3 characters
    let formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";

    // Reverse back to original order
    let formatted = formattedReversed.split("").reverse().join("");

    return formatted;
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await salaryApi.deletePaidSalary(salaryHistoryDelete.id);
      setSalaryAvailiable(salaryAvailiable + salaryHistoryDelete.salary);
      forceRender();
      toast.success("Xoá lịch sử nhận lương thành công");
    } catch (error) {
      toast.error("Xoá lịch sử nhận lương thất bại");
    }
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <TitleComponent
            title="Lịch sử nhận lương"
            description="Lịch sử nhận lương gần nhất của nhân viên."
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Lương nhận</TableHead>
                <TableHead> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaryHistory.length > 0 ? (
                salaryHistory.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {format(item.createdAt, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{formatCurrency(item.salary)}</TableCell>
                      <TableCell>
                        <Trash2
                          className="hover:cursor-pointer"
                          onClick={() => {
                            setIsOpen(true);
                            setSalaryHistoryDelete(item);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell className="text-center" colSpan={3}>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có chắc chắn muốn xoá lịch sử nhận lương này?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Dữ liệu này sẽ không thay
                  đổi được
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async (e) => {
                    e.preventDefault();
                    await handleDelete();
                  }}
                  disabled={isLoading}
                >
                  Đồng ý
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
        <CardFooter className="flex flex-row items-center px-6">
          <Pagination className="ml-auto mr-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className={`h-6 w-6 ${
                    index === 1 ? "" : "bg-primary text-primary-foreground"
                  }`}
                  disabled={index === 1}
                  onClick={() => setIndex(index - 1)}
                >
                  <ChevronLeft className="size-5" />
                  <span className="sr-only">Previous Order</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className={`h-6 w-6 ${
                    index >= totalPage
                      ? ""
                      : "bg-primary text-primary-foreground"
                  }`}
                  disabled={index >= totalPage}
                  onClick={() => setIndex(index + 1)}
                >
                  <ChevronRight className="size-5" />
                  <span className="sr-only">Next Order</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </>
  );
}
