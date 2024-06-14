import {
  AttendanceDetailProductType,
  AttendanceDetailType,
} from "@/schema/attendance";
import { create } from "zustand";

interface UpdateAttendanceStore {
  tableData: AttendanceDetailType[];
  setTableData: (data: AttendanceDetailType[]) => void;
  handleAttendanceChange: (index: number, checked: boolean) => void;
  updateManufacture: (index: number, value: boolean) => void;
  updateSalaryByProduct: (index: number, value: boolean) => void;
  updateQuantityOfProduct: (
    index: number,
    productIndex: number,
    value: string
  ) => void;
  addNewProduct: (index: number, product: AttendanceDetailProductType) => void;
  removeProduct: (index: number, productIndex: number) => void;
}

export const useUpdateAttendanceStore = create<UpdateAttendanceStore>(
  (set) => ({
    tableData: [],
    setTableData: (data) => {
      set({ tableData: data });
    },
    handleAttendanceChange: (index, checked) => {
      set((state) => {
        const newData = [...state.tableData];
        newData[index].isAttendance = checked ? "true" : "false";
        return { tableData: newData };
      });
    },
    updateManufacture: (index, value) => {
      set((state) => {
        const newData = [...state.tableData];
        newData[index].isManufacture = value ? "true" : "false";
        if (!value) {
          newData[index].isSalaryByProduct = "false";
        }
        return { tableData: newData };
      });
    },
    updateSalaryByProduct(index, value) {
      set((state) => {
        const newData = [...state.tableData];
        newData[index].isSalaryByProduct = value ? "true" : "false";
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
  })
);
