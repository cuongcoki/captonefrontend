"use client";

import { Drawer } from "vaul";
import SideNavbar from "../shared/dashboard/sidebar/SideNavbar";
import { LogoIcon } from "@/constants/images";
import Image from "next/image";
import { Divide } from "lucide-react";

export function MyDrawer() {
    return (
        <Drawer.Root direction="left">
            <Drawer.Trigger asChild>
                <button>
                    <div className=" flex items-center space-x-2 px-3  sm:hidden">
                        <Image
                            src={LogoIcon}
                            alt="Logo Tien Huy"
                            className="w-[30px] h-[30px]"
                        />
                        <span className="text-sm">Tiến Huy</span>
                    </div>
                </button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[80px] mt-24 fixed bottom-0 left-0">
                    <SideNavbar />
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
