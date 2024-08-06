// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '@/constants/endpoint'


interface ShipOrderDetailRequest {
    itemId: string,
    quantity: number,
    itemKind: number,
}
interface shipOrder {
    shipperId: string;
    kindOfShipOrder: number;
    orderId: string;
    shipDate: string;
    shipOrderDetailRequests: ShipOrderDetailRequest[];
}

interface updateStatusShipOrder {
    shipOrderId: string,
    status: number
}

interface shipOrderUpdate {
    id: string
    shipperId: string;
    kindOfShipOrder: number;
    orderId: string;
    shipDate: string;
    shipOrderDetailRequests: ShipOrderDetailRequest[];
}

// ** Function to create unique cache ID
const createCacheId = (base: string, params: Record<string, any>): string => {
    const query = new URLSearchParams(params).toString();
    return `${base}?${query}`;
};

// ** Store for cache IDs
const shipOrderCacheIds: Set<string> = new Set();
const shipOrdersCacheIds: Map<string, string> = new Map();


export const shipOrderApi = {
    getShipOrderID: (id: string) => {
        const cacheId = `get-shiporders-${id}`;
        shipOrdersCacheIds.set(id, cacheId);
        return axiosClient.get(`${endPointConstant.BASE_URL}/ship-orders/${id}`, {
            id: cacheId,
        });
    },


    createShipOrder: (data: shipOrder) =>
        axiosClient.post(`${endPointConstant.BASE_URL}/ship-orders`, data, {
            cache: {
                update: () => {
                    console.log("Clearing shipOrderCacheIds:", shipOrderCacheIds);
                    shipOrderCacheIds.forEach((cacheId) => axiosClient.storage.remove(cacheId));
                    shipOrderCacheIds.clear();
                    console.log("shipOrderCacheIds after clearing:", shipOrderCacheIds);
                },
            },
        }),

    updateShipOrder: (data: shipOrder, id: string) =>
        axiosClient.put(`${endPointConstant.BASE_URL}/ship-orders/${id}`, data, {
            cache: {
                update: () => {
                    shipOrderCacheIds.forEach((cacheId) => axiosClient.storage.remove(cacheId));
                    shipOrderCacheIds.clear();

                    const shipOrderCacheId = shipOrdersCacheIds.get(id);
                    if (shipOrderCacheId) {
                        axiosClient.storage.remove(shipOrderCacheId);
                        shipOrdersCacheIds.delete(id);
                        console.log("Removed shipOrderCacheId:", shipOrderCacheId);
                    }
                },
            },
        }),


    updateStatus: (data: updateStatusShipOrder, id: string) =>
        axiosClient.patch(`${endPointConstant.BASE_URL}/ship-orders/${id}`, data, {
            cache: {
                update: () => {
                    shipOrderCacheIds.forEach((cacheId) => axiosClient.storage.remove(cacheId));
                    shipOrderCacheIds.clear();

                    const shipOrderCacheId = shipOrdersCacheIds.get(id);
                    if (shipOrderCacheId) {
                        axiosClient.storage.remove(shipOrderCacheId);
                        shipOrdersCacheIds.delete(id);
                        console.log("Removed shipmentCacheId:", shipOrderCacheId);
                    }
                },
            },
        }),

    shipOrderByShipper: (
        PageIndex?: number,
        PageSize?: number,
        Status?: string | null,
        ShipDate?: string | null,
    ) => {
        const requestBody = { PageIndex, PageSize, Status, ShipDate };
        const cacheId = createCacheId("get-shiporders", requestBody);
        shipOrderCacheIds.add(cacheId);
        console.log("Added cacheId:", cacheId);

        let url = `${endPointConstant.BASE_URL}/ship-orders/by-shipper?PageIndex=${PageIndex}&PageSize=${PageSize}`;
        if (Status !== null && Status !== undefined) url += `&Status=${Status}`;
        if (ShipDate !== null && ShipDate !== undefined) url += `&ShipDate=${ShipDate}`;

        return axiosClient.get(url, { id: cacheId });
    },

    getShipOrderIDByShipper: (shipOrderId: string) =>
        axiosClient.get(`${endPointConstant.BASE_URL}/ship-orders/detail/${shipOrderId}`),

    isAcceptedShipOrder: (shipOrderId: string) =>
        axiosClient.patch(`${endPointConstant.BASE_URL}/ship-orders/accept/${shipOrderId}`),


}

