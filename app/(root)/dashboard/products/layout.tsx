"use client";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const selectStyle = "bg-[#22c55e] text-white";
  return (
    <div className="w-full min-h-[100vh] max-h-max">
      <Card className="w-[30%] mb-5 rounded-full">
        <div className="grid grid-cols-2 bg-white rounded-full p-1 min-w-max">
          <Link href={"/dashboard/products/product"}>
            <div
              className={`flex justify-center items-center h-10 rounded-full ${
                path.includes("/dashboard/products/product")
                  ? selectStyle
                  : "text-black"
              }`}
            >
              <p>Sản phẩm </p>
            </div>
          </Link>

          <Link href={"/dashboard/products/set"}>
            <div
              className={`flex justify-center items-center h-10 rounded-full ${
                path.includes("/dashboard/products/set")
                  ? selectStyle
                  : "text-black"
              }`}
            >
              <p>Bộ sản phẩm</p>
            </div>
          </Link>
        </div>
      </Card>
      {children}
    </div>
  );
}
