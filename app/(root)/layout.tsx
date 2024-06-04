"use client"

import Header from "@/components/shared/dashboard/Header";
import SideNavbar from "@/components/shared/dashboard/sidebar/SideNavbar";

import React, { useState } from 'react'
import { useWindowWidth } from '@react-hook/window-size'
export default function Layout({ children }: { children: React.ReactNode }) {

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

    const onlyWidth = useWindowWidth();
    const mobileWidth = onlyWidth < 768;

    function toggleSidebar() {
        setIsCollapsed(!isCollapsed);
    }
    return (
        <div className="flex items-start justify-between">
            <div className="sticky  hidden lg:flex  min-h-screen  top-0">
                <SideNavbar />
            </div>
            <main className={`flex-1 bg-slate-100  transition-all duration-300 grid w-full h-full`}>
                <div className="sticky top-0 z-10">
                    <Header />
                </div>
                <div className="p-2">
                    {children}
                </div>
            </main>
        </div>
    );
}


