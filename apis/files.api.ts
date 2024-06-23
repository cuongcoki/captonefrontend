import axiosClient from '../auth/jwtService';
import { endPointConstant } from '@/constants/endpoint';

// Function to create unique cache ID
const createCacheId = (base: string, params: Record<string, any>): string => {
    const query = new URLSearchParams(params).toString();
    return `${base}?${query}`;
};

// Store for cache IDs
const cacheIds: Set<string> = new Set();
const filesCacheIds: Map<string, string> = new Map();

export const filesApi = {
    getFile: (fileName: string) => {
        const cacheId = createCacheId(`${endPointConstant.BASE_URL}/files/${fileName}`, {});
        cacheIds.add(cacheId);
        return axiosClient.get(`${endPointConstant.BASE_URL}/files/${fileName}`);
    },

    postFile: (fileName: string, data: any) => {
        return axiosClient.post(`${endPointConstant.BASE_URL}/files/${fileName}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            cache: {
                update: () => {
                    console.log("Clearing cacheIds:", cacheIds); // Log before clearing
                    // Remove all cache IDs
                    cacheIds.forEach((id) => axiosClient.storage.remove(id));
                    cacheIds.clear(); // Clear the set after removing
                    console.log("cacheIds after clearing:", cacheIds); // Log after clearing
                },
            },
        });
    },

    postFiles: (data: any) => {
        return axiosClient.post(`${endPointConstant.BASE_URL}/files`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            cache: {
                update: () => {
                    console.log("Clearing cacheIds:", cacheIds); // Log before clearing
                    // Remove all cache IDs
                    cacheIds.forEach((id) => axiosClient.storage.remove(id));
                    cacheIds.clear(); // Clear the set after removing
                    console.log("cacheIds after clearing:", cacheIds); // Log after clearing
                },
            },
        });
    },

    deleteFile: (fileName: string) => {
        return axiosClient.delete(`${endPointConstant.BASE_URL}/files/${fileName}`);
    },
};
