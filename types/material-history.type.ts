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
  quantityPerUnit: number;
  price: number;
  description: string;
  quantityInStock: number;
  image: string;
  materialName: string;
  materialUnit: number;
};

export type SearchMaterialHistoryBody = {
  SearchTerms: string;
  PageIndex: number;
  PageSize: number;
  DateImport: string;
};
