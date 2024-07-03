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


export const orderApi = {
  searchOrder: (PageIndex?: number, PageSize?: number, Status?: any, StartOrder?: any, EndOrder?: any, CompanyName?: string) =>
    axiosClient.get(`${endPointConstant.BASE_URL}/orders?&PageIndex=${PageIndex}&PageSize=${PageSize}`),

  getOrderId: (id: any) =>
    axiosClient.get(`${endPointConstant.BASE_URL}/orders/${id}`),

  createOrder: (data: OrderType) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/orders`, data),

  getAllCompanis: (PageIndex?: any, PageSize?: any, searchTerm?: string) =>
    axiosClient.get(`${endPointConstant.BASE_URL}/companies?&PageIndex=${PageIndex}&PageSize=${PageSize}&searchTerm=${searchTerm}`),


  createCompany: (data: CompanyRequest) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/companies`, data),


  getOrderDetailsId: (orderId: any) =>
    axiosClient.get(`${endPointConstant.BASE_URL}/orderDetails/order/${orderId}`),

}

