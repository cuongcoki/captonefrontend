// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '@/constants/endpoint'

export type CompanyRequest = {
  name: string;
  address: string;
  directorName: string;
  directorPhone: string;
  email: string;
  companyType: number; // Đây là một số nguyên, có thể sử dụng enum nếu cần
};

export type OrderType = {
  companyId: string,
  status: number,
  startOrder: string,
  endOrder: string,
  vat: number

};

interface OrderSearchParams {
  PageIndex?: number;
  PageSize?: number;
  Status?: string;
  StartOrder?: Date | null;
  EndOrder?: Date | null;
  CompanyName?: string;
}

interface updateOrder{
  orderId:string | undefined,
  companyId:string,
  status:number,
  vat:number,
  startOrder:string,
  endOrder:string
}
interface updateOrderDetails{
  orderId:string,
  orderDetailRequests:orderDetailRequests[]
}
interface orderDetailRequests{
  productIdOrSetId:string,
  quantity:number,
  unitPrice:number,
  note:string,
  isProductId:boolean
}

const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};

const orderCacheIds: Set<string> = new Set();
const ordersCacheIds: Map<string, string> = new Map();

const orderDetailsCacheIds:  Set<string> = new Set();

export const orderApi = {
  searchOrder: (
    PageIndex?: number,
    PageSize?: number,
    Status?: string | null,
    StartOrder?: string | null,
    EndOrder?: string | null,
    CompanyName?: string
  ) => {
    const requestBody = { PageIndex, PageSize, Status, StartOrder,EndOrder ,CompanyName};
    const cacheId = createCacheId("search-order", requestBody);
    orderCacheIds.add(cacheId);

    let url = `${endPointConstant.BASE_URL}/orders?PageIndex=${PageIndex}&PageSize=${PageSize}`;
    if (Status) url += `&Status=${Status}`;
    if (StartOrder) url += `&StartOrder=${StartOrder}`;
    if (EndOrder) url += `&EndOrder=${EndOrder}`;
    if (CompanyName) url += `&CompanyName=${CompanyName}`;
    return axiosClient.get(url, { id: cacheId });
  },

  getOrderId: (id:any) => {
    const cacheId = `get-order-${id}`;
    ordersCacheIds.set(id, cacheId);
    return axiosClient.get(`${endPointConstant.BASE_URL}/orders/${id}`, { id: cacheId });
  },

  updateOrder: (data:updateOrder) => axiosClient.put(`${endPointConstant.BASE_URL}/orders`, data, {
    cache: {
      update: () => {
        orderCacheIds.forEach((id) => axiosClient.storage.remove(id));
        orderCacheIds.clear();

        const orderCacheId = ordersCacheIds.get(String(data.orderId));
        if (orderCacheId) {
          axiosClient.storage.remove(orderCacheId);
          ordersCacheIds.delete(String(data.orderId));
        }
      },
    },
  }),

  createOrder: (data: OrderType) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/orders`, data, {
      cache: {
        update: () => {
          orderCacheIds.forEach((id) => axiosClient.storage.remove(id));
          orderCacheIds.clear();
        },
      },
    }),

    createOrderId: (data:updateOrderDetails) => axiosClient.post(`${endPointConstant.BASE_URL}/orderDetails`, data, {
      cache: {
        update: () => {
          orderDetailsCacheIds.forEach((id) => axiosClient.storage.remove(id));
          orderDetailsCacheIds.clear();
        },
      },
    }),

  getAllCompanis: (PageIndex?: any, PageSize?: any, searchTerm?: string) =>
    axiosClient.get(`${endPointConstant.BASE_URL}/companies?&PageIndex=${PageIndex}&PageSize=${PageSize}&searchTerm=${searchTerm}`),


  createCompany: (data: CompanyRequest) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/companies`, data),


  getOrderDetailsId: (orderId:any) => {
    const cacheId = `get-order-details-${orderId}`;
    orderDetailsCacheIds.add(cacheId);
    return axiosClient.get(`${endPointConstant.BASE_URL}/orderDetails/order/${orderId}`, { id: cacheId });
  },

}

