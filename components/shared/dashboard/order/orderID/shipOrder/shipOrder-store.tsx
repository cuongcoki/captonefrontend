import { create } from "zustand";

type ShipOrderStoreType = {
  force: number;
  ForceRender: () => void;
};

export const ShipOrderStore = create<ShipOrderStoreType>((set) => ({
  force: 0,
  ForceRender: () => set((state) => ({ force: state.force + 1 })),
}));
