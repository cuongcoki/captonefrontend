"use client";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const selectStyle = "bg-[#83a8f1] text-white";
  return (
    <div className="overflow-auto">
      <Card className="w-[30%] mb-3 rounded-full">
        <div className="grid md:grid-cols-2 bg-white rounded-full p-1 ">
          <Link href={"/dashboard/material/history"}>
            <div
              className={`flex justify-center items-center h-10 rounded-full ${
                path === "/dashboard/material/history" ? selectStyle : ""
              }`}
            >
              <p>Lịch sử nhập</p>
            </div>
          </Link>

          <Link href={"/dashboard/material/manager"}>
            <div
              className={`flex justify-center items-center h-10 rounded-full ${
                path === "/dashboard/material/manager" ? selectStyle : ""
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
