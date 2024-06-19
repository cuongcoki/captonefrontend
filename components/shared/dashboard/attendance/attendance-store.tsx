import { User } from "@/types/attendance.type";
import { create } from "zustand";

interface IAttendanceStore {
  listUser: User[];
  setListUser: (listUser: User[]) => void;
}

export const useAttendanceStore = create<IAttendanceStore>((set) => ({
  listUser: [],
  setListUser: (listUser) => set({ listUser }),
}));
