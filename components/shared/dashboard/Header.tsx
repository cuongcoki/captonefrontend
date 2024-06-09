import { Bell, ChevronDown, History, Plus, Settings, UsersRound, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommandDemo from "./Command";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
    const user = useAuth();
    
    return (
        <div className=" bg-slate-100 h-12 flex items-center justify-between p-8 border-b border-slate-300 shadow-md">
            <div className="flex items-center">
                {/* Recent activities */}
                {/* <Button className="" variant={'ghost'}>
                    <History size={25} />
                </Button> */}
                {/* Search */}
                <CommandDemo />
            </div>
            <div className="flex h-5 items-center space-x-4 text-sm">
                <div><TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="bg-primary-backgroudPrimary p-1 rounded-sm">
                                <Plus size={15} className="text-white h-5 w-5 " />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add to library</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider></div>
                <Separator orientation="vertical" className="bg-gray-300" />

                <div className="flex items-center space-x-4 text-sm">
                    <UsersRound size={25} />
                    <Bell size={25} />
                    <Settings size={25} />
                </div>
                <Separator orientation="vertical" className="bg-gray-300" />

                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger >
                            <div className="flex items-center space-x-1">
                                <span>{user?.user?.firstName} {user?.user?.lastName}</span>
                                <ChevronDown className="mr-2 h-3 w-3 shrink-0 opacity-50" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" >
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="avatar rounded-full min-h-8 min-w-8 bg-blue-500 text-white font-[700] flex items-center justify-center">
                    <p>TDC</p>
                </div>
                {/* <div>
                        <LayoutGrid size={25} />
                    </div> */}
            </div>
        </div>
    );
}