"use client"

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"


import { usePathname } from 'next/navigation'

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
export default function UserPage() {
    const pathname = usePathname()
    return (
        <div className="bg-white ">
            <div className="flex items-center gap-4 p-3">
                <div className="avatar rounded-full min-h-8 min-w-8 bg-blue-500 text-white font-[700] flex items-center justify-center">
                    <p>TDC</p>
                </div>
                <div className="font-medium dark:text-white">
                    <div className="text-2xl">xin chào chủ tịch cương</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">cuong</div>
                </div>
            </div>
            <div className="p-3 space-x-3 flex">
                <div>
                    <Link href="/dashboard/user/users" >
                        Người dùng
                    </Link>
                    <Separator className={pathname === '/dashboard/user/users' ? 'bg-primary-backgroudPrimary text-white h-1 ' : 'hidden'}/>
                </div>
                <div>
                    <Link href="/dashboard/user/roles" >
                        Vai trò
                    </Link>
                    <Separator className={pathname === '/dashboard/user/roles' ? 'bg-primary-backgroudPrimary text-white h-1 ' : 'hidden'}/>
                </div>
                <div>
                    <Link href="/dashboard/user/facility" >
                        Cơ sở
                    </Link>
                    <Separator className={pathname === '/dashboard/user/facility' ? 'bg-primary-backgroudPrimary text-white h-1 ' : 'hidden'}/>
                </div>
            </div>
        </div>
    );
}