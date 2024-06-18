// ** Axios client import
import { searchMaterial } from "@/types/material.type";
import axiosClient from "../auth/jwtService";

// ** Constants import
import { endPointConstant } from "@/constants/endpoint";
import {
  CreateAttendanceSlotBody,
  GetAttendanceBody,
  GetAttendanceResponse,
  GetUsersBody,
  GetUsersResponse,
  UpdateAttendanceBody,
  searchAttendanceOverallBody,
  searchAttendanceOverallResponse,
} from "@/types/attendance.type";
import { SuccessResponse } from "@/types/util.type";

export const attendanceApi = {
  searchAttendance: (requestBody: searchAttendanceOverallBody) => {
    return axiosClient.get<searchAttendanceOverallResponse>(
      `${endPointConstant.BASE_URL}/attendance/overall`,
      {
        params: requestBody,
      }
    );
  },
  createAttendance: (requestBody: CreateAttendanceSlotBody) => {
    return axiosClient.post<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/attendance/batch`,
      requestBody
    );
  },
  getAttendance: (requestBody: GetAttendanceBody) => {
    return axiosClient.get<GetAttendanceResponse>(
      `${endPointConstant.BASE_URL}/attendance`,
      {
        params: requestBody,
      }
    );
  },
  updateAttendance: (requestBody: UpdateAttendanceBody) => {
    return axiosClient.put<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/attendance`,
      requestBody
    );
  },
  getUers: (requestBody: GetUsersBody) => {
    return axiosClient.get<GetUsersResponse>(
      `${endPointConstant.BASE_URL}/users`,
      {
        params: requestBody,
      }
    );
  },
};
