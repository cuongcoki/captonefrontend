
import { Row } from "@tanstack/react-table"

import Link from "next/link"
import { ScanEye } from "lucide-react"



interface DataTableRowActionsProps<TData extends {id:string}> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends {id:string}>({
  row,
}: DataTableRowActionsProps<TData>) {

  return (
    <div className="flex items-center justify-center gap-2">
    <Link href={`/dashboard/order/${row.original.id}`} className="rounded p-2 hover:bg-gray-200"><ScanEye className="h-5 w-5" /></Link>
  </div>
  )
}
