import { create } from "zustand";

type OrderStoreType = {
  force: number;
  ForceRender: () => void;
};

export const OrderStore = create<OrderStoreType>((set) => ({
  force: 0,
  ForceRender: () => set((state) => ({ force: state.force + 1 })),
}));
