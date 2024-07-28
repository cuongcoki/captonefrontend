import { create } from "zustand";

type ShipmentStoreType = {
  force: number;
  ForceRender: () => void;
};

export const ShipmentStore = create<ShipmentStoreType>((set) => ({
  force: 0,
  ForceRender: () => set((state) => ({ force: state.force + 1 })),
}));
