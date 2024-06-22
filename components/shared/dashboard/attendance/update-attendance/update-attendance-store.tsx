import {
  AttendanceDetailProductType,
  AttendanceDetailType,
} from "@/schema/attendance";
import { User } from "@/types/attendance.type";
import { create } from "zustand";

interface UpdateAttendanceStore {
  tableData: AttendanceDetailType[];
  setTableDataIndex: (index: number, data: AttendanceDetailType) => void;
  setTableData: (data: AttendanceDetailType[]) => void;
  handleAttendanceChange: (index: number, checked: boolean) => void;
  updateManufacture: (index: number, value: boolean) => void;
  updateSalaryByProduct: (index: number, value: boolean) => void;
  updateOverTime: (index: number, value: string) => void;
  updateQuantityOfProduct: (
    index: number,
    productIndex: number,
    value: string
  ) => void;
  addNewProduct: (index: number, product: AttendanceDetailProductType) => void;
  removeProduct: (index: number, productIndex: number) => void;
  user: User[];
  setUser: (data: User[]) => void;
  checkAllSalaryByProduct: (checked: boolean) => void;
  checkAllAttendance: (checked: boolean) => void;
}

export const useUpdateAttendanceStore = create<UpdateAttendanceStore>(
  (set) => ({
    tableData: [],
    setTableData: (data) => {
      set({ tableData: data });
    },
    setTableDataIndex: (index, data) => {
      set((state) => {
        const newData = [...state.tableData];
        newData[index] = data;
        return { tableData: newData };
      });
    },
    handleAttendanceChange: (index, checked) => {
      set((state) => {
        const newData = [...state.tableData];
        newData[index].isAttendance = checked;
        if (!checked) {
          newData[index].hourOverTime = "0";
        }
        return { tableData: newData };
      });
    },
    updateManufacture: (index, value) => {
      set((state) => {
        const newData = [...state.tableData];
        newData[index].isManufacture = value;
        if (!value) {
          newData[index].isSalaryByProduct = false;
        }
        return { tableData: newData };
      });
    },
    updateSalaryByProduct(index, value) {
      set((state) => {
        const newData = [...state.tableData];
        newData[index].isSalaryByProduct = value;
        return { tableData: newData };
      });
    },
    updateQuantityOfProduct(index, productIndex, value) {
      set((state) => {
        const newData = [...state.tableData];
        newData[index].products[productIndex].quantity = value;
        return { tableData: newData };
      });
    },
    addNewProduct(index, product) {
      set((state) => {
        const newData = [...state.tableData];
        newData[index].products.push(product);
        return { tableData: newData };
      });
    },
    removeProduct(index, productIndex) {
      set((state) => {
        const newData = [...state.tableData];
        newData[index].products.splice(productIndex, 1);
        return { tableData: newData };
      });
    },
    updateOverTime(index, value) {
      if (Number(value) < 0) {
        return;
      }
      set((state) => {
        const newData = [...state.tableData];
        newData[index].hourOverTime = value;
        return { tableData: newData };
      });
    },
    user: [],
    setUser: (data) => {
      set({ user: data });
    },
    checkAllSalaryByProduct: (checked) => {
      set((state) => {
        const newData = [...state.tableData];
        newData.forEach((item) => {
          item.isSalaryByProduct = checked;
        });
        return { tableData: newData };
      });
    },
    checkAllAttendance: (checked) => {
      set((state) => {
        const newData = [...state.tableData];
        newData.forEach((item) => {
          item.isAttendance = checked;
        });
        return { tableData: newData };
      });
    },
  })
);
