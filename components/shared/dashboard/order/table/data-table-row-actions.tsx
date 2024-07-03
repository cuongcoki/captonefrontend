
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { ScanEye } from "lucide-react"
import OrderIdPage from "../orderID/OrderId"



interface DataTableRowActionsProps<TData extends {id:string}> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends {id:string}>({
  row,
}: DataTableRowActionsProps<TData>) {

  return (
    <div className="flex  items-center justify-center gap-2">
    {/* <SetUpdateForm setId={row.original.id} /> */}
    <Link href={`/dashboard/order/${row.original.id}`} className="rounded p-2 hover:bg-gray-200"><ScanEye className="h-5 w-5" /></Link>
  </div>

  )
}
