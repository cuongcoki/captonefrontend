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
import { useParams, usePathname, useRouter } from "next/navigation";
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
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/apis/auth.api";
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
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(false);
  // ** hooks
  const user = useAuth();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  useEffect(() => {}, [params]);
  // console.log("sidebarrrrrrrrrrrrrrrrrrrr", params)
  // console.log("pathnamepathname", pathname)
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
    console.log("nameLink", nameLink);
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
      (link.hrefCon &&
        link.hrefCon.some((hrefCon: any) => pathname === hrefCon.href)) ||
      pathname.includes(`${link.href}/${params.id}`) ||
      pathname.includes(`${link.href1}/${params.id}`)
    );
  };
  useEffect(() => {}, [checkActiveLink]);

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
                        variant: checkActiveLink(link)
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
              <div key={index}>
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({
                      variant: checkActiveLink(link) ? "colorCompany" : "ghost",
                      size: "sm",
                    }),
                    link.variant === "colorCompany" &&
                      "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                    "justify-start"
                  )}
                >
                  <link.icon className="mr-2 h-5 w-5" />
                  {link.href1 ? (
                    <span
                      className="flex justify-between w-full"
                      onClick={(event) =>
                        toggleDropdown(link.href1, link.hrefCon, event)
                      }
                    >
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
                      {getNameLink.map((item) => (
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
            )
          )}
        </nav>
      </div>
      {/* data bottombar */}
    </TooltipProvider>
  );
}
