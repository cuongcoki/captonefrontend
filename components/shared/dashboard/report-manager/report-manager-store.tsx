import { CompanyResponse } from "@/types/company.type";
import { ReportType } from "@/types/report.type";
import { create } from "zustand";

type ReportStoreType = {
  tableData: ReportType[];
  setTableData: (data: ReportType[]) => void;
  force: number;
  ForceRender: () => void;
  companyData: CompanyResponse[];
  setCompanyData: (data: CompanyResponse[]) => void;
};

export const ReportManagerStore = create<ReportStoreType>((set) => ({
  tableData: [],
  setTableData: (data: ReportType[]) => set({ tableData: data }),
  force: 1,
  ForceRender: () => set((prev) => ({ force: prev.force + 1 })),
  companyData: [],
  setCompanyData: (data: CompanyResponse[]) => set({ companyData: data }),
}));
