import axiosClient from "@/auth/jwtService";
import { endPointConstant } from "@/constants/endpoint";
import {
  GetHistorySalaryParams,
  GetHistorySalaryResponse,
  GetPaidSalariesParams,
  GetPaidSalariesResponse,
  GetSalariesParams,
  GetSalariesResponse,
  GetSalaryDetailParams,
  GetSalaryDetailResponse,
  PaySalaryBody,
} from "@/types/salary.type";
import { get, request } from "http";
const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};
const salaryPayHistoryCacheIds: Map<string, string> = new Map();
export const salaryApi = {
  getHistorySalaryByDay: (requestParams: GetHistorySalaryParams) => {
    return axiosClient.get<GetHistorySalaryResponse>(
      `${endPointConstant.BASE_URL}/salary-histories/salaryByDay/${requestParams.userId}?pageIndex=${requestParams.pageIndex}&pageSize=${requestParams.pageSize}`
    );
  },
  getHistorySalaryOverTime: (requestParams: GetHistorySalaryParams) => {
    return axiosClient.get<GetHistorySalaryResponse>(
      `${endPointConstant.BASE_URL}/salary-histories/salaryOverTime/${requestParams.userId}?pageIndex=${requestParams.pageIndex}&pageSize=${requestParams.pageSize}`
    );
  },
  getSalaries: (requestParams: GetSalariesParams) => {
    return axiosClient.get<GetSalariesResponse>(
      `${endPointConstant.BASE_URL}/monthly-employee-salaries`,
      {
        params: requestParams,
      }
    );
  },
  getSalaryDetail: (requestParams: GetSalaryDetailParams) => {
    return axiosClient.get<GetSalaryDetailResponse>(
      `${endPointConstant.BASE_URL}/monthly-employee-salaries/${requestParams.userId}/${requestParams.month}/${requestParams.year}`
    );
  },
  getPaidSalaries: (requestParams: GetPaidSalariesParams) => {
    const cacheId = createCacheId("get-paid-salaries", requestParams);
    salaryPayHistoryCacheIds.set(requestParams.UserId, cacheId);
    return axiosClient.get<GetPaidSalariesResponse>(
      `${endPointConstant.BASE_URL}/paid-salaries/users/${requestParams.UserId}?pageIndex=${requestParams.PageIndex}&pageSize=${requestParams.PageSize}`,
      {
        id: cacheId,
      }
    );
  },
  paySalary: (requestBody: PaySalaryBody) => {
    return axiosClient.post(
      `${endPointConstant.BASE_URL}/paid-salaries`,
      requestBody,
      {
        cache: {
          update: () => {
            const cacheId = salaryPayHistoryCacheIds.get(requestBody.userId);
            if (cacheId) {
              axiosClient.storage.remove(cacheId);
              salaryPayHistoryCacheIds.delete(requestBody.userId);
            }
          },
        },
      }
    );
  },
  deletePaidSalary: (id: string) => {
    return axiosClient.delete(
      `${endPointConstant.BASE_URL}/paid-salaries/${id}`,
      {
        cache: {
          update: () => {
            salaryPayHistoryCacheIds.forEach((value, key) => {
              axiosClient.storage.remove(value);
              salaryPayHistoryCacheIds.delete(key);
            });
          },
        },
      }
    );
  },
};
