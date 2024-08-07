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
  CompanyId: string;
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
  companyId: string;
  updateAttendances: AttendanceForUpdate[];
};
export type CreateAttendanceBody = {
  slotId: number;
  date: string;
  companyId: string;
  createAttendances: AttendanceForUpdate[];
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
  avatar: string;
};

export type GetUsersResponse = SearchResponse<User[]>;

export type GetUserByCompanyIdBody = {
  CompanyId: string;
};

export type GetUserByCompanyIdResponse = SuccessResponse<User[]>;

export type AttendanceDetailProps = {
  date: string;
  slot: string;
  warehouse: string;
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

export type Product = {
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

export type PhaseType = {
  id: string;
  name: string;
  description: string;
};

export type GetAllPhaseResponse = SuccessResponse<PhaseType[]>;

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
  companyId: string;
  createQuantityProducts: ProductEmployee[];
};

//-------------------------------------------- Employee --------------------------------------------
export type AttendanceDateData = {
  date: string;
  attedanceDateReport: {
    isHalfWork: boolean;
    isOneWork: boolean;
    isSalaryByProduct: boolean;
    isOverTime: boolean;
  };
};
export type GetEmployeeAttendanceResponse = SuccessResponse<{
  userId: string;
  month: number;
  year: number;
  attendances: AttendanceDateData[];
}>;

export type GetEmployeeAttendanceBody = {
  Year: number;
  Month: number;
};

export type GetEmployeeAttendanceDetailBody = {
  Date: string;
};

export type AttendanceSlotDetail = {
  slotId: number;
  isAttendance: boolean;
  isOvertime: boolean;
  hourOverTime: number;
  isSalaryByProduct: boolean;
  employeeProductResponses: {
    imageUrl: string;
    productName: string;
    productId: string;
    phaseId: string;
    phaseName: string;
    quantity: number;
  }[];
};

export type GetEmployeeAttendanceDetailResponse = SuccessResponse<{
  date: string;
  userId: string;
  attendanceSlotReports: AttendanceSlotDetail[];
}>;
