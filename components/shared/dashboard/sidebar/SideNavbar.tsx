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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWindowWidth } from "@react-hook/window-size";

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
    <>
      {isClient ? (
        <div className="relative min-w-[80px] border-r px-3 pb-`0 ">
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
                title: "Trang chủ",
                href: "/dashboard/home",
                icon: LayoutDashboard,
                variant: "colorCompany",
              },
              {
                title: "Người dùng",
                href: "/dashboard/user",
                icon: UserRound,
                variant: "ghost",
              },
              {
                title: "Đơn đặt hàng",
                href: "/dashboard/orders",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Sản phẩm",
                href: "/dashboard/product",
                icon: PackageSearch,
                variant: "ghost",
              },
              {
                title: "Vật liệu",
                href: "/dashboard/material/history",
                icon: InspectionPanel,
                variant: "ghost",
              },
              {
                title: "Cài đặt",
                href: "/dashboard/settings",
                icon: Settings,
                variant: "ghost",
              },
            ]}
          />
        </div>
      ) : null}
    </>
  );
}
