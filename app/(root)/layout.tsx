"use client";

import Header from "@/components/shared/dashboard/Header";
import SideNavbar from "@/components/shared/dashboard/sidebar/SideNavbar";
import { useParams, usePathname, useRouter } from "next/navigation";

import React, { Suspense } from "react";
import LoadingDashboard from "./loading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BreadcrumbComponent } from "@/components/shared/BreadcrumbComponent";
import { Card, CardTitle } from "@/components/ui/card";

const LinkBread = [
  {
    title: "Trang chủ",
    href: "/dashboard/home",
    variant: "colorCompany",
  },
  {
    title: "Nhân Viên",
    href: "/dashboard/user",
    variant: "ghost",
  },
  {
    title: "Đơn đặt hàng",
    href: "/dashboard/order",
    variant: "ghost",
  },
  {
    title: "Sản phẩm",
    href: "/dashboard/products/product",
    href1: "/dashboard/products/set",
    variant: "ghost",
  },
  {
    title: "Vật liệu",
    href: "/dashboard/material/history",
    href1: "/dashboard/material/manager",
    variant: "ghost",
  },
  {
    title: "Điểm danh",
    href: "/dashboard/attendance/update-attendance",
    variant: "ghost",
  },
  {
    title: "Xem điểm danh",
    href: "/employee/view-attendance",
    variant: "ghost",
  },
  {
    title: "Công ty",
    href: "/dashboard/company",
    variant: "ghost",
  },
  {
    title: "Đơn báo cáo",
    href: "/employee/report",
    variant: "ghost",
  },
  {
    title: "Khiếu nại",
    href: "/dashboard/report-manager",
    variant: "ghost",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (

    <div className="flex items-start justify-between ">
      <Suspense fallback={<LoadingDashboard />}>
        <div className="sticky hidden sm:flex  min-h-screen  top-0">
          <SideNavbar />
        </div>
        <main className={`flex-1 bg-slate-100 dark:bg-[#09090b]  transition-all duration-300 grid w-full h-full`}>
          <div className="p-6 overflow-auto bg-card">
            <BreadcrumbComponent />
            <CardTitle>
              <h2 className="text-2xl font-semibol text-[#22c55e] text-left w-full tracking-tight">Danh Sách Nhân Viên</h2>
              <span className="text-xs font-normal leading-snug text-muted-foreground">Danh sách nhân viên trong công ty.</span>
            </CardTitle>
            <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full my-4"></div>
            {children}
          </div>
          <div className=" sm:hidden block sticky bottom-0 z-10">
            <Header />
          </div>
        </main>
      </Suspense>
    </div>
  );
}
