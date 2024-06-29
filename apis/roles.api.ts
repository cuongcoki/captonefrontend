// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '@/constants/endpoint'


export const roleApi = {
    getAllRoles: () =>
        axiosClient.get(`${endPointConstant.BASE_URL}/roles`),
    
}
       
