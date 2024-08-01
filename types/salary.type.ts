import { SearchResponse, SuccessResponse } from "@/types/util.type";

export type SearchSalaryParams = {
  searchParams: {
    pageIndex: number;
    year: string;
    month: string;
    companyId: string;
    searchUser: string;
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
  accountBalance: number;
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
  searchUser: string;
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
  salary: number;
  accountBalance: number;
  totalWorkingDays: number;
  totalWorkingHours: number;
  totalSalaryProduct: number;
  rate: number;
  rateOverTime: number;
  rateWorkingDay: number;
  productWorkingResponses: ProductWorkingResponses[];
};

export type GetSalaryDetailResponse = SuccessResponse<SalaryDetailType>;

export type PaySalaryBody = {
  userId: string;
  salary: number;
  note: string;
};

export type GetPaidSalariesParams = {
  UserId: string;
  PageIndex: number;
  PageSize: number;
};

export type SalaryHistoryType = {
  id: string;
  userId: string;
  salary: number;
  note: string;
  createdAt: string;
};

export type GetPaidSalariesResponse = SearchResponse<SalaryHistoryType[]>;
