// ** Axios client import
import { ForgetPasswordFormType } from "@/schema";
import axiosClient from "../auth/jwtService";

// ** Constants import
import { endPointConstant } from "@/constants/endpoint";
import { SuccessResponse } from "@/types/util.type";
import { ConfirmChangePassword } from "@/types/userTypes";

type LoginPayload = {
  id: string;
  password: string;
};

export const authApi = {
  login: (data: LoginPayload) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/auth/login`, data),
  changePassword: (data: any) =>
    axiosClient.put(`${endPointConstant.BASE_URL}/user/changePassword`, data),
  forgetPassword: (data: ForgetPasswordFormType) =>
    axiosClient.post<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/auth/forget-password/${data.id}`
    ),
  confirmChangePassword: (body: ConfirmChangePassword) =>
    axiosClient.post<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/auth/confirm/forgetpassword`,
      body
    ),
  logout: (id: string) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/auth/logout/${id}`),
};
