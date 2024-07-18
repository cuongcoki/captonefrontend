"use client";
import HeaderComponent from "@/components/shared/common/header";
import RenderTableProduct from "./table/products/RenderTable";
import { CardTitle, Card } from "@/components/ui/card";

export default function ProductPage() {
  return (
    <div>
      <HeaderComponent
        title="Danh sách sản phẩm"
        description="Danh sách tất cả sản phẩm có trong công ty."
      />
      <RenderTableProduct />
    </div>
  );
}