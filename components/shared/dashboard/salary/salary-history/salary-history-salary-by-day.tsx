import React from "react";
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
export default function SalaryHistorySalaryByDay() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Lịch sử lương</CardTitle>
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
            <TableRow>
              <TableCell>2023-06-23</TableCell>
              <TableCell>100.000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2023-06-24</TableCell>
              <TableCell>150.000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2023-06-25</TableCell>
              <TableCell>100.000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2023-06-26</TableCell>
              <TableCell>150.000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-row items-center px-6 py-3">
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
  );
}
