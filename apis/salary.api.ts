import axiosClient from "@/auth/jwtService";
import { endPointConstant } from "@/constants/endpoint";
import {
  GetHistorySalaryParams,
  GetHistorySalaryResponse,
  GetSalariesParams,
  GetSalariesResponse,
  GetSalaryDetailParams,
} from "@/types/salary.type";
import { get, request } from "http";

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
    return axiosClient.get(
      `${endPointConstant.BASE_URL}/monthly-employee-salaries/${requestParams.userId}/${requestParams.month}/${requestParams.year}`
    );
  },
};
