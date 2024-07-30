import { SalaryCompanyType } from "@/types/salary-company.type";
import { create } from "zustand";

interface ISalaryStore {
  tableData: SalaryCompanyType[];
  setTableData: (tableData: SalaryCompanyType[]) => void;
  force: number;
  forceRender: () => void;
  salaryAvailiable: number;
  setSalaryAvailiable: (salary: number) => void;
  changeSalaryAvailiable: (salary: number) => void;
}

export const salaryCompanyStore = create<ISalaryStore>((set) => ({
  tableData: [],
  setTableData: (tableData) => set({ tableData }),
  force: 0,
  forceRender: () => set((prev) => ({ force: prev.force + 1 })),
  salaryAvailiable: 0,
  setSalaryAvailiable: (salary) => set({ salaryAvailiable: salary }),
  changeSalaryAvailiable: (salary) =>
    set((prev) => ({ salaryAvailiable: prev.salaryAvailiable - salary })),
}));
