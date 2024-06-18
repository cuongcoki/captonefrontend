import { SearchResponse } from "@/types/util.type";

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
type AttendanceDetail = {
  userId: string;
  date: string;
  fullName: string;
  hourOverTime: string;
  isAttendance: string;
  isOverTime: string;
  isSalaryByProduct: string;
  isManufacture: string;
};
export type GetAttendanceResponse = SearchResponse<AttendanceDetail[]>;

export type AttendanceForUpdate = {
  userId: string;
  hourOverTime: string;
  isAttendance: string;
  isOverTime: string;
  isSalaryByProduct: string;
  isManufacture: string;
};

export type UpdateAttendanceBody = {
  slotId: string;
  date: string;
  updateAttendances: AttendanceForUpdate[];
};

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
