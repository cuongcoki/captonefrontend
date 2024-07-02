// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '@/constants/endpoint'

// ** Types import
import { SetType, SetUpdateType } from '@/types/set.type'

// ** Function to create unique cache ID
const createCacheId = (base: string, params: Record<string, any>): string => {
    const query = new URLSearchParams(params).toString();
    return `${base}?${query}`;
};

// ** Store for cache IDs
const setCacheIds: Set<string> = new Set();
const setsCacheIds: Map<string, string> = new Map();

export const setApi = {
    allSet: (PageIndex?: any, PageSize?: any, searchTerm?: string) => {
        const requestBody = { PageIndex, PageSize, searchTerm };
        const cacheId = createCacheId("all-sets", requestBody);
        setCacheIds.add(cacheId);
        console.log("Added setCacheId:", cacheId);
        return axiosClient.get(`${endPointConstant.BASE_URL}/sets`, {
            params: requestBody,
            id: cacheId,
        });
    },

    getSetId: (id: string) => {
        const cacheId = `get-set-${id}`;
        setsCacheIds.set(id, cacheId);
        return axiosClient.get(`${endPointConstant.BASE_URL}/sets/${id}`, {
            id: cacheId,
        });
    },

    createSet: (data: SetType) =>
        axiosClient.post(`${endPointConstant.BASE_URL}/sets`, data, {
            cache: {
                update: () => {
                    console.log("Clearing setCacheIds:", setCacheIds);
                    setCacheIds.forEach((id) => axiosClient.storage.remove(id));
                    setCacheIds.clear();
                    console.log("setCacheIds after clearing:", setCacheIds);
                },
            },
        }),

    updateSet: (data: SetUpdateType, setId: string) =>
        axiosClient.put(`${endPointConstant.BASE_URL}/sets/${setId}`, data, {
            cache: {
                update: () => {
                    setCacheIds.forEach((id) => {
                        axiosClient.storage.remove(id);
                    });
                    setCacheIds.clear();

                    const setCacheId = setsCacheIds.get(setId);
                    if (setCacheId) {
                        axiosClient.storage.remove(setCacheId);
                        setsCacheIds.delete(setId);
                        console.log("Removed setCacheId:", setCacheId);
                    }
                },
            },
        }),

    searchSets: (searchTerm?: string) =>
        axiosClient.get(`${endPointConstant.BASE_URL}/sets/search`, {
            params: { searchTerm: searchTerm },
        }),
    // searchSets: (searchTerm: string) => axiosClient.get(`${endPointConstant.BASE_URL}/sets/search?search=${searchTerm}`),

};
