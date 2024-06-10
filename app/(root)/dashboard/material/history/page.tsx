import { columnsForMaterialHistory } from "@/components/shared/dashboard/material-history/table/colums";
import { DataTableForMaterialHistory } from "@/components/shared/dashboard/material-history/table/data-table";
import { Card } from "@/components/ui/card";
import { materialHistoryType } from "@/schema/material";
import React from "react";

async function getData(): Promise<materialHistoryType[]> {
  return [
    {
      materialHistoryID: "1",
      materialID: "4",
      quantity: "120",
      price: "250", // Changed to string
      importAt: "04/06/2024", // Changed format
      importBy: "User D",
      material: {
        materialID: "4",
        image: "https://via.placeholder.com/150",
        name: "Material 4",
        unit: "piece",
        quantityPerUnit: "15",
        description: "This is material 4",
      },
    },
    {
      materialHistoryID: "2",
      materialID: "3",
      quantity: "110",
      price: "230", // Changed to string
      importAt: "03/06/2024", // Changed format
      importBy: "User C",
      material: {
        materialID: "3",
        image: "https://via.placeholder.com/150",
        name: "Material 3",
        unit: "piece",
        quantityPerUnit: "10",
        description: "This is material 3",
      },
    },
    {
      materialHistoryID: "3",
      materialID: "1",
      quantity: "100",
      price: "220", // Changed to string
      importAt: "01/06/2024", // Changed format
      importBy: "User A",
      material: {
        materialID: "1",
        image: "https://via.placeholder.com/150",
        name: "Material 1",
        unit: "piece",
        quantityPerUnit: "10",
        description: "This is material 1",
      },
    },
    {
      materialHistoryID: "4",
      materialID: "2",
      quantity: "105",
      price: "240", // Changed to string
      importAt: "02/06/2024", // Changed format
      importBy: "User B",
      material: {
        materialID: "2",
        image: "https://via.placeholder.com/150",
        name: "Material 2",
        unit: "piece",
        quantityPerUnit: "12",
        description: "This is material 2",
      },
    },
    {
      materialHistoryID: "5",
      materialID: "5",
      quantity: "130",
      price: "270", // Changed to string
      importAt: "05/06/2024", // Changed format
      importBy: "User E",
      material: {
        materialID: "5",
        image: "https://via.placeholder.com/150",
        name: "Material 5",
        unit: "piece",
        quantityPerUnit: "18",
        description: "This is material 5",
      },
    },
    {
      materialHistoryID: "6",
      materialID: "6",
      quantity: "140",
      price: "300", // Changed to string
      importAt: "06/06/2024", // Changed format
      importBy: "User F",
      material: {
        materialID: "6",
        image: "https://via.placeholder.com/150",
        name: "Material 6",
        unit: "piece",
        quantityPerUnit: "20",
        description: "This is material 6",
      },
    },
    {
      materialHistoryID: "7",
      materialID: "7",
      quantity: "150",
      price: "320", // Changed to string
      importAt: "07/06/2024", // Changed format
      importBy: "User G",
      material: {
        materialID: "7",
        image: "https://via.placeholder.com/150",
        name: "Material 7",
        unit: "piece",
        quantityPerUnit: "22",
        description: "This is material 7",
      },
    },
    {
      materialHistoryID: "8",
      materialID: "8",
      quantity: "160",
      price: "340", // Changed to string
      importAt: "08/06/2024", // Changed format
      importBy: "User H",
      material: {
        materialID: "8",
        image: "https://via.placeholder.com/150",
        name: "Material 8",
        unit: "piece",
        quantityPerUnit: "25",
        description: "This is material 8",
      },
    },
    {
      materialHistoryID: "9",
      materialID: "9",
      quantity: "170",
      price: "360", // Changed to string
      importAt: "09/06/2024", // Changed format
      importBy: "User I",
      material: {
        materialID: "9",
        image: "https://via.placeholder.com/150",
        name: "Material 9",
        unit: "piece",
        quantityPerUnit: "30",
        description: "This is material 9",
      },
    },
    {
      materialHistoryID: "10",
      materialID: "10",
      quantity: "180",
      price: "380", // Changed to string
      importAt: "10/06/2024", // Changed format
      importBy: "User J",
      material: {
        materialID: "10",
        image: "https://via.placeholder.com/150",
        name: "Material 10",
        unit: "piece",
        quantityPerUnit: "35",
        description: "This is material 10",
      },
    },
    {
      materialHistoryID: "11",
      materialID: "11",
      quantity: "190",
      price: "400", // Changed to string
      importAt: "11/06/2024", // Changed format
      importBy: "User K",
      material: {
        materialID: "11",
        image: "https://via.placeholder.com/150",
        name: "Material 11",
        unit: "piece",
        quantityPerUnit: "40",
        description: "This is material 11",
      },
    },
  ];
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
