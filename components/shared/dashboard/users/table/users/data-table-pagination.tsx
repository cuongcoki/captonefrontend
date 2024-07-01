import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 my-4 ">
      <Button
        variant="outline"
        onClick={handlePreviousPage}
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
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="dark:bg-[#24d369]"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
