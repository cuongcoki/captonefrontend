"use client";
import RenderTableProduct from "./table/products/RenderTable";
import { CardTitle, Card } from "@/components/ui/card";

export default function ProductPage() {
  return (
    <Card className="w-full h-full">
      <CardTitle className="p-3 text-2xl text-primary font-medium">
        SẢN PHẨM
      </CardTitle>
      <RenderTableProduct />
    </Card>
  );
}
