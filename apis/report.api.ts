import axiosClient from "@/auth/jwtService";
import { endPointConstant } from "@/constants/endpoint";
import {
  CreateReportBody,
  GetReportsBody,
  GetReportsResponse,
} from "@/types/report.type";
import { SuccessResponse } from "@/types/util.type";

const cacheIds: Set<string> = new Set();

const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};

export const reportApi = {
  getReports: async (requestBody: GetReportsBody) => {
    const cacheId = createCacheId("search-reports", requestBody);
    cacheIds.add(cacheId);
    return axiosClient.get<GetReportsResponse>(
      `${endPointConstant.BASE_URL}/reports/search`,
      {
        params: requestBody,
        id: cacheId,
      }
    );
  },
  createReport: async (requestBody: CreateReportBody) => {
    const response = await axiosClient.post<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/reports`,
      requestBody,
      {
        cache: {
          update: () => {
            cacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            cacheIds.clear();
          },
        },
      }
    );
    return response;
  },
  updateReport: async (requestBody: CreateReportBody) => {
    const response = await axiosClient.put<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/reports`,
      requestBody,
      {
        cache: {
          update: () => {
            cacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            cacheIds.clear();
          },
        },
      }
    );
    return response;
  },
};
