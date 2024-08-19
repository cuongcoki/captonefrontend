import { materialApi } from "@/apis/material.api";
import { materialType } from "@/schema/material";
import { create } from "zustand";

interface MaterialStore {
  materialData: materialType[];
  totalPage: number;
  pageIndex: number;
  searchTerm: string;
  setMaterialData: (materialData: materialType[]) => void;
  setTotalPage: (totalPage: number) => void;
  setPageIndex: (pageIndex: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  getData: (searchTerm: string, pageIndex: number) => void;
}

export const useMaterialStore = create<MaterialStore>((set) => ({
  materialData: [],
  totalPage: 1,
  pageIndex: 1,
  searchTerm: "",
  setMaterialData: (materialData: materialType[]) => set({ materialData }),
  setTotalPage: (totalPage: number) => set({ totalPage }),
  setPageIndex: (pageIndex: number) => set({ pageIndex }),
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  getData: (searchTerm: string, pageIndex: number) => {
    // console.log("getData", searchTerm, pageIndex);
    try {
      materialApi
        .searchMaterial({
          SearchTerm: searchTerm,
          IsInProcessing: true,
          pageIndex: pageIndex,
          pageSize: 10,
        })
        .then(({ data }) => {
          set((state) => ({
            data: data.data.data,
            totalPage: data.data.totalPages,
          }));
        });
    } catch (error) {
      // console.log(error);
    }
  },
}));
