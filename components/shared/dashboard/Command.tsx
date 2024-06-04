
'use client'
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search,
    ChevronDown
} from "lucide-react"

import {
    Command,
} from "@/components/ui/command"
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export default function CommandDemo() {

    return (
        <Command className="rounded-lg border  focus:ring-2 focus:ring-blue-500">
            <div className="flex items-center border-b px-2 " >
                <Search className="mr-1 h-4 w-4 shrink-0 opacity-50" />
                <DropdownMenu>
                    <DropdownMenuTrigger >
                        <ChevronDown  className="mr-2 h-4 w-4  text-blue-500 " />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" >
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <input placeholder="Search" className=" hover:w-[300px] duration-200 delay-75 focus:border-none  focus:outline-none border-none flex h-11 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
        </Command>
    );
}