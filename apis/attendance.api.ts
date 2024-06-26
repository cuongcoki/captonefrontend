import { searchMaterial } from "@/types/material.type";
import axiosClient from "../auth/jwtService";

import { endPointConstant } from "@/constants/endpoint";
import {
  CreateAttendanceBody,
  CreateAttendanceSlotBody,
  GetAllPhaseResponse,
  GetAllProductResponse,
  GetAttendanceBody,
  GetAttendanceResponse,
  GetEmployeeAttendanceBody,
  GetEmployeeAttendanceDetailBody,
  GetEmployeeAttendanceDetailResponse,
  GetEmployeeAttendanceResponse,
  GetUserByCompanyIdBody,
  GetUserByCompanyIdResponse,
  GetUsersBody,
  GetUsersResponse,
  UpdateAttendanceBody,
  UpdateEmployeeProductBody,
  searchAttendanceOverallBody,
  searchAttendanceOverallResponse,
} from "@/types/attendance.type";
import { SuccessResponse } from "@/types/util.type";

const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};

const attendanceCacheIds: Set<string> = new Set();
const attendanceDetailCacheIds: Set<string> = new Set();

export const attendanceApi = {
  searchAttendance: (requestBody: searchAttendanceOverallBody) => {
    const cacheId = createCacheId("search-attendance", requestBody);
    attendanceCacheIds.add(cacheId); // Lưu cache ID
    // console.log("Added attendanceCacheId:", cacheId); // Log cache ID khi thêm
    return axiosClient.get<searchAttendanceOverallResponse>(
      `${endPointConstant.BASE_URL}/attendances/overall`,
      {
        params: requestBody,
        id: cacheId,
      }
    );
  },
  createAttendance: (requestBody: CreateAttendanceBody) => {
    return axiosClient.post<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/attendances/batch`,
      requestBody,
      {
        cache: {
          update: () => {
            attendanceDetailCacheIds.forEach((cacheId) => {
              axiosClient.storage.remove(cacheId);
            });
            attendanceDetailCacheIds.clear();
          },
        },
      }
    );
  },
  getAttendance: (requestBody: GetAttendanceBody) => {
    const cacheId = createCacheId("get-attendance", requestBody);

    attendanceDetailCacheIds.add(cacheId);
    console.log("Added attendanceDetailCacheId:", cacheId); // Log cache ID khi thêm
    return axiosClient.get<GetAttendanceResponse>(
      `${endPointConstant.BASE_URL}/attendances`,
      {
        params: requestBody,
        id: cacheId,
      }
    );
  },
  updateAttendance: (requestBody: UpdateAttendanceBody) => {
    return axiosClient.put<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/attendances`,
      requestBody,
      {
        cache: {
          update: () => {
            // Xóa tất cả cache cua attendanceDetailCacheIds
            attendanceDetailCacheIds.forEach((cacheId) => {
              console.log("Removed attendanceDetailCacheId:", cacheId); // Log cache ID khi xóa
              axiosClient.storage.remove(cacheId);
            });
            attendanceCacheIds.clear();
          },
        },
      }
    );
  },
  // -------------------------------------------- USER --------------------------------------------
  getUsers: (requestBody: GetUsersBody) => {
    const cacheId = createCacheId("get-users", requestBody);
    // console.log("Added usersCacheId:", cacheId); // Log cache ID khi thêm
    return axiosClient.get<GetUsersResponse>(
      `${endPointConstant.BASE_URL}/users`,
      {
        params: requestBody,
        id: cacheId,
      }
    );
  },
  getUserByCompanyId: (requestBody: GetUserByCompanyIdBody) => {
    const cacheId = createCacheId("get-users", requestBody);
    // console.log("Added usersCacheId:", cacheId); // Log cache ID khi thêm
    return axiosClient.get<GetUserByCompanyIdResponse>(
      `${endPointConstant.BASE_URL}/users/Company`,
      {
        params: requestBody,
        id: cacheId,
      }
    );
  },

  //-------------------------------------------- PRODUCT --------------------------------------------
  getALlProduct: (requestBody: searchMaterial) => {
    return axiosClient.get<GetAllProductResponse>(
      `${endPointConstant.BASE_URL}/products`,
      {
        params: requestBody,
      }
    );
  },
  // -------------------------------------------- PHASE --------------------------------------------
  getAllPhase: () => {
    return axiosClient.get<GetAllPhaseResponse>(
      `${endPointConstant.BASE_URL}/phase`
    );
  },
  // -------------------------------------------- Employee Product -------------------------------------
  updateEmployeeProduct: (requestBody: UpdateEmployeeProductBody) => {
    return axiosClient.post<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/EmployeeProduct`,
      requestBody,
      {
        cache: {
          update: () => {
            attendanceDetailCacheIds.forEach((cacheId) => {
              axiosClient.storage.remove(cacheId);
            });
            attendanceDetailCacheIds.clear();
          },
        },
      }
    );
  },
  // -------------------------------------------- Employee Attendance --------------------------------------------
  getEmployeeAttendance: (requestBody: GetEmployeeAttendanceBody) => {
    return axiosClient.get<GetEmployeeAttendanceResponse>(
      `${endPointConstant.BASE_URL}/attendances/users`,
      {
        params: requestBody,
      }
    );
  },

  getEmployeeAttendanceDetail: (
    requestBody: GetEmployeeAttendanceDetailBody
  ) => {
    return axiosClient.get<GetEmployeeAttendanceDetailResponse>(
      `${endPointConstant.BASE_URL}/attendances/users/detail`,
      {
        params: requestBody,
      }
    );
  },
};
