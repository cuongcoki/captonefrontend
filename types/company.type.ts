import { SearchResponse, SuccessResponse } from "@/types/util.type";

export type CompanyParams = {
  searchParams: {
    name: string;
    companyType: string;
    pageIndex: number;
  };
};
export type CompanyRequest = {
  name: string;
  address: string;
  directorName: string;
  directorPhone: string;
  email: string;
  companyType: number;
};

export type CompanyResponse = {
  id: string;
  name: string;
  address: string;
  directorName: string;
  directorPhone: string;
  email: string;
  companyEnum: string;
  companyType: number;
  companyTypeDescription: string;
};

export type SearchCompanyBody = {
  Name: string;
  Address: string;
  PhoneNumber: string;
  Email: string;
  DirectorName: string;
  CompanyType: string;
  PageIndex: number;
  PageSize: number;
};
export type SearchCompanyResponse = SearchResponse<CompanyResponse[]>;

export type CreateCompanyBody = {
  companyRequest: CompanyRequest;
};

export type UpdateCompanyBody = {
  id: string;
  companyRequest: CompanyRequest;
};

export type GetCompanyResponse = SuccessResponse<CompanyResponse>;

export type GetCompanyByByTypeResponse = SuccessResponse<CompanyResponse[]>;
