import HeaderComponent from "@/components/shared/common/header";
import { columnsForMaterialHistory } from "@/components/shared/dashboard/material-history/table/colums";
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
          title="Lịch Sử Nhập Nguyên Vật Liệu"
          description="Danh sách lịch sử nhập nguyên vật liệu trong công ty."
        />
        <DataTableForMaterialHistory
          columns={columnsForMaterialHistory}
          searchParamsProp={searchParams}
        />
      </div>
    </>
  );
}
