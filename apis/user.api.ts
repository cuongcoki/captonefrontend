// ** Axios client import
import { UserUpdateFormType } from "@/schema";
import axiosClient from "../auth/jwtService";

// ** Constants import
import { endPointConstant } from "@/constants/endpoint";
import { SuccessResponse } from "@/types/util.type";

type userType = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  password: string;
  roleId: number;
  dob: string;
  gender: string;
  salaryByDay: number;
  isActive: boolean;
  facility: string;
};

export const userApi = {
  allUsers: (
    RoleId: number,
    searchTerm?: string,
    IsActive?: any,
    PageIndex?: any,
    PageSize?: any
  ) =>
    axiosClient.get(
      `${endPointConstant.BASE_URL}/users?RoleId=${RoleId}&searchTerm=${searchTerm}&IsActive=${IsActive}&PageIndex=${PageIndex}&PageSize=${PageSize}`
    ),

  getUserId: (id: string) =>
    axiosClient.get(`${endPointConstant.BASE_URL}/users/${id}`),

  createUser: (data: userType) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/users`, data),

  changeUserStatus: (id: string, isActive: boolean) =>
    axiosClient.put(
      `${endPointConstant.BASE_URL}/users/${id}/status/${isActive}`
    ),

  updateUser: (user: UserUpdateFormType) =>
    axiosClient.put<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/users`,
      user
    ),
};
