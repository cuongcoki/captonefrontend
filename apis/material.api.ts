// ** Axios client import
import { searchMaterial } from "@/types/material.type";
import axiosClient from "../auth/jwtService";

// ** Constants import
import { endPointConstant } from "@/constants/endpoint";
import { SearchResponse, SuccessResponse } from "@/types/util.type";
import { AddMaterialType, materialType } from "@/schema/material";

// ** Function to create unique cache ID
const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};

// ** Store for cache IDs
const cacheIds: Set<string> = new Set();
const materialCacheIds: Map<string, string> = new Map();

export const materialApi = {
  searchMaterial: (requestBody: searchMaterial) => {
    const cacheId = createCacheId("search-material", requestBody);
    cacheIds.add(cacheId); // Lưu cache ID
    console.log("Added cacheId:", cacheId); // Log cache ID khi thêm
    return axiosClient.get<SearchResponse<materialType[]>>(
      `${endPointConstant.BASE_URL}/material`,
      {
        params: requestBody,
        id: cacheId,
      }
    );
  },

  addMaterial: (requestBody: AddMaterialType) => {
    return axiosClient.post<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/material`,
      requestBody,
      {
        cache: {
          update: () => {
            console.log("Clearing cacheIds:", cacheIds); // Log trước khi xóa
            // Xóa tất cả cache ID của searchMaterial
            cacheIds.forEach((id) => axiosClient.storage.remove(id));
            cacheIds.clear(); // Xóa danh sách cache ID sau khi xóa
            console.log("cacheIds after clearing:", cacheIds); // Log sau khi xóa
          },
        },
      }
    );
  },

  getMaterial: (id: string) => {
    const cacheId = `get-material-${id}`;
    materialCacheIds.set(id, cacheId); // Lưu cache ID với ID của material
    console.log("Added materialCacheId:", cacheId); // Log cache ID khi thêm
    return axiosClient.get<SuccessResponse<materialType>>(
      `${endPointConstant.BASE_URL}/material/${id}`,
      {
        id: cacheId,
      }
    );
  },

  updateMaterial: (requestBody: AddMaterialType) => {
    return axiosClient.put<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/material`,
      requestBody,
      {
        cache: {
          update: () => {
            cacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            cacheIds.clear(); // Xóa danh sách cache ID sau khi xóa

            // Xóa cache ID của getMaterial có cùng ID
            const materialCacheId = materialCacheIds.get(requestBody.id);
            if (materialCacheId) {
              axiosClient.storage.remove(materialCacheId);
              materialCacheIds.delete(requestBody.id);
              console.log("Removed materialCacheId:", materialCacheId); // Log cache ID sau khi xóa
            }
          },
        },
      }
    );
  },
};
