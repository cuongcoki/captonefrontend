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
        href1?:any;
        icon: LucideIcon;
        variant: "colorCompany" | "ghost";
    }[];
}

export function NavMobile({ links, isCollapsed }: NavProps) {
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
            {/* data sidebar */}
            <div className="group flex items-center justify-center gap-4 py-2 " >
                <nav className=" grid grid-cols-4 gap-4">
                    {links.map((link, index) =>
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
                                {link.title}
                            </TooltipContent>
                        </Tooltip>
                    )}
                </nav>
            </div>
        </TooltipProvider>
    );
}
