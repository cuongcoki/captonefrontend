// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '@/constants/endpoint'


export const setApi = {
    allSet: ( PageIndex?:any ,PageSize?:any , searchTerm?: string) =>
        axiosClient.get(`${endPointConstant.BASE_URL}/sets?&PageIndex=${PageIndex}&PageSize=${PageSize}&searchTerm=${searchTerm}`),

    getSetId: (id: string) =>
        axiosClient.get(`${endPointConstant.BASE_URL}/sets/${id}`),
  
}
       
