"use client";
import RenderTableProduct from "./table/products/RenderTable";
import { CardTitle, Card } from "@/components/ui/card";

export default function ProductPage() {
  return (
    <Card>
      <CardTitle className="text-3xl text-[#22c55e] w-full text-center mb-3 font-semibold mt-5">
        SẢN PHẨM
      </CardTitle>
      <RenderTableProduct />
    </Card>
  );
}
