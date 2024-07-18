import { SearchResponse, SuccessResponse } from "@/types/util.type";

export type SearchSalaryParams = {
  searchParams: {
    pageIndex: number;
    year: string;
    month: string;
    companyId: string;
    name: string;
  };
};

export type SalaryDetailParams = {
  year: string;
  month: string;
};

export type SalaryType = {
  id: string;
  userId: string;
  fullName: string;
  avatar: string;
  companyId: string;
  companyName: string;
  salary: number;
};

export type SearchSalaryResponse = {};

export type HistorySalaryType = {
  salary: number;
  startDate: string;
};

export type GetHistorySalaryParams = {
  userId: string;
  pageIndex: number;
  pageSize: number;
};

export type GetHistorySalaryResponse = SearchResponse<HistorySalaryType[]>;

export type GetSalariesParams = {
  fullName: string;
  month: number;
  year: number;
  PageIndex: number;
  PageSize: number;
};

export type GetSalariesResponse = SearchResponse<SalaryType[]>;

export type GetSalaryDetailParams = {
  userId: string;
  month: string;
  year: string;
};

type ProductWorkingResponses = {
  productId: string;
  productName: string;
  productImage: string;
  phaseId: string;
  phaseName: string;
  phaseDescription: string;
  quantity: number;
  salaryPerProduct: number;
};

export type SalaryDetailType = {
  month: number;
  year: number;
  accountBalance: number;
  totalWorkingDays: number;
  totalWorkingHours: number;
  totalSalaryProduct: number;
  productWorkingResponses: ProductWorkingResponses[];
};

export type GetSalaryDetailResponse = SuccessResponse<SalaryDetailType>;
