// ** Types
import { is } from "date-fns/locale";

export type UsersType = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  gender: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  salaryByDay: string;
  accessToken: string;
  roleId:number;
  roleDescription:string;
  companyId:string;
  companyName:string;
  accountBalance:number;
};

export type UserSearchParams = {
  searchTearm: string;
  isActive: string;
  roleId: number;
  pageIndex: number;
  pageSize: number;
};

export type ConfirmChangePassword = {
  userId: string;
  verifyCode: string;
  password: string;
};
