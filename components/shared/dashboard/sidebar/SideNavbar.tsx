"use client";
import React, { useEffect, useState } from "react";
import { Nav } from "./nav";
import {
  ShoppingCart,
  LayoutDashboard,
  UserRound,
  Settings,
  ChevronRight,
  ChevronLeft,
  PackageSearch,
  InspectionPanel,
  CalendarSearch,
  PackagePlus,
  Building,
  MessageSquareWarning,
  MessageSquareMore,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWindowWidth } from "@react-hook/window-size";
import { ModeToggle } from "@/components/shared/common/mode-toggle";

type Props = {};
export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="relative min-w-[80px] border-r  px-3 dark:bg-[#1c1917]">
      {isClient ? (
        <div>
          {!mobileWidth && (
            <Button
              onClick={toggleSidebar}
              variant="secondary"
              className=" absolute right-[-20px] top-[50%] rounded-full p-2"
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          )}

          <Nav
            isCollapsed={mobileWidth ? true : isCollapsed}
            links={[
              {
                title: "Thống kê",
                href: "/dashboard/home",
                icon: LayoutDashboard,
                variant: "colorCompany",
              },
              {
                title: "Nhân Viên",
                href: "/dashboard/user",
                icon: UserRound,
                variant: "ghost",
              },
              {
                title: "Đơn đặt hàng",
                href: "/dashboard/order",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Sản phẩm",
                href: "/dashboard/products/product",
                href1: "/dashboard/products/set",
                hrefCon: [
                  {
                    id: 1,
                    title: "Sản phẩm",
                    href: "/dashboard/products/product",
                  },
                  {
                    id: 2,
                    title: "Bộ sản phẩm",
                    href: "/dashboard/products/set",
                  },
                ],
                icon: PackageSearch,
                variant: "ghost",
              },
              {
                title: "Vật liệu",
                href: "/dashboard/material/history",
                href1: "/dashboard/material/manager",
                hrefCon: [
                  {
                    id: 1,
                    title: "Lịch sử nhập",
                    href: "/dashboard/material/history",
                  },
                  {
                    id: 2,
                    title: "Nguyên vật liệu",
                    href: "/dashboard/material/manager",
                  },
                ],
                icon: InspectionPanel,
                variant: "ghost",
              },
              {
                title: "Điểm danh",
                href: "/dashboard/attendance/update-attendance",
                icon: CalendarSearch,
                variant: "ghost",
              },
              {
                title: "Xem điểm danh",
                href: "/employee/view-attendance",
                icon: UserRound,
                variant: "ghost",
              },
              {
                title: "Công ty",
                href: "/dashboard/company",
                icon: Building,
                variant: "ghost",
              },
              {
                title: "Đơn báo cáo",
                href: "/employee/report",
                icon: MessageSquareWarning,
                variant: "ghost",
              },
              {
                title: "Khiếu nại",
                href: "/dashboard/report-manager",
                icon: MessageSquareMore,
                variant: "ghost",
              },
              {
                title: "Lương",
                href: "/dashboard/salary",
                icon: Coins,
                variant: "ghost",
              },
            ]}
          />
        </div>
      ) : null}
      <div className="absolute bottom-0 w-full">
        <div className="m-1 mb-3">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
