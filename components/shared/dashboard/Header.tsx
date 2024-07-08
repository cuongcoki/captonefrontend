import {
  Bell,
  ChevronDown,
  History,
  Plus,
  Settings,
  UsersRound,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CommandDemo from "./Command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/apis/auth.api";
import toast, { Toaster } from "react-hot-toast";
import { error } from "console";
import { useState } from "react";

import { MyDrawer } from "@/components/ui/my-drawer";
import { ModeToggle } from "@/components/shared/common/mode-toggle";

export default function Header() {
  // ** state
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
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className=" bg-slate-100 dark:bg-[#1c1917] h-12 flex items-center justify-between p-8 border-t rounded-md border-primary shadow-md ">
      <Toaster />
      <div className="flex items-center justify-center flex-grow">
        <MyDrawer />
      </div>
    </div>
  );
}
