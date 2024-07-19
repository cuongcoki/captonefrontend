import React, { useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
export default function SalaryHistoryReceived() {
  const [isOpen, setIsOpen] = useState(false);
  const [salary, setSalary] = useState("");
  const error = useRef<any>(null);
  error.current.hidden = true;

  const handlePay = async () => {};
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

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-primary">Trả lương</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Vui lòng nhập lương muốn trả"
            value={formatCurrency(salary)}
            onChange={(e) => {
              if (e.target.value !== "") {
                console.log("Input change");
                error.current.hidden = true;
              }
              setSalary(e.target.value);
            }}
          />
          <div className="text-destructive text-sm mt-1 ml-2 " ref={error}>
            Bạn chưa nhập số tiền muốn trả
          </div>
          <div className="flex mt-4 items-center">
            <div className="text-sm text-muted-foreground">
              Lương còn lại:
              <span className="font-bold text-primary"> 7.000.000</span>
            </div>
            <div className="w-max ml-auto">
              <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    className="bg-primary"
                    onClick={(e) => {
                      if (salary === "") {
                        e.preventDefault();
                        error.current.hidden = false;
                        return;
                      }
                    }}
                  >
                    Trả lương
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Bạn có chắc chắn muốn trả {formatCurrency(salary)} VNĐ cho
                      nhân viên này?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này không thể hoàn tác. Dữ liệu này sẽ không
                      thay đổi được
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async (e) => {
                        e.preventDefault();
                        await handlePay();
                      }}
                    >
                      Đồng ý
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-primary">Lịch sử nhận lương</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Lương </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2023-06-23</TableCell>
                <TableCell>10.000.000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-06-24</TableCell>
                <TableCell>10.000.000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-06-25</TableCell>
                <TableCell>10.000.000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-06-26</TableCell>
                <TableCell>10.000.000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-row items-center px-6">
          <Pagination className="ml-auto mr-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronLeft className="size-5" />
                  <span className="sr-only">Previous Order</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
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
