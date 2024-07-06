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
  updateReport: (index: number, status: number, replyMessage: string) => void;
};

export const ReportManagerStore = create<ReportStoreType>((set) => ({
  tableData: [],
  setTableData: (data: ReportType[]) => {
    console.log("Set Table Data", data);
    set({ tableData: data });
  },
  force: 1,
  ForceRender: () => set((prev) => ({ force: prev.force + 1 })),
  companyData: [],
  setCompanyData: (data: CompanyResponse[]) => set({ companyData: data }),
  updateReport: (index, status, replyMessage) => {
    set((prev) => {
      const newTableData = [...prev.tableData];
      newTableData[index].status = status;
      newTableData[index].replyMessage = replyMessage;
      return { tableData: newTableData };
    });
  },
}));
