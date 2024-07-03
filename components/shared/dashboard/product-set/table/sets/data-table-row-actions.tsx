import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SetUpdateForm } from "../../form/SetUpdateForm";
import { ScanEye } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface Product {
  id: string;
  // các thuộc tính khác của Product
}

export function DataTableRowActions<TData extends { id: string }>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <SetUpdateForm setId={row.original.id}>
          <div className="w-full hover:bg-gray-200 dark:hover:bg-black/90 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            Chỉnh sửa
          </div>
        </SetUpdateForm>
        <Link
          className="w-full hover:bg-gray-200 dark:hover:bg-black/90 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          href={`/dashboard/products/set/${row.original.id}`}
        >
          Chi tiết
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
    // <div className="flex  items-center justify-center gap-2">
    //   <SetUpdateForm setId={row.original.id} />
    //   <Link href={`/dashboard/products/set/${row.original.id}`} className="rounded p-2 hover:bg-gray-200"><ScanEye className="h-5 w-5" /></Link>
    // </div>
  );
}
