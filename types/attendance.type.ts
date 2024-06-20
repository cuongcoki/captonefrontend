import { SearchResponse, SuccessResponse } from "@/types/util.type";

export type AttendanceOverallProps = {
  StartDate: string;
  EndDate: string;
  PageIndex: string;
  PageSize: string;
};

export type searchAttendanceOverallBody = {
  StartDate: string;
  EndDate: string;
  PageIndex: string;
  PageSize: string;
};

type AttendanceOverallDeatil = {
  slotId: string;
  totalAttendance: string;
  totalManufacture: string;
  totalSalaryByProduct: string;
  totalHourOverTime: string;
  numberOfPresent: string;
};

export type AttendanceOverall = {
  date: string;
  attendanceStatisticResponses: AttendanceOverallDeatil[];
};

export type searchAttendanceOverallResponse = SearchResponse<
  AttendanceOverall[]
>;

type Attendance = {
  userId: string;
  isManufacture: string;
  isSalaryByProduct: string;
};

export type CreateAttendanceSlotBody = {
  slotId: string;
  createAttendances: Attendance[];
};

export type GetAttendanceBody = {
  SearchTerm: string;
  Date: string;
  SlotId: string;
  PageIndex: string;
  PageSize: string;
};
type EmployeeProductResponse = {
  imageUrl: string;
  productId: string;
  productName: string;
  phaseId: string;
  phaseName: string;
  quantity: number;
};

type AttendanceDetail = {
  userId: string;
  date: string;
  fullName: string;
  hourOverTime: string;
  isAttendance: boolean;
  isOverTime: boolean;
  isSalaryByProduct: boolean;
  isManufacture: boolean;
  employeeProductResponses: EmployeeProductResponse[];
};
export type GetAttendanceResponse = SearchResponse<AttendanceDetail[]>;

export type AttendanceForUpdate = {
  userId: string;
  hourOverTime: string;
  isAttendance: boolean;
  isOverTime: boolean;
  isSalaryByProduct: boolean;
  isManufacture: boolean;
};

export type UpdateAttendanceBody = {
  slotId: number;
  date: string;
  updateAttendances: AttendanceForUpdate[];
};
//-------------------------------------------- USER --------------------------------------------
export type GetUsersBody = {
  SearchTerm: string;
  RoleId: string;
  IsActive: string;
  PageIndex: string;
  PageSize: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  gender: string;
  dob: string;
  salaryByDay: string;
  isActive: string;
  roleId: string;
};

export type GetUsersResponse = SearchResponse<User[]>;

export type AttendanceDetailProps = {
  date: string;
  slot: string;
};

//-------------------------------------------- Product --------------------------------------------
export type GetAllProductBody = {
  SearchTerm: string;
  IsInProcessing: boolean;
  PageIndex: Number;
  PageSize: Number;
};

type ImageResponse = {
  id: string;
  imageUrl: string;
  isBluePrint: boolean;
  isMainImage: boolean;
};

type Product = {
  id: string;
  name: string;
  code: string;
  price: Number;
  size: string;
  description: string;
  isInProcessing: boolean;
  imageResponses: ImageResponse[];
};

export type GetAllProductResponse = SearchResponse<Product[]>;

//-------------------------------------------- Phase --------------------------------------------

type Phase = {
  id: string;
  name: string;
  description: string;
};

export type GetAllPhaseResponse = SuccessResponse<Phase[]>;

//-------------------------------------------- Employee Product-----------------------------------
export type ProductEmployee = {
  productId: string;
  phaseId: string;
  quantity: Number;
  userId: string;
  isMold: boolean;
};
export type UpdateEmployeeProductBody = {
  date: string;
  slotId: Number;
  createQuantityProducts: ProductEmployee[];
};
