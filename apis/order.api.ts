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

export const orderApi = {
  searchOrder: (
    PageIndex?: number,
    PageSize?: number,
    Status?: string | null,
    StartOrder?: string | null,
    EndOrder?: string | null,
    CompanyName?: string
  ) => {
    let url = `${endPointConstant.BASE_URL}/orders?PageIndex=${PageIndex}&PageSize=${PageSize}`;
    if (Status) url += `&Status=${Status}`;
    if (StartOrder) url += `&StartOrder=${StartOrder}`;
    if (EndOrder) url += `&EndOrder=${EndOrder}`;
    if (CompanyName) url += `&CompanyName=${CompanyName}`;
    return axiosClient.get(url);
  },
  getOrderId: (id: any) =>
    axiosClient.get(`${endPointConstant.BASE_URL}/orders/${id}`),

  updateOrder: (data:updateOrder) => axiosClient.put(`${endPointConstant.BASE_URL}/orders`, data),

  createOrder: (data: OrderType) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/orders`, data),

  createOrderId:(data:updateOrderDetails)=>
    axiosClient.post(`${endPointConstant.BASE_URL}/orderDetails`, data),

  getAllCompanis: (PageIndex?: any, PageSize?: any, searchTerm?: string) =>
    axiosClient.get(`${endPointConstant.BASE_URL}/companies?&PageIndex=${PageIndex}&PageSize=${PageSize}&searchTerm=${searchTerm}`),


  createCompany: (data: CompanyRequest) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/companies`, data),


  getOrderDetailsId: (orderId: any) =>
    axiosClient.get(`${endPointConstant.BASE_URL}/orderDetails/order/${orderId}`),

}

