import {
  ChangePhaseBody,
  ChangeQuantityTypeBody,
  SearchProductPhaseParams,
  SearchProductPhaseResponse,
} from "@/types/product-phase.type";
import axiosClient from "@/auth/jwtService";
import { endPointConstant } from "@/constants/endpoint";
const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};
const listCacheId = new Set<string>();
export const productPhaseApi = {
  searchProductPhase: (requestParams: SearchProductPhaseParams) => {
    const cacheId = createCacheId("searchProductPhase", requestParams);
    return axiosClient.get<SearchProductPhaseResponse>(
      `${endPointConstant.BASE_URL}/productphase`,
      {
        params: requestParams,
        id: cacheId,
      }
    );
  },
  changePhase: (requestBody: ChangePhaseBody) => {
    return axiosClient.put(
      `${endPointConstant.BASE_URL}/productphase/changePhase`,
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
  changeQuantityType: (requestBody: ChangeQuantityTypeBody) => {
    return axiosClient.put(
      `${endPointConstant.BASE_URL}/productphase/changeQuantityType`,
      requestBody
    );
  },
};
