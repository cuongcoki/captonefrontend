// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '@/constants/endpoint'


export const phaseApi = {
  
  getAllPhase: () =>
    axiosClient.get(`${endPointConstant.BASE_URL}/phase`),

}

