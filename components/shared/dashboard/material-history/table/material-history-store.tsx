import { ComboboxDataType } from "@/components/shared/common/combobox/combobox-for-form";
import { create } from "zustand";

type MaterialHistoryStore = {
  listMaterial: ComboboxDataType[];
  setListMaterial: (listMaterial: ComboboxDataType[]) => void;
};

export const useMaterialHistoryStore = create<MaterialHistoryStore>((set) => ({
  listMaterial: [],
  setListMaterial: (listMaterial) => set({ listMaterial }),
}));
