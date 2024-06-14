import { columnsForMaterialHistory } from "@/components/shared/dashboard/material-history/table/colums";
import { DataTableForMaterialHistory } from "@/components/shared/dashboard/material-history/table/data-table";
import { Card } from "@/components/ui/card";
import { materialHistoryType } from "@/schema/material";
import React from "react";

async function getData(): Promise<materialHistoryType[]> {
  return [];
}

export default async function page() {
  const data = await getData();
  return (
    <>
      <Card className="p-2">
        <DataTableForMaterialHistory
          columns={columnsForMaterialHistory}
          data={data}
        />
      </Card>
    </>
  );
}
