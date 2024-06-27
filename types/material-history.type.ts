export type materialHistoryProp = {
  searchTerm: string;
  pageIndex: number;
  from: string;
  to: string;
};

export type materialHistoryType = {
  id: string;
  materialId: string;
  quantity: number;
  price: number;
  description: string;
  image: string;
  materialName: string;
  materialUnit: number;
  importDate: string;
};

export type SearchMaterialHistoryBody = {
  SearchTerms: string;
  PageIndex: number;
  PageSize: number;
  StartDateImport: string;
  EndDateImport: string;
};

export type AddMaterialHistoryBody = {
  materialId: string;
  quantity: string;
  price: string;
  description: string;
  importDate: string;
};

export type UpdateMaterialHistoryType = {
  id: string;
  materialId: string;
  quantity: number;
  price: number;
  description: string;
  importDate: string;
};
