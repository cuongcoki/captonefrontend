 "use client"
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from 'next/navigation'
export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    return (
        <div className="h-screen w-full flex flex-col gap-6 ">
            <div className="bg-white ">
                <div className="p-3 space-x-3 flex">
                    <div>
                        <Link href="/dashboard/products/product" >
                            Sản phẩm
                        </Link>
                        <Separator className={pathname.includes('/dashboard/products/product') ? 'bg-primary-backgroudPrimary text-white h-1 ' : 'hidden'} />
                    </div>
                    <div>
                        <Link href="/dashboard/products/set" >
                            Bộ sản phẩm
                        </Link>
                        <Separator className={pathname.includes('/dashboard/products/set') ? 'bg-primary-backgroudPrimary text-white h-1 ' : 'hidden'} />
                    </div>

                </div>
            </div>
            {children}
        </div>
    );
}