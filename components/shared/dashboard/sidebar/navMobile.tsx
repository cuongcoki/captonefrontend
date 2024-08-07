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
import { useParams, usePathname, useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

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

export function NavMobile({ links, isCollapsed }: NavProps) {
    const pathname = usePathname();
    const [loading, setLoading] = useState<boolean>(false);
    // ** hooks
    const user = useAuth();
    const params = useParams<{ id: string }>();
    const router = useRouter();
    useEffect(() => { }, [params]);


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
    useEffect(() => { }, [checkActiveLink]);

    const userRoleId = user.user?.roleId;

    const checkAccess = (checkRoll: { id: number }[]) => {
        return checkRoll.some(item => item.id === userRoleId);
    };
    return (
        <TooltipProvider>
            {/* data sidebar */}
            <div className="group flex items-center justify-center gap-4 py-2 " >
                <nav className=" grid grid-cols-4 gap-4">
                    {links.map((link, index) => {
                        if (!checkAccess(link.checkRoll)) {
                            return null;
                        }

                        return (
                            <Tooltip key={index} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <div className="flex flex-col justify-center items-center">
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                buttonVariants({
                                                    variant:
                                                        link.href === pathname || link.href1 === pathname
                                                            ? "colorCompany"
                                                            : "ghost",
                                                    size: "icon",
                                                }),
                                                "h-9 w-9",
                                                link.variant === "colorCompany" &&
                                                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                                            )}
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <link.icon className="h-5 w-5" />
                                                <span className="sr-only">{link.title}</span>
                                            </div>
                                        </Link>
                                        <span className="text-xs text-center">{link.title}</span>
                                    </div>
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
                                                    className={`${pathname === linkCon.href
                                                        ? "bg-primary hover:bg-primary/90 text-white hover:text-white"
                                                        : "text-gray-700"
                                                        } p-1 text-sm hover:bg-gray-100`}
                                                >
                                                    <Link href={linkCon.href} className="flex items-center gap-2">
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
                        )
                    }

                    )}
                </nav>
            </div>
        </TooltipProvider>
    );
}
