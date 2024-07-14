"use client";
import { CardTitle, Card } from "@/components/ui/card";
import RenderTableSet from "./table/sets/RenderTable";
import HeaderComponent from "@/components/shared/common/header";

export default function SetPage() {
  return (
    <div className="!mb-15">
      {/* <Card> */}
      <HeaderComponent
        title="Danh Sách Bộ Sản Phẩm"
        description="Danh sách bộ sản phẩm trong công ty."
      />
      <RenderTableSet />
      {/* </Card> */}
    </div>
  );
}
