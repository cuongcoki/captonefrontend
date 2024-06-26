"use client";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const selectStyle = "bg-[#22c55e] text-white";
  return (
    <div className="w-full h-screen">
      <Card className="w-[30%] mb-3 rounded-full">
        <div className="grid grid-cols-2 bg-white rounded-full p-1 min-w-max">
          <Link href={"/dashboard/material/history"}>
            <div
              className={`flex justify-center items-center h-10 rounded-full ${
                path === "/dashboard/material/history"
                  ? selectStyle
                  : "text-black"
              }`}
            >
              <p>Lịch sử nhập</p>
            </div>
          </Link>

          <Link href={"/dashboard/material/manager"}>
            <div
              className={`flex justify-center items-center h-10 rounded-full ${
                path === "/dashboard/material/manager"
                  ? selectStyle
                  : "text-black"
              }`}
            >
              <p>Nguyên vật liệu</p>
            </div>
          </Link>
        </div>
      </Card>
      {children}
    </div>
  );
}
