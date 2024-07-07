"use client";
import React, { useEffect, useState } from "react";
import { NavMobile } from "./navMobile";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWindowWidth } from "@react-hook/window-size";
import { ModeToggle } from "@/components/shared/common/mode-toggle";

type Props = {};
export default function BottomNavbar({}: Props) {
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
    <div className="relative min-w-[80px] border-r  px-3 ">
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

          <NavMobile
            isCollapsed={mobileWidth ? true : isCollapsed}
            links={[
              {
                title: "Trang chủ",
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
                icon: PackageSearch,
                variant: "ghost",
              },
              {
                title: "Vật liệu",
                href: "/dashboard/material/history",
                href1: "/dashboard/material/manager",
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
           
            ]}
          />
        </div>
      ) : null}
      {/* <div className="absolute bottom-0 w-full">
        <div className="m-1 mb-3">
          <ModeToggle />
        </div>
      </div> */}
    </div>
  );
}
