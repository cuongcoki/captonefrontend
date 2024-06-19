import {
  GetAllPhaseResponse,
  GetAllProductResponse,
  User,
} from "@/types/attendance.type";
import { create } from "zustand";

interface IAttendanceStore {
  listUser: User[];
  setListUser: (listUser: User[]) => void;
  listProduct: GetAllProductResponse;
  setListProduct: (listProduct: GetAllProductResponse) => void;
  listPhase: GetAllPhaseResponse;
  setListPhase: (listPhase: GetAllPhaseResponse) => void;
}

export const useAttendanceStore = create<IAttendanceStore>((set) => ({
  listUser: [],
  setListUser: (listUser) => set({ listUser }),
  listProduct: {
    data: {
      currentPage: 0,
      totalPages: 0,
      data: [
        {
          id: "",
          name: "",
          code: "",
          price: 0,
          size: "",
          description: "",
          isInProcessing: false,
          imageResponses: [],
        },
      ],
    },
    isSuccess: false,
    message: "",
    staus: 0,
  },
  setListProduct: (listProduct) => set({ listProduct }),
  listPhase: { isSuccess: false, message: "", staus: 0, data: [] },
  setListPhase: (listPhase) => set({ listPhase }),
}));
