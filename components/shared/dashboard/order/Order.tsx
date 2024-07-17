"use client";

import { CardTitle, Card } from "@/components/ui/card";
import RenderTableOrder from "./table/RenderTable";
import HeaderComponent from "@/components/shared/common/header";

export default function OrderPage() {
  return (
    <div className="w-full h-full">
      <div className="!mb-15">
        <HeaderComponent
          title="Quản lý đơn hàng"
          description="Danh sách đơn hàng trong công ty."
        />
        <RenderTableOrder />
      </div>
    </div>
  );
}
