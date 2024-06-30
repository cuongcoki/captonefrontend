import Link from "next/link";
import { ChevronDown, LucideIcon, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogoIcon } from "@/constants/images";
import Image from "next/image";
import { ModeToggle } from "@/components/shared/common/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/apis/auth.api";
import toast from "react-hot-toast";
interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    href?: any;
    icon: LucideIcon;
    variant: "colorCompany" | "ghost";
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname();
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
    <TooltipProvider>
      {/* logo */}
      <div className="py-3">
        {!isCollapsed ? (
          <Link href={"/"}>
            <div className=" flex items-center space-x-2 px-3">
              <Image
                src={LogoIcon}
                alt="Logo Tien Huy"
                className="w-[30px] h-[30px]"
              />
              <span className="text-sm">Tiến Huy</span>
            </div>
          </Link>
        ) : (
          <Link href={"/"}>
            <div className=" flex items-center space-x-2 px-3">
              <Image
                src={LogoIcon}
                alt="Logo Tien Huy"
                className="w-[30px] h-[30px]"
              />
            </div>
          </Link>
        )}
      </div>
      {/* data sidebar */}
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
      >
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {links.map((link, index) =>
            isCollapsed ? (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      buttonVariants({
                        variant:
                          link.href === pathname ||
                          pathname.includes(`${link.href}/history`) ||
                          pathname.includes(`${link.href}/manage`) ||
                          pathname.includes(`${link.href}/set`) ||
                          pathname.includes(`${link.href}/product`)
                            ? "colorCompany"
                            : "ghost",
                        size: "icon",
                      }),
                      "h-9 w-9",
                      link.variant === "colorCompany" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.title}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key={index}
                href={link.href}
                className={cn(
                  buttonVariants({
                    variant:
                      pathname === pathname
                        ? link.href === pathname ||
                          pathname.includes(`${link.href}/history`) ||
                          pathname.includes(`${link.href}/manage`) ||
                          pathname.includes(`${link.href}/set`) ||
                          pathname.includes(`${link.href}/product`)
                          ? "colorCompany"
                          : "ghost"
                        : pathname === pathname
                        ? link.href === pathname ||
                          pathname.includes(`${link.href}/history`) ||
                          pathname.includes(`${link.href}/manage`) ||
                          pathname.includes(`${link.href}/set`) ||
                          pathname.includes(`${link.href}/product`)
                          ? "colorCompany"
                          : "ghost"
                        : null,
                    size: "sm",
                  }),
                  link.variant === "colorCompany" &&
                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                  "justify-start"
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.title}
              </Link>
            )
          )}
        </nav>
      </div>
    </TooltipProvider>
  );
}
