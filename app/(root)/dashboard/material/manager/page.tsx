"use client";
import { materialApi } from "@/apis/material.api";
import { columnsForMaterial } from "@/components/shared/dashboard/material/table/colums";
import { DataTableForMaterial } from "@/components/shared/dashboard/material/table/data-table";
import { Card, CardTitle } from "@/components/ui/card";
import { materialType } from "@/schema/material";
import React, { useEffect, useState } from "react";

type Props = {
  searchParams: { searchTerm: string; pageIndex: number };
};

export default function Page({ searchParams }: Props) {
  console.log("searchParams", searchParams.pageIndex);
  return (
    <Card className="p-2 h-max">
      <DataTableForMaterial
        columns={columnsForMaterial}
        pageIndexProp={searchParams.pageIndex}
        searchTermProp={searchParams.searchTerm}
      />
    </Card>
  );
}
