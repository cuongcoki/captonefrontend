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

interface updateStatusShipOrder{
    shipOrderId:string,
    status:number
}

interface shipOrderUpdate {
    id:string
    shipperId: string;
    kindOfShipOrder: number;
    orderId: string;
    shipDate: string;
    shipOrderDetailRequests: ShipOrderDetailRequest[];
}


export const shipOrderApi = {
    getShipOrderID: (id: string) =>
        axiosClient.get(`${endPointConstant.BASE_URL}/ship-orders/${id}`),

    createShipOrder: (data: shipOrder) =>
        axiosClient.post(`${endPointConstant.BASE_URL}/ship-orders`, data),

    updateShipOrder: (data: shipOrder, id: string) =>
        axiosClient.put(`${endPointConstant.BASE_URL}/ship-orders/${id}`, data),

    updateStatus: (data: updateStatusShipOrder, id: string) =>
        axiosClient.patch(`${endPointConstant.BASE_URL}/ship-orders/${id}`, data),
    
    shipOrderByShipper: (
        PageIndex?: number,
        PageSize?: number,
        Status?: string | null,
        ShipDate?: string | null,
    ) => {
        let url = `${endPointConstant.BASE_URL}/ship-orders/by-shipper?PageIndex=${PageIndex}&PageSize=${PageSize}`;
        if (Status !== null && Status !== undefined) url += `&Status=${Status}`;
        if (ShipDate !== null && ShipDate !== undefined) url += `&ShipDate=${ShipDate}`;
        return axiosClient.get(url);
    },
}

