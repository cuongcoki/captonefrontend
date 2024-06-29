import { CompanyResponse } from "@/types/company.type";
import { table } from "console";
import { create } from "zustand";

interface ICompanyStore {
  tableData: CompanyResponse[];
  setTableData: (tableData: CompanyResponse[]) => void;
  setTableDataIndex: (index: number, data: CompanyResponse) => void;
}

export const companyStore = create<ICompanyStore>((set) => ({
  tableData: [],
  setTableData: (tableData) => set({ tableData }),
  setTableDataIndex: (index, data) => {
    set((state) => {
      const newData = [...state.tableData];
      newData[index] = data;
      return { tableData: newData };
    });
  },
}));
