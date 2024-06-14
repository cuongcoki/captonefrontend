"use client";

import Header from "@/components/shared/dashboard/Header";
import SideNavbar from "@/components/shared/dashboard/sidebar/SideNavbar";

import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex items-start justify-between ">
            <div className="sticky  hidden lg:flex  min-h-screen  top-0">
                <SideNavbar />
            </div>
            <main className={`flex-1 bg-slate-100  transition-all duration-300 grid w-full h-full`}>
                <div className="sticky top-0 z-10">
                    <Header />
                </div>
                <div className="p-6 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
