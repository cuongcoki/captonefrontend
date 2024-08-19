// ** Axios client import
import axiosClient from "../auth/jwtService";

// ** Constants import
import { endPointConstant } from "@/constants/endpoint";
export type ShipmentDetailRequest = {
  itemId: string;
  phaseId: string;
  quantity: any;
  kindOfShip: number;
  productPhaseType: number;
};

export type Shipment = {
  fromId: string;
  toId: string;
  shipperId: string;
  shipDate: string;
  shipmentDetailRequests: ShipmentDetailRequest[];
};

export type ShipmentId = {
  shipmentId: string;
  fromId: string;
  toId: string;
  shipperId: string;
  shipDate: string;
  shipmentDetailRequests: ShipmentDetailRequest[];
};

interface updateStatusShipment {
  shipmentId: string;
  status: number;
}

// ** Function to create unique cache ID
const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};

// ** Store for cache IDs
const shipmentCacheIds: Set<string> = new Set();
const shipmentsCacheIds: Map<string, string> = new Map();

const shipmentShipperCacheIds: Set<string> = new Set();
const shipmentShippersCacheIds: Map<string, string> = new Map();

export const shipmentApi = {
  getShipments: (
    PageIndex?: number,
    PageSize?: number,
    Status?: string | null,
    SearchTerm?: string
  ) => {
    const requestBody = { PageIndex, PageSize, Status, SearchTerm };
    const cacheId = createCacheId("get-shipments", requestBody);
    shipmentCacheIds.add(cacheId);

    let url = `${endPointConstant.BASE_URL}/shipments?`;
    if (PageIndex !== undefined) url += `PageIndex=${PageIndex}&`;
    if (PageSize !== undefined) url += `PageSize=${PageSize}&`;
    if (Status) url += `Status=${Status}&`;
    if (SearchTerm) url += `SearchTerm=${SearchTerm}&`;

    url =
      url.slice(-1) === "&" || url.slice(-1) === "?" ? url.slice(0, -1) : url;

    return axiosClient.get(url, { id: cacheId });
  },

  getShipmentID: (id: string) => {
    const cacheId = `get-shipment-${id}`;
    shipmentsCacheIds.set(id, cacheId);
    return axiosClient.get(`${endPointConstant.BASE_URL}/shipments/${id}`, {
      id: cacheId,
    });
  },

  createShipment: (data: Shipment) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/shipments`, data, {
      cache: {
        update: () => {
          shipmentCacheIds.forEach((id) => axiosClient.storage.remove(id));
          shipmentCacheIds.clear();
        },
      },
    }),

  updateShipment: (data: ShipmentId, id: string) =>
    axiosClient.put(`${endPointConstant.BASE_URL}/shipments/${id}`, data, {
      cache: {
        update: () => {
          shipmentCacheIds.forEach((id) => axiosClient.storage.remove(id));
          shipmentCacheIds.clear();

          shipmentsCacheIds.forEach((cacheId) =>
            axiosClient.storage.remove(cacheId)
          );
          shipmentsCacheIds.clear();
        },
      },
    }),

  getAllCompanyByType: (
    companyType?: any,
    pageIndex?: number,
    pageSize?: number
  ) =>
    axiosClient.get(
      `${endPointConstant.BASE_URL}/companies?CompanyType=${companyType}&PageIndex=${pageIndex}&PageSize=${pageSize}`
    ),

  changeStatus: (id: string, data: updateStatusShipment) =>
    axiosClient.patch(
      `${endPointConstant.BASE_URL}/shipments/${id}/status`,
      data,
      {
        cache: {
          update: () => {
            shipmentCacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            shipmentCacheIds.clear();

            const shipmentCacheId = shipmentsCacheIds.get(id);
            if (shipmentCacheId) {
              axiosClient.storage.remove(shipmentCacheId);
              shipmentsCacheIds.delete(id);
            }
          },
        },
      }
    ),

  isAcceptedShipment: (id: string, isAccepted: boolean) =>
    axiosClient.patch(
      `${endPointConstant.BASE_URL}/shipments/${id}/accept/${isAccepted}`,
      {},
      {
        cache: {
          update: () => {
            shipmentCacheIds.forEach((cacheId) =>
              axiosClient.storage.remove(cacheId)
            );
            shipmentCacheIds.clear();

            const shipmentCacheId = shipmentsCacheIds.get(id);
            if (shipmentCacheId) {
              axiosClient.storage.remove(shipmentCacheId);
              shipmentsCacheIds.delete(id);
            }
          },
        },
      }
    ),
    // const shipmentShipperCacheIds: Set<string> = new Set();
    // const shipmentShippersCacheIds: Map<string, string> = new Map();
  changeStatusByShipper: (id: string, data: updateStatusShipment) =>
    axiosClient.patch(
      `${endPointConstant.BASE_URL}/shipments/${id}/shipper/change-status`,
      data,
      {
        cache: {
          update: () => {
            shipmentShipperCacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            shipmentShipperCacheIds.clear();

            const shipmentShipperCacheId = shipmentShippersCacheIds.get(id);
            if (shipmentShipperCacheId) {
              axiosClient.storage.remove(shipmentShipperCacheId);
              shipmentShippersCacheIds.delete(id);
            }
          },
        },
      }
    ),

  getByShipper: (
    PageIndex?: number,
    PageSize?: number,
    Status?: string | null,
    SearchTerm?: string
  ) => {
    const requestBody = { PageIndex, PageSize, Status, SearchTerm };
    const cacheId = createCacheId("get-shipments-shipper", requestBody);
    shipmentShipperCacheIds.add(cacheId);

    let url = `${endPointConstant.BASE_URL}/shipments/get-by-shipper?`;
    if (PageIndex !== undefined) url += `PageIndex=${PageIndex}&`;
    if (PageSize !== undefined) url += `PageSize=${PageSize}&`;
    if (Status) url += `Status=${Status}&`;
    if (SearchTerm) url += `SearchTerm=${SearchTerm}&`;

    url =
      url.slice(-1) === "&" || url.slice(-1) === "?" ? url.slice(0, -1) : url;
    return axiosClient.get(url, { id: cacheId });
  },

  getByShipperID: (id: string) =>
    axiosClient.get(
      `${endPointConstant.BASE_URL}/shipments/${id}/get-by-shipper`
    ),
};
