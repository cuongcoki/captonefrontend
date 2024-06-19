"use client";
import { materialApi } from "@/apis/material.api";
import { columnsForMaterial } from "@/components/shared/dashboard/material/table/colums";
import { DataTableForMaterial } from "@/components/shared/dashboard/material/table/data-table";
import { Card } from "@/components/ui/card";
import { materialType } from "@/schema/material";
import React, { useEffect, useState } from "react";

type Props = {
  searchParams: { searchTerm: string; pageIndex: number };
};

export default function Page({ searchParams }: Props) {
  console.log("searchParams", searchParams.pageIndex);
  return (
    <div className="overflow-auto">
      <Card className="p-2">
        <DataTableForMaterial
          columns={columnsForMaterial}
          pageIndexProp={searchParams.pageIndex}
          searchTermProp={searchParams.searchTerm}
        />
      </Card>
    </div>
  );
}
