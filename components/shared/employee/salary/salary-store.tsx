import { CompanyResponse } from "@/types/company.type";
import { SalaryType } from "@/types/salary.type";
import { create } from "zustand";

interface ISalaryStore {
  tableData: SalaryType[];
  setTableData: (tableData: SalaryType[]) => void;
  companyData: CompanyResponse[];
  setCompanyData: (data: CompanyResponse[]) => void;
  force: number;
  forceRender: () => void;
  salaryAvailiable: number;
  setSalaryAvailiable: (salary: number) => void;
  changeSalaryAvailiable: (salary: number) => void;
}

export const salaryStore = create<ISalaryStore>((set) => ({
  tableData: [],
  setTableData: (tableData) => set({ tableData }),
  companyData: [],
  setCompanyData: (data: CompanyResponse[]) => set({ companyData: data }),
  force: 0,
  forceRender: () => set((prev) => ({ force: prev.force + 1 })),
  salaryAvailiable: 0,
  setSalaryAvailiable: (salary) => set({ salaryAvailiable: salary }),
  changeSalaryAvailiable: (salary) =>
    set((prev) => ({ salaryAvailiable: prev.salaryAvailiable - salary })),
}));
