import { ComboboxDataType } from "@/components/shared/common/combobox/combobox-for-form";
import { PhaseType } from "@/types/attendance.type";
import {
  ProductPhaseQuantityType,
  ProductPhaseType,
} from "@/types/product-phase.type";
import { create } from "zustand";

type ProductPhaseStore = {
  tableData: ProductPhaseType[];
  setTableData: (data: ProductPhaseType[]) => void;
  companyData: ComboboxDataType[];
  setCompanyData: (data: ComboboxDataType[]) => void;
  changeQuantityType: (
    index: number,
    from: number,
    to: number,
    quantity: number
  ) => void;
  force: number;
  ForceRender: () => void;
  phaseData: PhaseType[];
  setPhaseData: (data: PhaseType[]) => void;
};

export const productPhaseStore = create<ProductPhaseStore>((set, get) => ({
  tableData: [],
  setTableData: (data) => set({ tableData: data }),
  changeQuantityType: (index, from, to, quantity) => {
    const { tableData } = get();
    if (index < 0 || index >= tableData.length) {
      console.error("Invalid index");
      return;
    }
    const fromKey = ProductPhaseQuantityType[from];
    const toKey = ProductPhaseQuantityType[to];

    if (!fromKey || !toKey) {
      console.error("Invalid quantity type");
      return;
    }

    const newData = [...tableData];
    const fromQuantity = Number(newData[index][fromKey]);
    const toQuantity = Number(newData[index][toKey]);

    if (fromQuantity < quantity) {
      console.error("Not enough quantity to transfer");
      return;
    }

    newData[index] = {
      ...newData[index],
      [fromKey]: fromQuantity - quantity,
      [toKey]: toQuantity + quantity,
    };

    set({ tableData: newData });
  },
  companyData: [],
  setCompanyData: (data) => set({ companyData: data }),
  force: 0,
  ForceRender: () => {
    set((prev) => ({ force: prev.force + 1 }));
  },
  phaseData: [],
  setPhaseData: (data) => set({ phaseData: data }),
}));
