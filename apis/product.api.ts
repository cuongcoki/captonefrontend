// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '@/constants/endpoint'

import { ProductType } from '@/types/product.type'


export const productApi = {
    allProducts: ( IsInProcessing?: any, PageIndex?:any ,PageSize?:any , searchTerm?: string) =>
        axiosClient.get(`${endPointConstant.BASE_URL}/products?IsInProcessing=${IsInProcessing}&PageIndex=${PageIndex}&PageSize=${PageSize}&searchTerm=${searchTerm}`),

    createProduct:(data: ProductType) =>
        axiosClient.post(`${endPointConstant.BASE_URL}/products`,data),

    getProductId: (id: string) =>
        axiosClient.get(`${endPointConstant.BASE_URL}/products/${id}`),
}
       
