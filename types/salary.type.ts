import { SearchResponse } from "@/types/util.type";

export type SearchSalaryParams = {
  searchParams: {
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
  salaryId: string;
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
