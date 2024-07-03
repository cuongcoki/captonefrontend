"use client";
import { CardTitle, Card } from "@/components/ui/card";
import RenderTableSet from "./table/sets/RenderTable";

export default function SetPage() {
  return (
    <Card className="">
      <CardTitle className="text-3xl text-[#22c55e] w-full text-center mb-3 font-semibold mt-5">
        DANH SÁCH BỘ SẢN PHẨM
      </CardTitle>
      <RenderTableSet />
    </Card>
  );
}
