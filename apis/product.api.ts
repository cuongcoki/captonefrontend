// ** Axios client import
import axiosClient from "../auth/jwtService";

// ** Constants import
import { endPointConstant } from "@/constants/endpoint";

import { ProductType, ProductUpdateType } from "@/types/product.type";

// ** Function to create unique cache ID
const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};

// ** Store for cache IDs
const cacheIds: Set<string> = new Set();
const productsCacheIds: Map<string, string> = new Map();

export const productApi = {
  allProducts: (
    IsInProcessing?: any,
    PageIndex?: any,
    PageSize?: any,
    searchTerm?: string
  ) => {
    const requestBody = { IsInProcessing, searchTerm, PageIndex, PageSize };
    const cacheId = createCacheId("all-products", requestBody);
    cacheIds.add(cacheId);
    return axiosClient.get(`${endPointConstant.BASE_URL}/products`, {
      params: requestBody,
      id: cacheId,
    });
  },

  createProduct: (data: ProductType) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/products`, data, {
      cache: {
        update: () => {
          cacheIds.forEach((id) => axiosClient.storage.remove(id));
          cacheIds.clear();
        },
      },
    }),

  getProductId: (id: string) => {
    const cacheId = `get-product-${id}`;
    productsCacheIds.set(id, cacheId);
    return axiosClient.get(`${endPointConstant.BASE_URL}/products/${id}`, {
      id: cacheId,
    });
  },

  updateProduct: (data: ProductUpdateType, productId: string) =>
    axiosClient.put(
      `${endPointConstant.BASE_URL}/products/${productId}`,
      data,
      {
        cache: {
          update: () => {
            cacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            cacheIds.clear();

            const productCacheId = productsCacheIds.get(productId);
            if (productCacheId) {
              axiosClient.storage.remove(productCacheId);
              productsCacheIds.delete(productId);
            }
          },
        },
      }
    ),

  searchProduct: (searchTerm?: string, phaseId?: string, companyId?: string, pageIndex: number = 1, pageSize: number = 10) =>
    axiosClient.get(
      `${endPointConstant.BASE_URL}/products/search?search=${searchTerm}&phaseId=${phaseId}&companyId=${companyId}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      {
        cache: false,
      }
    ),

  searchProductForSet: (searchTerm?: string, pageIndex: number = 1, pageSize: number = 10) =>
    axiosClient.get(
      `${endPointConstant.BASE_URL}/products/search-for-set`,
      {
        params: {
          SearchTerm: searchTerm,
          PageIndex: pageIndex,
          PageSize: pageSize
        }
      }
    ),

  allMaterial: (
    PageIndex?: any,
    PageSize?: any,
    searchTerm?: string
  ) => {
    const requestBody = { searchTerm, PageIndex, PageSize };
    const cacheId = createCacheId("all-products", requestBody);
    cacheIds.add(cacheId);
    return axiosClient.get(`${endPointConstant.BASE_URL}/material`, {
      params: requestBody,
      id: cacheId,
    });
  },
};
