import { create } from "zustand";

type ShipmentStoreType = {
  force: number;
  ForceRender: () => void;
  forceForShipmentDetail: number;
  ForceRenderForShipmentDetail: () => void;
};

export const ShipmentStore = create<ShipmentStoreType>((set) => ({
  force: 0,
  ForceRender: () => set((state) => ({ force: state.force + 1 })),
  forceForShipmentDetail: 0,
  ForceRenderForShipmentDetail: () =>
    set((state) => ({
      forceForShipmentDetail: state.forceForShipmentDetail + 1,
    })),
}));
