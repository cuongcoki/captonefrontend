import {
  AddMaterialHistoryBody,
  SearchMaterialHistoryBody,
  UpdateMaterialHistoryType,
  materialHistoryType,
} from "@/types/material-history.type";
import axiosClient from "../auth/jwtService";

import { endPointConstant } from "@/constants/endpoint";
import { SearchResponse, SuccessResponse } from "@/types/util.type";

// ** Function to create unique cache ID
const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};

// ** Store for cache IDs
const cacheIds: Set<string> = new Set();
const materialHistoryCacheIds: Map<string, string> = new Map();

export const materiaHistoryApi = {
  searchMaterialHistory: (requestBody: SearchMaterialHistoryBody) => {
    const cacheId = createCacheId("search-material-history", requestBody);
    cacheIds.add(cacheId); // Lưu cache ID
    console.log("Added cacheId:", cacheId); // Log cache ID khi thêm
    return axiosClient.get<SearchResponse<materialHistoryType[]>>(
      `${endPointConstant.BASE_URL}/material-history`,
      {
        params: requestBody,
        id: cacheId,
      }
    );
  },
  addMaterialHistory: (requestBody: AddMaterialHistoryBody) => {
    return axiosClient.post<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/material-history`,
      requestBody,
      {
        cache: {
          update: () => {
            // Xóa tất cả cache ID của searchMaterialHistory
            cacheIds.forEach((id) => axiosClient.storage.remove(id));
            cacheIds.clear(); // Xóa danh sách cache ID sau khi xóa
          },
        },
      }
    );
  },
  getMaterialHistory: (id: string) => {
    const cacheId = `get-material-history-${id}`;
    materialHistoryCacheIds.set(id, cacheId); // Lưu cache ID với ID của material history
    console.log("Added materialHistoryCacheId:", cacheId); // Log cache ID khi thêm
    return axiosClient.get<SuccessResponse<materialHistoryType>>(
      `${endPointConstant.BASE_URL}/material-history/${id}`,
      {
        id: cacheId,
      }
    );
  },
  updateMaterialHistory: (requestBody: UpdateMaterialHistoryType) => {
    return axiosClient.put<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/material-history`,
      requestBody,
      {
        cache: {
          update: () => {
            cacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            cacheIds.clear(); // Xóa danh sách cache ID sau khi xóa

            // Xóa cache ID của getMaterialHistory có cùng ID
            const materialHistoryCacheId = materialHistoryCacheIds.get(
              requestBody.id
            );
            if (materialHistoryCacheId) {
              axiosClient.storage.remove(materialHistoryCacheId);
              materialHistoryCacheIds.delete(requestBody.id);
              console.log(
                "Removed materialHistoryCacheId:",
                materialHistoryCacheId
              ); // Log cache ID sau khi xóa
            }
          },
        },
      }
    );
  },
  deleteMaterialHistory: (id: string) => {
    return axiosClient.delete<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/material-history/${id}`,
      {
        cache: {
          update: () => {
            cacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            cacheIds.clear(); // Xóa danh sách cache ID sau khi xóa

            // Xóa cache ID của getMaterialHistory có cùng ID
            const materialHistoryCacheId = materialHistoryCacheIds.get(id);
            if (materialHistoryCacheId) {
              axiosClient.storage.remove(materialHistoryCacheId);
              materialHistoryCacheIds.delete(id);
              console.log(
                "Removed materialHistoryCacheId:",
                materialHistoryCacheId
              ); // Log cache ID sau khi xóa
            }
          },
        },
      }
    );
  },
};
