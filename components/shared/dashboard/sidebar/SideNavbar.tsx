"use client";
import React, { useEffect, useState } from "react";
import { Nav } from "./nav";
import {
  ShoppingCart,
  UserRound,
  Settings,
  ChevronRight,
  ChevronLeft,
  PackageSearch,
  InspectionPanel,
  CalendarSearch,
  Building,
  MessageSquareWarning,
  MessageSquareMore,
  Truck,
  LogOut,
  Coins,
  Warehouse,
  HandCoins,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Command } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useWindowWidth } from "@react-hook/window-size";
import { ModeToggle } from "@/components/shared/common/mode-toggle";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/apis/auth.api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CardContent } from "../home/DashbroadComponents/Cards/Card";
import Link from "next/link";

type Props = {};
export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // ** hooks
  const user = useAuth();
  const router = useRouter();

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    setLoading(true);
    const id: any = user.user?.id;

    authApi
      .logout(id)
      .then(({ data }) => {
        user.logout();
        router.push("/sign-in");
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
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
      <div className="absolute bottom-0 w-full">
        {!mobileWidth && (
          <>
            {isCollapsed ? (
              <div className="mb-3 ml-2.5 w-[30px]">
                <Command className="ml-2.5 focus:ring-2 focus:ring-blue-500">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Settings />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>
                        <Button>
                          <Link href={`/profile/${user.user?.id}`}>
                            Trang cá nhân
                          </Link>
                        </Button>
                      </DropdownMenuLabel>
                      <DropdownMenuItem onClick={handleLogout}>
                        <Button onClick={handleLogout}>
                          <LogOut className="mr-1" /> đăng xuất
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ModeToggle />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Command>
              </div>
            ) : (
              <CardContent className="m-1 mb-3  w-[170px]">
                <Button>
                  <Link href={`/profile/${user.user?.id}`}>Trang cá nhân</Link>
                </Button>
                <Button onClick={handleLogout}>
                  <LogOut className="mr-1" /> đăng xuất
                </Button>
                <ModeToggle />
              </CardContent>
            )}
          </>
        )}
      </div>
    </div>
  );
}
