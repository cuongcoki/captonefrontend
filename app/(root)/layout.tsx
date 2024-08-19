"use client";

import Header from "@/components/shared/dashboard/Header";
import SideNavbar from "@/components/shared/dashboard/sidebar/SideNavbar";
import React, { Suspense } from "react";
import LoadingDashboard from "./loading";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex items-start justify-between ">
      <Suspense fallback={<LoadingDashboard />}>
        <div className="sticky hidden sm:flex  min-h-screen  top-0">
          <SideNavbar />
        </div>
        <main
          className={`flex-1 bg-slate-100 dark:bg-[#09090b]  transition-all duration-300 grid w-full h-full`}
        >
          <div className="p-6 overflow-auto bg-card">{children}</div>
          <div className="sm:hidden block h-[50px] bg-white dark:bg-black">

          </div>
          <div className="sm:hidden block fixed bottom-0 w-full z-10">
            <Header />
          </div>
        </main>
      </Suspense>
    </div>
  );
}
