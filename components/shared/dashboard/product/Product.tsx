"use client";
import HeaderComponent from "@/components/shared/common/header";
import RenderTableProduct from "./table/products/RenderTable";
import { CardTitle, Card } from "@/components/ui/card";

export default function ProductPage() {
  return (
    <div>
      <HeaderComponent
        title="Danh Sách Sản Phẩm"
        description="Danh sách sản phẩm của công ty."
      />
      <RenderTableProduct />
    </div>
  );
}
