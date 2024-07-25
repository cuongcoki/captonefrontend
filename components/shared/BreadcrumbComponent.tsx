"use client";

import { useParams, usePathname } from "next/navigation";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const LinkBread = [
  { title: "Thống kê", href: "/dashboard/home", variant: "colorCompany" },
  { title: "Nhân Viên", href: "/dashboard/user", variant: "ghost" },
  { title: "Đơn đặt hàng", href: "/dashboard/order", variant: "ghost" },
  { title: "Sản phẩm", href: "/dashboard/products/product", variant: "ghost" },
  { title: "Bộ sản phẩm", href: "/dashboard/products/set", variant: "ghost" },
  { title: "Vật liệu", href: "/dashboard/material/manager", variant: "ghost" },
  {
    title: "Lịch sử vật liệu",
    href: "/dashboard/material/history",
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
  { title: "Công ty", href: "/dashboard/company", variant: "ghost" },
  { title: "Đơn báo cáo", href: "/employee/report", variant: "ghost" },
  { title: "Khiếu nại", href: "/dashboard/report-manager", variant: "ghost" },
  { title: "Lương", href: "/dashboard/salary", variant: "ghost" },
  { title: "Đơn vận chuyển", href: "/dashboard/shipment", variant: "ghost" },
];

const findTitle = (href: any) => {
  const link = LinkBread.find((link) => link.href === href);
  return link ? link.title : href;
};

export function BreadcrumbComponent() {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();

  const pathnames = pathname.split("/").filter((x) => x);
  const breadcrumbs = pathnames.map((name, index) => {
    const href = `/${pathnames.slice(0, index + 1).join("/")}`;
    const title = findTitle(href);
    return { href, title };
  });

  const getCustomTitle = (href: any, defaultTitle: any) => {
    switch (href) {
      case "/dashboard/products":
        return "Loại Sản phẩm";
      case "/dashboard/material":
        return "Vật liệu";
      case "/dashboard":
        return "Quản Lý";
      case "/dashboard/attendance":
        return "bảng điểm danh";
      case "/employee":
        return "Nhân viên";
        case "/employee/shipment":
          return "Đơn vận chuyển";
      case `/dashboard/order/${params.id}`:
        return "Chi tiết đơn hàng";
      case `/dashboard/products/product/${params.id}`:
        return "Chi tiết sản phẩm";
      case `/dashboard/products/set/${params.id}`:
        return "Thông tin bộ";
      case `/dashboard/salary/detail/${params.id}`:
        return "Chi tiết lương";
      default:
        return defaultTitle;
    }
  };

  return (
    <Breadcrumb className="pb-4">
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length -1 ;
          const customTitle = getCustomTitle(breadcrumb.href, breadcrumb.title);

          return isLast ? (
            <BreadcrumbItem key={breadcrumb.href}>
              <BreadcrumbPage>{customTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem key={breadcrumb.href}>
              <BreadcrumbLink href={breadcrumb.href}>
                {customTitle}
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
