"use client";
import { CardTitle, Card } from "@/components/ui/card";
import RenderTableSet from "./table/sets/RenderTable";
import HeaderComponent from "@/components/shared/common/header";

export default function SetPage() {
  return (
    <div className="!mb-15">
      <HeaderComponent
        title="Danh sách bộ sản phẩm"
        description="Danh sách tất cả bộ sản phẩm có trong công ty."
      />
      <RenderTableSet />
    </div>
  );
}