"use client";
import React, { useEffect, useState } from "react";
import { NavMobile } from "./navMobile";
import {
  ShoppingCart,
  UserRound,
  ChevronRight,
  ChevronLeft,
  PackageSearch,
  InspectionPanel,
  CalendarSearch,
  Building,
  MessageSquareWarning,
  MessageSquareMore,
  Truck,
  Coins,
  Warehouse,
  HandCoins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWindowWidth } from "@react-hook/window-size";
import { useAuth } from "@/hooks/useAuth";

type Props = {};
export default function BottomNavbar({ }: Props) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  // ** hooks
  const user = useAuth();
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
                 title: "Nhân Viên",
                 href: "/dashboard/user",
                 icon: UserRound,
                 variant: "ghost",
                 checkRoll: [{ id: 1 }],
               },
               {
                 title: "Đơn đặt hàng",
                 href: "/dashboard/order",
                 icon: ShoppingCart,
                 variant: "ghost",
                 checkRoll: [{ id: 1 }],
               },
               {
                 title: "Đơn vận chuyển",
                 href: "/dashboard/shipment",
                 icon: Truck,
                 variant: "ghost",
                 checkRoll: [{ id: 1 }],
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
                 checkRoll: [{ id: 1 }],
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
                 checkRoll: [{ id: 1 }],
               },
               {
                 title: "Điểm danh",
                 href: "/dashboard/attendance/update-attendance",
                 icon: CalendarSearch,
                 variant: "ghost",
                 checkRoll: [{ id: 1 }],
               },
               {
                 title: "Công ty",
                 href: "/dashboard/company",
                 icon: Building,
                 variant: "ghost",
                 checkRoll: [{ id: 1 }],
               },
               {
                 title: "Khiếu nại",
                 href: "/dashboard/report-manager",
                 icon: MessageSquareMore,
                 variant: "ghost",
                 checkRoll: [{ id: 1 }],
               },
               {
                 title: "Lương",
                 href: "/dashboard/salary",
                 icon: Coins,
                 variant: "ghost",
                 checkRoll: [{ id: 1 }],
               },
               {
                 title: "Chi phí gia công",
                 href: "/dashboard/salary-company",
                 icon: HandCoins,
                 variant: "ghost",
                 checkRoll: [{ id: 1 }],
               },
               {
                 title: "Kho",
                 href: "/dashboard/product-phase",
                 icon: Warehouse,
                 variant: "ghost",
                 checkRoll: [{ id: 1 }],
               },
 
               {
                 title: "Điểm danh",
                 href: "/branchadmin/attendance/update-attendance",
                 icon: CalendarSearch,
                 variant: "ghost",
                 checkRoll: [{ id: 2 }],
               },
               {
                 title: "Nhân Viên",
                 href: "/branchadmin/user",
                 icon: UserRound,
                 variant: "ghost",
                 checkRoll: [{ id: 2 }],
               },
               {
                 title: "Xem điểm danh",
                 href: "/employee/view-attendance",
                 icon: UserRound,
                 variant: "ghost",
                 checkRoll: [{ id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
               },
               {
                 title: "Lương",
                 href: `/employee/salary/${user.user?.id}`,
                 icon: Coins,
                 variant: "ghost",
                 checkRoll: [{ id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
               },
               {
                 title: "Đếm sản phẩm",
                 href: "/employee/attendance/update-attendance",
                 icon: CalendarSearch,
                 variant: "ghost",
                 checkRoll: [{ id: 3 }],
               },
               {
                 title: "Đơn vận chuyển",
                 href: "/employee/shipment",
                 icon: Truck,
                 variant: "ghost",
                 checkRoll: [{ id: 4 }],
               },
               {
                 title: "Khiếu nại",
                 href: "/branchadmin/report-manager",
                 icon: MessageSquareMore,
                 variant: "ghost",
                 checkRoll: [{ id: 2 }],
               },
               {
                 title: "Gửi khiếu nại",
                 href: "/employee/report",
                 icon: MessageSquareWarning,
                 variant: "ghost",
                 checkRoll: [{ id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
               },
             ]}
          />
        </div>
      ) : null}
    </div>
  );
}
