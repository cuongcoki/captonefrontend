import axiosClient from "@/auth/jwtService";
import { endPointConstant } from "@/constants/endpoint";
import {
  CreateCompanyBody,
  GetCompanyByByTypeResponse,
  SearchCompanyBody,
  SearchCompanyResponse,
  UpdateCompanyBody,
} from "@/types/company.type";
import { get } from "http";

const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};
const cacheIds: Set<string> = new Set();
export const companyApi = {
  searchCompany: (requestBody: SearchCompanyBody) => {
    const cacheId = createCacheId("search-company", requestBody);
    cacheIds.add(cacheId); // Lưu cache ID
    return axiosClient.get<SearchCompanyResponse>(
      `${endPointConstant.BASE_URL}/companies`,
      {
        params: requestBody,
        id: cacheId,
      }
    );
  },
  createCompany: (requestBody: CreateCompanyBody) => {
    return axiosClient.post(
      `${endPointConstant.BASE_URL}/companies`,
      requestBody,
      {
        cache: {
          update: () => {
            cacheIds.forEach((id) => axiosClient.storage.remove(id));
            cacheIds.clear();
          },
        },
      }
    );
  },
  updateCompany: (id: string, requestBody: UpdateCompanyBody) => {
    return axiosClient.put(
      `${endPointConstant.BASE_URL}/companies`,
      requestBody,
      {
        cache: {
          update: () => {
            cacheIds.forEach((id) => axiosClient.storage.remove(id));
            cacheIds.clear();
          },
        },
      }
    );
  },
  getCompany: (id: string) => {
    const cacheId = `get-company-${id}`;
    cacheIds.add(cacheId); // Lưu cache ID
    return axiosClient.get(`${endPointConstant.BASE_URL}/companies/${id}`, {
      id: cacheId,
    });
  },
  getCompanyByType: (id: number) => {
    const cacheId = `get-company-by-type-${id}`;
    cacheIds.add(cacheId); // Lưu cache ID
    return axiosClient.get<GetCompanyByByTypeResponse>(
      `${endPointConstant.BASE_URL}/companies/CompanyType/${id}`,
      {
        id: cacheId,
      }
    );
  },
};
