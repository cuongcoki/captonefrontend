import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-center space-x-4 my-4 ">
      <Button
        variant="outline"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="dark:bg-[#24d369]"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <span>
        Trang {currentPage} Của {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="dark:bg-[#24d369]"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
