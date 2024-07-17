import { CompanyResponse } from "@/types/company.type";
import { SalaryType } from "@/types/salary.type";
import { table } from "console";
import { create } from "zustand";

interface ISalaryStore {
  tableData: SalaryType[];
  setTableData: (tableData: SalaryType[]) => void;
  companyData: CompanyResponse[];
  setCompanyData: (data: CompanyResponse[]) => void;
}

export const salaryStore = create<ISalaryStore>((set) => ({
  tableData: [],
  setTableData: (tableData) => set({ tableData }),
  companyData: [],
  setCompanyData: (data: CompanyResponse[]) => set({ companyData: data }),
}));
