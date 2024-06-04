"use client"
import { Button, buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Twitter, ChevronDown, } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";
import { usePathname } from 'next/navigation'

import { navBar } from '@/constants/index.js'
import { LogoIcon } from "@/constants/images";
import Image from "next/image";

export default function SideBar() {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
    const pathname = usePathname()
    function toggleSidebar() {
        setIsCollapsed(!isCollapsed);
    }
    console.log(pathname)
    return (
        <div className={`${!isCollapsed ? 'w-56' : 'w-20'} relative  min-h-screen bg-primary-backgroudPrimary text-slate-50 justify-between  [&>div:first-child]:hover:opacity-100 delay-150`}>
            {/* Top Part */}
            {/* <div className="animate-slideLeft opacity-0 absolute right-[-20px] top-[50%] transition-opacity duration-200 group-hover:opacity-100">
                <Button onClick={toggleSidebar} variant="secondary" className="rounded-full p-2">
                    {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </Button>
            </div> */}
            {/* <div className="flex flex-col">
                <div className="p-3">
                   {
                    !isCollapsed ? (
                        <Link href={"/"} >
                        <div className=" flex items-center space-x-2 px-3">
                            <Image src={LogoIcon} alt="Logo Tien Huy" className="w-[30px] h-[30px]"/>
                            <span>Mây Che </span>
                        </div>
                    </Link>
                    ):(
                        <Link href={"/"} >
                        <div className=" flex items-center space-x-2 px-3">
                            <Image src={LogoIcon} alt="Logo Tien Huy" className="w-[30px] h-[30px]"/>
                        </div>
                    </Link>
                    )
                   }
                </div>
                <nav className="flex flex-col gap-4 p-3">
                    {
                        navBar.map((item, index) => (
                            !isCollapsed ? (
                                <Link key={index} href={item.href} className={cn(
                                    buttonVariants({ variant: item.href === pathname ? 'bgPrimaty' : 'ghost', size: "sm" }),
                                    item.variant === "default" &&
                                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                    "justify-between ",
                                    { 'bg-blue-500': item.href === pathname }
                                )}
                                >
                                    <div className="flex items-center space-x-2">
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </div>
                                    <div>
                                        {
                                            item.subBar && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger ><ChevronDown /></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {
                                                            item.subBar.map((subItem, index) => (
                                                                <DropdownMenuItem>
                                                                    <Link key={index} href={item.href}>
                                                                        {subItem.title}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            ))
                                                        }
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )
                                        }
                                    </div>
                                </Link>
                            ) : (
                                <Link key={index} href={item.href} className={cn(
                                    buttonVariants({ variant: item.href === pathname ? 'bgPrimaty' : 'ghost', size: "sm" }),
                                    item.variant === "default" &&
                                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                
                                    { 'bg-blue-500': item.href === pathname }
                                )}
                                >
                                    <div className="flex items-center space-x-2">
                                        {item.icon}
                                        {
                                            item.subBar && (
                                                <DropdownMenu>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Inventory</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {
                                                            item.subBar.map((subItem, index) => (
                                                                <DropdownMenuItem>
                                                                    <Link key={index} href={item.href}>
                                                                        {subItem.title}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            ))
                                                        }
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )
                                        }
                                    </div>
                                </Link>
                            )
                        ))
                    }
                </nav>
            </div> */}


            {/* Bottom  */}

            {/* Subscrption Card */}
            {/* Footer Icon  */}
        </div>
    );
}