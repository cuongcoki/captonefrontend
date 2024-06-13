// ** Types
import { is } from "date-fns/locale";

export type UsersType = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  dob: string;
  address: string;
  gender: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  salaryByDay: string;
  accessToken: string;
};

export type UserSearchParams = {
  searchTearm: string;
  isActive: string;
  roleId: number;
  pageIndex: number;
  pageSize: number;
};
