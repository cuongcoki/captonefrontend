"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { Gender, Role } from "./data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Search } from "lucide-react"
import { useState } from "react"
interface DataTableToolbarProps<TData> {
    table: Table<TData>
}
const dataSearch = [
    {
        id: 1,
        value: "id",
        name: "Theo CMND/CCCD",
    },
    {
        id: 2,
        value: "phone",
        name: "Theo Số điện thoại",
    },
    {
        id: 3,
        value: "firstName",
        name: "Theo Tên nhân viên",
    }
]

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const [selectSearch, setSelectSearch] = useState(dataSearch[0]);

    const handleTakeData = (data: any) => {
        console.log("Dataaa", data)
        setSelectSearch(data)
    }
    console.log("selectSearchselectSearch", selectSearch)
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center space-x-2 ">
                <div className="flex items-center border px-2 rounded-md " >
                    <Search className="mr-1 h-4 w-4 shrink-0 opacity-50" />
                    <DropdownMenu>
                        <DropdownMenuTrigger >
                            <ChevronDown className="mr-2 h-4 w-4  text-primary " />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" >
                            <DropdownMenuLabel>Tìm kiếm</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {
                                dataSearch.map((item, index) => (
                                    <DropdownMenuItem key={item.id} onClick={() => handleTakeData(item)}>{item.name}</DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                        placeholder={selectSearch.name}
                        value={(table.getColumn(`${selectSearch.value}`)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(`${selectSearch.value}`)?.setFilterValue(event.target.value)
                        }
                        className=" hover:w-[300px] duration-200 delay-75 focus:border-none  focus:outline-none border-none flex  w-full rounded-md bg-transparent  text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                {table.getColumn("roleId") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("roleId")}
                        title="Vai trò"
                        options={Role}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Cài lại
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div>
                {/* <DataTableViewOptions table={table} /> */}
            </div>
        </div>
    )
}
