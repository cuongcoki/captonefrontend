"use client";
import { materialApi } from "@/apis/material.api";
import DragAndDropFile from "@/components/shared/common/input/drag&drop-file/drag&drop-file";
import { columnsForMaterial } from "@/components/shared/dashboard/material/table/colums";
import { DataTableForMaterial } from "@/components/shared/dashboard/material/table/data-table";
import { Card } from "@/components/ui/card";
import { materialType } from "@/schema/material";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [dataMaterial, setDataMaterail] = useState<materialType[]>([]);

  useEffect(() => {
    materialApi
      .searchMaterial({
        serachTerm: "",
        pageIndex: 1,
        pageSize: 10,
      })
      .then(({ data }) => {
        setDataMaterail(data.data.data);
        console.log(data.data.data);
      });
  }, []);

  return (
    <div className="overflow-auto">
      <Card className="p-2">
        <DataTableForMaterial
          columns={columnsForMaterial}
          data={dataMaterial}
        />
      </Card>
    </div>
  );
}
