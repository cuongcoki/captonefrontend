import axiosClient from "@/auth/jwtService";
import { endPointConstant } from "@/constants/endpoint";
import {
  GetHistorySalaryParams,
  GetHistorySalaryResponse,
} from "@/types/salary.type";
import { get } from "http";

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
};
