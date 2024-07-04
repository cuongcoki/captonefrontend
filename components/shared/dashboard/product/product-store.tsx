import { create } from "zustand";

type ProductStoreType = {
  force: number;
  ForceRender: () => void;
};

export const ProductStore = create<ProductStoreType>((set) => ({
  force: 0,
  ForceRender: () => set((state) => ({ force: state.force + 1 })),
}));
