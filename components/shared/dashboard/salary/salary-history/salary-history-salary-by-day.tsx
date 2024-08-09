import React, { useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HistorySalaryType } from "@/types/salary.type";
import { salaryApi } from "@/apis/salary.api";
import { format } from "date-fns";
import TitleComponent from "@/components/shared/common/Title";
export default function SalaryHistorySalaryByDay({ id }: { id: string }) {
  const [tableData, setTableData] = React.useState<HistorySalaryType[]>([]);
  const [index, setIndex] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(0);

  const formatCurrency = (value: any): string => {
    if (!value) return "";
    let valueString = value.toString();

    // Remove all non-numeric characters, including dots
    valueString = valueString.replace(/\D/g, "");

    // Remove leading zeros
    valueString = valueString.replace(/^0+/, "");

    if (valueString === "") return "0";

    // Reverse the string to handle grouping from the end
    const reversed = valueString.split("").reverse().join("");

    // Add dots every 3 characters
    const formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";

    // Reverse back to original order
    const formatted = formattedReversed.split("").reverse().join("");

    return formatted;
  };
  useEffect(() => {
    salaryApi
      .getHistorySalaryByDay({
        pageIndex: index,
        pageSize: 4,
        userId: id,
      })
      .then((res) => {
        setTableData(res.data.data.data);
        setTotalPage(res.data.data.totalPages);
      });
  }, [id, index]);
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <TitleComponent
          title="Lịch sử lương công nhật"
          description="Lịch sử thay đổi lương công nhật."
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Lương / Công</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item) => (
              <TableRow key={item.startDate}>
                <TableCell> {format(item.startDate, "dd/MM/yyyy")}</TableCell>
                <TableCell>{formatCurrency(item.salary)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                  index >= totalPage ? "" : "bg-primary text-primary-foreground"
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
  );
}
