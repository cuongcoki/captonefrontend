import HeaderComponent from "@/components/shared/common/header";
import { DataTableForMaterialHistory } from "@/components/shared/dashboard/material-history/table/data-table";
import { Card } from "@/components/ui/card";
import { materialHistoryProp } from "@/types/material-history.type";
import React from "react";

type Props = {
  searchParams: materialHistoryProp;
};

export default async function page({ searchParams }: Props) {
  searchParams.pageIndex = searchParams.pageIndex || 1;
  searchParams.searchTerm = searchParams.searchTerm || "";
  searchParams.from = searchParams.from || "";
  searchParams.to = searchParams.to || "";
  return (
    <>
      <div className="p-2">
        <HeaderComponent
          title="Lịch sử nhập nguyên vật liệu"
          description="Lịch sử nhập nguyên vật liệu của công ty."
        />
        <DataTableForMaterialHistory searchParamsProp={searchParams} />
      </div>
    </>
  );
}
