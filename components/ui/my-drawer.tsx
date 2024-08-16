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
import { Minus, Plus } from "lucide-react";
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

export function MyDrawer() {
  const [loading, setLoading] = useState<boolean>(false);
  // ** hooks
  const user = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setLoading(true);
    const id: any = user.user?.id;

    authApi
      .logout(id)
      .then(({ data }) => {
        console.log("dataLogout", data);
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
        <div className="mx-auto w-full ">
          <DrawerHeader>
            <DrawerTitle>Tiến Huy</DrawerTitle>
            <DrawerDescription>Công ty mây tre Tiến Huy</DrawerDescription>
          </DrawerHeader>
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
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
