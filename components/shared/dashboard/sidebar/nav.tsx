import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useParams, usePathname } from "next/navigation";

import { Settings, LogOut, SunIcon, MoonIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Command } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

import { CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HoverComponent from "../../common/hover-card";
import { filesApi } from "@/apis/files.api";
import { NoImage } from "@/constants/images";

import { LogoIcon } from "@/constants/images";
import Image from "next/image";
import { ModeToggle } from "@/components/shared/common/mode-toggle";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { authApi } from "@/apis/auth.api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    href?: any;
    href1?: any;
    hrefCon?: any[];
    icon: LucideIcon;
    variant: "colorCompany" | "ghost";
    checkRoll: { id: number }[];
  }[];
}

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

export function Nav({ links, isCollapsed }: NavProps) {
  // ** state
  const [loading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>("");

  // ** hooks
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuth();
  const params = useParams<{ id: string }>();
  useEffect(() => {}, [params]);
  const { setTheme } = useTheme();

  // console.log("user", user?.user)
  const [isOpen, setIsOpen] = useState(false);
  const [checkLink, setCheckLink] = useState("");
  const [getNameLink, setGetNameLink] = useState<
    { id: number; title: string; href: string }[]
  >([]);
  const checkLinkCon = [
    {
      href1: "/dashboard/material/manager",
    },
    {
      href1: "/dashboard/products/set",
    },
  ];
  const toggleDropdown = (nameLink: string, hrefCon: any, event: any) => {
    setCheckLink(nameLink);
    setGetNameLink(hrefCon);
    event.preventDefault();
    const conCheckLink = checkLinkCon.some((item) => item.href1 === nameLink);
    if (conCheckLink) {
      setIsOpen(!isOpen);
    }
  };

  const closeDropdown = (nameLink: string) => {
    setIsOpen(false);
  };

  const checkActiveLink = (link: any) => {
    return (
      link.href === pathname ||
      link.href1 === pathname ||
      pathname.includes(`${link.href}/history`) ||
      pathname.includes(`${link.href}/manage`) ||
      pathname.includes(`${link.href}/set`) ||
      pathname.includes(`${link.href}/product`) ||
      pathname.includes(`${link.href}/detail`) ||
      (link.hrefCon &&
        link.hrefCon.some((hrefCon: any) => pathname === hrefCon.href)) ||
      pathname.includes(`${link.href}/${params.id}`) ||
      pathname.includes(`${link.href1}/${params.id}`)
    );
  };

  const userRoleId = user.user?.roleId;

  const checkAccess = (checkRoll: { id: number }[]) => {
    return checkRoll.some((item) => item.id === userRoleId);
  };

  useEffect(() => {
    filesApi.getFile(String(user.user?.avatar)).then((res) => {
      setAvatar(res.data.data);
    });
  }, [avatar, user.user?.avatar]);

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
        // toast.error(error.message);
        router.push("/sign-in");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col justify-between h-screen overflow-y-auto">
        {/* logo */}
        <div className="py-3">
          {!isCollapsed ? (
            <div className=" flex items-center space-x-2 px-3">
              <Image
                src={LogoIcon}
                alt="Logo Tien Huy"
                className="w-[30px] h-[30px]"
              />
              <span className="text-sm">Tiến Huy</span>
            </div>
          ) : (
            <div className=" flex items-center space-x-2 px-3">
              <Image
                src={LogoIcon}
                alt="Logo Tien Huy"
                className="w-[30px] h-[30px]"
              />
            </div>
          )}
        </div>
        {/* data sidebar */}
        <div
          data-collapsed={isCollapsed}
          className="group flex flex-col justify-between gap-4 py-2 data-[collapsed=true]:py-2 w-full h-full"
        >
          <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
            {links.map((link, index) => {
              if (!checkAccess(link.checkRoll)) {
                return null;
              }

              return isCollapsed ? (
                <Tooltip key={index} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={
                        link.hrefCon && link.hrefCon?.length > 0
                          ? "#"
                          : link.href
                      }
                      className={cn(
                        buttonVariants({
                          variant: checkActiveLink(link)
                            ? "colorCompany"
                            : "ghost",
                          size: "icon",
                        }),
                        "h-9 w-9",
                        link.variant === "colorCompany" &&
                          "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                      )}
                      onClick={(event) => {
                        if (link.hrefCon && link.hrefCon?.length > 0) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <link.icon className="h-4 w-4" />
                      <span className="sr-only">{link.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="flex items-center gap-4"
                  >
                    {link.hrefCon ? (
                      <ul
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        {link.hrefCon.map((linkCon, index) => (
                          <li
                            key={index}
                            className={`${
                              pathname === linkCon.href
                                ? "bg-primary hover:bg-primary/90 text-white hover:text-white"
                                : "text-gray-700"
                            } p-1 text-sm hover:bg-gray-100`}
                          >
                            <Link
                              href={linkCon.href}
                              className="flex items-center gap-2"
                            >
                              {linkCon.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>{link.title}</>
                    )}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div
                  key={index}
                  className={cn(
                    checkActiveLink(link)
                      ? "bg-[#22c55e] text-primary-foreground hover:bg-primary-backgroudPrimary /90"
                      : "hover:bg-accent hover:text-accent-foreground",
                    "rounded-md"
                  )}
                  onClick={(event) =>
                    toggleDropdown(link.href1, link.hrefCon, event)
                  }
                >
                  <Link
                    href={
                      link.hrefCon && link.hrefCon?.length > 0 ? "#" : link.href
                    }
                    className={cn(
                      "w-full h-9 px-3 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                      link.variant === "colorCompany" &&
                        "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <link.icon className="mr-2 h-5 w-5" />
                    {link.href1 ? (
                      <span className="flex justify-between w-full">
                        {link.title}
                      </span>
                    ) : (
                      <span className="w-full">{link.title}</span>
                    )}
                  </Link>
                  {link.href1 === checkLink && isOpen && (
                    <div className="right-0 mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <ul
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        {getNameLink?.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              className={`${
                                pathname === item.href
                                  ? "bg-primary hover:bg-primary/90 text-white hover:text-white"
                                  : "text-gray-700"
                              } block px-4 py-2 text-sm hover:bg-gray-100`}
                              onClick={() => closeDropdown("")}
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
        {/* data bottombar */}
        <div>
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
            <CardDescription className="m-1 mb-3  w-[170px] bg-white border shadow-md rounded-lg overflow-hidden transition-all ease-in-out duration-300 hover:shadow-xl">
              <div className="flex flex-row items-start gap-4 p-2">
                <Avatar>
                  <Link
                    href={`/profile/${user.user?.id}`}
                    className="flex items-center gap-2"
                  >
                    <AvatarImage
                      src={String(avatar === "" ? NoImage : avatar)}
                      alt="Channel Logo"
                    />
                    <AvatarFallback>
                      {user.user?.firstName.charAt(0)}
                    </AvatarFallback>
                  </Link>
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-md font-semibold">
                    <HoverComponent Num={10}>
                      {user.user?.lastName}
                      {user.user?.firstName}
                    </HoverComponent>
                  </h2>
                  <h2 className="text-xs font-semibold text-primary">
                    <HoverComponent Num={10}>
                      {
                        Role.find((role) => role.value === user?.user?.roleId)
                          ?.label
                      }
                    </HoverComponent>
                  </h2>
                </div>
              </div>
              <div className="px-2"></div>
              <div className="p-2 flex flex-col gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-gray-200/80 py-2"
                  onClick={handleLogout}
                >
                  <div className="w-full flex items-center gap-2 ml-2">
                    <LogOut className="h-[1.2rem] w-[1.2rem]" /> Đăng xuất
                  </div>
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-gray-200/80 py-2 "
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="w-full flex items-center gap-2  ml-2">
                        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        Chế độ
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
              </div>
            </CardDescription>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
