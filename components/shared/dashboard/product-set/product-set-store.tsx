import { create } from "zustand";

type ProductSetStoreType = {
  force: number;
  ForceRender: () => void;
};

export const ProductSetStore = create<ProductSetStoreType>((set) => ({
  force: 0,
  ForceRender: () => set((state) => ({ force: state.force + 1 })),
}));
