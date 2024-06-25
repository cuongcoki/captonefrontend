// ** Axios client import
import { SetType,SetUpdateType } from '@/types/set.type'
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '@/constants/endpoint'


export const setApi = {
    allSet: ( PageIndex?:any ,PageSize?:any , searchTerm?: string) =>
        axiosClient.get(`${endPointConstant.BASE_URL}/sets?&PageIndex=${PageIndex}&PageSize=${PageSize}&searchTerm=${searchTerm}`),

    getSetId: (id: string) =>
        axiosClient.get(`${endPointConstant.BASE_URL}/sets/${id}`),
  
    createSet: (data: SetType) =>
        axiosClient.post(`${endPointConstant.BASE_URL}/sets`, data),

    updateSet:(data:SetUpdateType, setId:string) => axiosClient.put(`${endPointConstant.BASE_URL}/sets/${setId}`, data),
}
       
