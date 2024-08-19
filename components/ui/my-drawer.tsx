"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Minus, MoonIcon, Plus, SunIcon } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import SideNavbar from "../shared/dashboard/sidebar/SideNavbar";
import { LogoIcon } from "@/constants/images";
import Image from "next/image";
import { Divide } from "lucide-react";
import { Button } from "./button";
import { NavMobile } from "../shared/dashboard/sidebar/navMobile";
import BottomNavbar from "../shared/dashboard/sidebar/BottomNavbar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/apis/auth.api";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import Link from "next/link";
export const Role = [
  {
    value: 1,
    label: "Quản lý hệ thống",
  },
  {
    value: 2,
    label: "Quản lý cơ sở",
  },
  {
    value: 3,
    label: "Quản lý số lượng",
  },
  {
    value: 4,
    label: "Nhân viên vận chuyển",
  },
  {
    value: 5,
    label: "Nhân viên",
  },
];
export function MyDrawer() {
  const [loading, setLoading] = useState<boolean>(false);
  // ** hooks
  const user = useAuth();
  const router = useRouter();
  const { setTheme } = useTheme();

  const handleLogout = () => {
    setLoading(true);
    const id: any = user.user?.id;

    authApi
      .logout(id)
      .then(({ data }) => {
        // console.log("dataLogout", data);
        user.logout();
        router.push("/sign-in");
        toast.success(data.message);
      })
      .catch((error) => {
        // toast.error(error.message);
        router.push("/sign-in");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Drawer>
      <DrawerTrigger
        asChild
        className="p-1 rounded-full bg-primary-backgroudPrimary"
      >
        <Image
          src={LogoIcon}
          alt="Logo Tien Huy"
          className="w-[40px] h-[40px] cursor-pointer scale-150 -translate-y-5  "
        />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full relative">
          <Link href={`/profile/${user.user?.id}`}>
            <DrawerHeader>
              <DrawerTitle className="text-primary">{user.user?.lastName}{user.user?.firstName}</DrawerTitle>
              <DrawerDescription> {Role.find((role) => role.value === user?.user?.roleId)?.label}</DrawerDescription>
            </DrawerHeader>
          </Link>
          <div className="p-4 pb-0">
            <BottomNavbar />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Bỏ</Button>
            </DrawerClose>
            <Button variant="outline" onClick={handleLogout}>
              Đăng xuất
            </Button>
            <Badge
              variant="secondary"
              className="absolute top-0 text-xs cursor-pointer hover:bg-gray-200 border p-2 shadow-md "
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-full flex items-center ">
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Sáng
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Tối
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    Hệ thống
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Badge>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
