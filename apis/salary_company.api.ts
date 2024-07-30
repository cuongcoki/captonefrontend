import axiosClient from "@/auth/jwtService";
import { endPointConstant } from "@/constants/endpoint";
import {
  GetSalaryCompanyDetailParams,
  GetSalaryCompanyDetailResponse,
  SearchSalaryCompanyParams,
  SearchSalaryCompanyResponse,
  UpdateStatusSalaryCompanyBody,
} from "@/types/salary-company.type";

const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};
const salaryPayHistoryCacheIds: Map<string, string> = new Map();
export const salaryCompanyApi = {
  searchSalaryCompany: (requestParams: SearchSalaryCompanyParams) => {
    return axiosClient.get<SearchSalaryCompanyResponse>(
      `${endPointConstant.BASE_URL}/monthly-company-salaries`,
      {
        params: requestParams,
      }
    );
  },
  getSalaryCompanyDetail: (requestParams: GetSalaryCompanyDetailParams) => {
    return axiosClient.get<GetSalaryCompanyDetailResponse>(
      `${endPointConstant.BASE_URL}/monthly-company-salaries/detail`,
      {
        params: requestParams,
      }
    );
  },
  updateStatusSalaryCompany: (requestBody: UpdateStatusSalaryCompanyBody) => {
    return axiosClient.put(
      `${endPointConstant.BASE_URL}/monthly-company-salaries`,
      requestBody
    );
  },
};
