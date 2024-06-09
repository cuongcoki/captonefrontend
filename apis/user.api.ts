// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '@/constants/endpoint'


type userType = {
    id: string
    firstName: string
    lastName: string
    phone: string
    address: string
    password: string
    roleId: number
    dob: string
    gender: string
    salaryByDay:number
    isActive: boolean
    facility: string
  }

export const userApi = {
    allUsers: (RoleId: number, searchTerm?: string, IsActive?: any) =>
        axiosClient.get(`${endPointConstant.BASE_URL}/users?RoleId=${RoleId}&searchTerm=${searchTerm}&IsActive=${IsActive}`),

    getUserId: (id: string) => 
        axiosClient.get(`${endPointConstant.BASE_URL}/users/${id}`),

    createUser:(data: userType) => 
        axiosClient.post(`${endPointConstant.BASE_URL}/users`, data),

}
       
