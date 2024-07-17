// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '@/constants/endpoint'
export type ShipmentDetailRequest = {
  itemId: string;
  phaseId: string;
  quantity: number;
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

export const shipmentApi = {
  getShipments: (
    PageIndex?: number,
    PageSize?: number,
    Status?: string | null,
    SearchTerm?: string
  ) => {
    let url = `${endPointConstant.BASE_URL}/shipments?`;
    if (PageIndex !== undefined) url += `PageIndex=${PageIndex}&`;
    if (PageSize !== undefined) url += `PageSize=${PageSize}&`;
    if (Status) url += `Status=${Status}&`;
    if (SearchTerm) url += `SearchTerm=${SearchTerm}&`;
    // Remove trailing '&' or '?' if no parameters were added
    url = url.slice(-1) === '&' || url.slice(-1) === '?' ? url.slice(0, -1) : url;
    return axiosClient.get(url);
  },

  getShipmentID: (id: any) =>
    axiosClient.get(`${endPointConstant.BASE_URL}/shipments/${id}`),

  createShipment: (data: Shipment) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/shipments`, data),

}

