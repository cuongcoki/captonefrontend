import { SearchResponse } from "@/types/util.type";

export type SearchProductPhaseParams = {
  SearchCompany: string;
  SearchProduct: string;
  SearchPhase: string;
  PageIndex: number;
  PageSize: number;
};

export type ProductPhaseType = {
  companyId: string;
  companyName: string;
  productId: string;
  productName: string;
  productCode: string;
  imageUrl: string;
  phaseId: string;
  phaseName: string;
  phaseDescription: string;
  errorAvailableQuantity: number;
  availableQuantity: number;
  brokenAvailableQuantity: number;
  failureAvailabeQuantity: number;
};
export const ProductPhaseQuantityType: {
  [key: number]: keyof ProductPhaseType;
} = {
  0: "availableQuantity",
  1: "errorAvailableQuantity",
  2: "failureAvailabeQuantity",
  3: "brokenAvailableQuantity",
};

export type SearchProductPhaseResponse = SearchResponse<ProductPhaseType[]>;

export type ChangePhaseBody = {
  productId: string;
  phaseIdFrom: string;
  phaseIdTo: string;
  companyId: string;
  quantity: number;
};

export type ChangeQuantityTypeBody = {
  from: number;
  to: number;
  quantity: number;
  productId: string;
  phaseId: string;
  companyId: string;
};
