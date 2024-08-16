import {
  ChangePhaseBody,
  ChangeQuantityTypeBody,
  SearchProductPhaseParams,
  SearchProductPhaseResponse,
} from "@/types/product-phase.type";
import axiosClient from "@/auth/jwtService";
import { endPointConstant } from "@/constants/endpoint";
import { cache } from "react";
import { updateCache } from "axios-cache-interceptor";
const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};
const listCacheId = new Set<string>();
export const productPhaseApi = {
  searchProductPhase: (requestParams: SearchProductPhaseParams) => {
    const cacheId = createCacheId("searchProductPhase", requestParams);
    listCacheId.add(cacheId);
    return axiosClient.get<SearchProductPhaseResponse>(
      `${endPointConstant.BASE_URL}/productphase`,
      {
        params: requestParams,
        cache: false,
      }
    );
  },

  changeQuantityType: (requestBody: ChangeQuantityTypeBody) => {
    return axiosClient.put(
      `${endPointConstant.BASE_URL}/productphase/changeQuantityType`,
      requestBody,
      {
        cache: {
          update: () => {
            listCacheId.forEach((id) => axiosClient.storage.remove(id));
            listCacheId.clear();
          },
        },
      }
    );
  },

  searchProductPhaseShip: (
    searchTerm?: string,
    companyId?: string,
    pageIndex: number = 1,
    pageSize: number = 10
  ) =>
    axiosClient.get(
      `${endPointConstant.BASE_URL}/productphase/search?Search=${searchTerm}&CompanyId=${companyId}&PageIndex=${pageIndex}&PageSize=${pageSize}`
    ),
};
