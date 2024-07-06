import { ReportType } from "@/types/report.type";
import { create } from "zustand";

type ReportStoreType = {
  tableData: ReportType[];
  setTableData: (data: ReportType[]) => void;
  force: number;
  ForceRender: () => void;
};

export const ReportStore = create<ReportStoreType>((set) => ({
  tableData: [],
  setTableData: (data: ReportType[]) => set({ tableData: data }),
  force: 1,
  ForceRender: () => set((prev) => ({ force: prev.force + 1 })),
}));
