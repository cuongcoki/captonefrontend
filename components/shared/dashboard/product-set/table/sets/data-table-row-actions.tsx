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

    <div className="flex  items-center justify-center gap-2">
      <SetUpdateForm setId={row.original.id} />
      <Link href={`/dashboard/products/set/${row.original.id}`} className="rounded p-2 hover:bg-gray-200"><ScanEye className="h-5 w-5" /></Link>
    </div>

  );
}
