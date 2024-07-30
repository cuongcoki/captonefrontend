import { SearchResponse, SuccessResponse } from "@/types/util.type";

export type SearchSalaryCompanyParams = {
  SearchCompany: string;
  Month: string;
  Year: string;
  PageIndex: number;
  PageSize: number;
};

export type SalaryCompanyType = {
  id: string;
  companyId: string;
  companyName: string;
  directorName: string;
  salary: number;
  status: number;
  note: string;
};

export type SearchSalaryCompanyResponse = SearchResponse<SalaryCompanyType[]>;

export type GetSalaryCompanyDetailParams = {
  CompanyId: string;
  Month: string;
  Year: string;
};

export type SalaryCompanyDetailType = {
  companyId: string;
  month: number;
  year: number;
  salary: number;
  status: number;
  note: string;
  totalSalaryProduct: number;
  totalSalaryMaterial: number;
  totalSalaryBroken: number;
  totalSalaryTotal: number;
  totalProduct: number;
  totalMaterial: number;
  totalBroken: number;
  rateProduct: number;
  rateBroken: number;
  materialResponses: [];
  productExportResponses: [];
  productBrokenResponses: [];
};

export type GetSalaryCompanyDetailResponse =
  SuccessResponse<SalaryCompanyDetailType>;

export type UpdateStatusSalaryCompanyBody = {
  companyId: string;
  month: number;
  year: number;
  status: number;
  note: string;
};
