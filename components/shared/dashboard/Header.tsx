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
    <div className=" bg-slate-100 dark:bg-[#040b17] h-12 flex items-center justify-between p-8 border-b border-slate-300 shadow-md">
      <Toaster />
      <div className="flex items-center">
        {/* Recent activities */}
        {/* <Button className="" variant={'ghost'}>
                    <History size={25} />
                </Button> */}
        {/* Search */}
        {/* <CommandDemo /> */}
        {/* <h1 className="text-xl font-medium">Xin chào {user?.user?.firstName}  {user?.user?.lastName} </h1> */}
        <MyDrawer />
      </div>
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>
          <ModeToggle />
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="bg-primary-backgroudPrimary p-1 rounded-sm">
                  <Plus size={15} className="text-white h-5 w-5 " />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to library</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator orientation="vertical" className="bg-gray-300" />

        {/* <div className="flex items-center space-x-4 text-sm">
                    <UsersRound size={25} />
                    <Bell size={25} />
                    <Settings size={25} />
                </div>

                <Separator orientation="vertical" className="bg-gray-300" /> */}

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center space-x-1">
                <span>
                  {user?.user?.firstName} {user?.user?.lastName}
                </span>
                <ChevronDown className="mr-2 h-3 w-3 shrink-0 opacity-50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/profile/${user.user?.id}`}>Trang cá nhân</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="avatar rounded-full min-h-8 min-w-8 bg-blue-500 text-white font-[700] flex items-center justify-center">
          <p>TDC</p>
        </div>
        {/* <div>
                        <LayoutGrid size={25} />
                    </div> */}
      </div>
    </div>
  );
}
