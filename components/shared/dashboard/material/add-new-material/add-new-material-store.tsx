import { create } from "zustand";

type AddNewMaterialStoreType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  handleDialog: (value: boolean) => void;
  setHandleDialog: (newHandleDialog: () => void) => void;
};

export const AddNewMaterialStore = create<AddNewMaterialStoreType>((set) => ({
  isOpen: false,
  setIsOpen: (value: boolean) => set({ isOpen: value }),
  handleDialog: (value: boolean) => set({ isOpen: value }),
  setHandleDialog: (newHandleDialog: () => void) =>
    set({ handleDialog: newHandleDialog }),
}));
