import React, { useEffect, useRef, useState } from "react";
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
import { salaryApi } from "@/apis/salary.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { salaryStore } from "@/components/shared/dashboard/salary/salary-store";
import { set } from "date-fns";
export default function SalaryPay({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [salary, setSalary] = useState("");
  const error = useRef<any>(null);
  const { forceRender, salaryAvailiable, setSalaryAvailiable } = salaryStore();

  const handlePay = async () => {
    salaryApi
      .paySalary({
        userId: id,
        salary: Number(salary.replace(/\./, "")),
        note: "",
      })
      .then((res) => {
        console.log(res);
        forceRender();
        setSalaryAvailiable(
          salaryAvailiable - Number(salary.replace(/\./, ""))
        );
        toast.success("Trả lương thành công");
        setIsOpen(false);
        setSalary("");
      })
      .catch((e) => {
        toast.error("Trả lương thất bại");
      });
  };
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

  const formatCurrencyWithNegative = (value: any): string => {
    if (value === null || value === undefined) return "";
    let valueString = value.toString();

    // Check if the value is negative
    const isNegative = valueString[0] === "-";

    // Remove all non-numeric characters, except the minus sign if it is the first character
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

    // Add the negative sign back if it was originally negative
    if (isNegative) {
      formatted = "-" + formatted;
    }

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
          <div
            className="text-destructive text-sm mt-1 ml-2 "
            hidden={true}
            ref={error}
          >
            Bạn chưa nhập số tiền muốn trả
          </div>
          <div className="flex mt-4 items-center">
            <div className="text-sm text-muted-foreground">
              Lương còn lại:
              <span className="font-bold text-primary">
                {" "}
                {formatCurrencyWithNegative(salaryAvailiable)}
              </span>
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
                    {Number(salary.replace(/\./, "")) < salaryAvailiable ? (
                      <AlertDialogTitle>
                        Bạn có chắc chắn muốn trả {formatCurrency(salary)} VNĐ
                        cho nhân viên này?
                      </AlertDialogTitle>
                    ) : (
                      <AlertDialogTitle className="text-destructive">
                        Lương bạn trả đang lớn hơn lương khả dụng của nhân viên
                        này. Bạn có chắc chắn muốn trả {formatCurrency(salary)}{" "}
                        VNĐ cho nhân viên này?
                      </AlertDialogTitle>
                    )}

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
    </>
  );
}
