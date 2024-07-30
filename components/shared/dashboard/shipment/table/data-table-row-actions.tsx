import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ScanEye } from "lucide-react";
import { UpdateShipment } from "../form/UpdateShipment";

interface DataWithId {
  id: string;
}

interface DataTableRowActionsProps<TData extends DataWithId> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends DataWithId>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <>
      <UpdateShipment shipmentIDDes={row.original.id} />
    </>
  );
}
