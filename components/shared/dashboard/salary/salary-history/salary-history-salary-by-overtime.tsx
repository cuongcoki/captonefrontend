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
export default function SalaryHistorySalaryByOverTime({ id }: { id: string }) {
  const [tableData, setTableData] = React.useState<HistorySalaryType[]>([]);
  const [index, setIndex] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(0);
  const formatCurrency = (value: any) => {
    if (!value) return "";
    let valueString = value.toString();
    // Remove all non-numeric characters, including dots
    valueString = valueString.replace(/\D/g, "");
    // Reverse the string to handle grouping from the end
    let reversed = valueString.split("").reverse().join("");
    // Add dots every 3 characters
    let formattedReversed = reversed.match(/.{1,3}/g).join(".");
    // Reverse back to original order
    let formatted = formattedReversed.split("").reverse().join("");
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
        <CardTitle className="text-primary">Lịch sử tăng ca</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Lương / Giờ</TableHead>
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
      <CardFooter className="flex flex-row items-center px-6 py-3">
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
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
                className="h-6 w-6"
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
