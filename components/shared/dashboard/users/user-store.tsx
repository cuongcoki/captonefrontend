import { create } from "zustand";

type UserStoreType = {
  forceForUserDetail: number;
  ForceRenderForUserDetai: () => void;
};

export const UserStore = create<UserStoreType>((set) => ({
  forceForUserDetail: 0,
  ForceRenderForUserDetai: () =>
    set((state) => ({ forceForUserDetail: state.forceForUserDetail + 1 })),
}));
