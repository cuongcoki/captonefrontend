// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '@/constants/endpoint'

type LoginPayload = {
  id: string
  password: string
}



export const authApi = {
  login: (data: LoginPayload) => axiosClient.post(`${endPointConstant.BASE_URL}/auth/login`, data),
  changePassword: (data: any) => axiosClient.put(`${endPointConstant.BASE_URL}/user/changePassword`, data)
}
