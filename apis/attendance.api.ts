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
const attendanceDetailCacheIds: Map<string, string> = new Map();

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
            // console.log("Clearing attendanceCacheIds:", attendanceCacheIds); // Log trước khi xóa
            // Xóa tất cả cache ID của searchAttendance
            attendanceCacheIds.forEach((id) => axiosClient.storage.remove(id));
            attendanceCacheIds.clear(); // Xóa danh sách cache ID sau khi xóa
            // console.log(
            //   "attendanceCacheIds after clearing:",
            //   attendanceCacheIds
            // ); // Log sau khi xóa
          },
        },
      }
    );
  },
  getAttendance: (requestBody: GetAttendanceBody) => {
    const cacheId = createCacheId("get-attendance", requestBody);
    attendanceDetailCacheIds.set(
      requestBody.Date + requestBody.SlotId,
      cacheId
    ); // Lưu cache ID với ID của attendance
    // console.log("Added attendanceDetailCacheId:", cacheId); // Log cache ID khi thêm
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
            // console.log("Clearing attendanceCacheIds:", attendanceCacheIds); // Log trước khi xóa
            // Xóa tất cả cache ID của searchAttendance
            attendanceCacheIds.forEach((id) => axiosClient.storage.remove(id));
            attendanceCacheIds.clear(); // Xóa danh sách cache ID sau khi xóa

            // Xóa cache ID của getAttendance có cùng ID
            const attendanceDetailCacheId = attendanceDetailCacheIds.get(
              requestBody.date + requestBody.slotId
            );
            if (attendanceDetailCacheId) {
              axiosClient.storage.remove(attendanceDetailCacheId);
              attendanceDetailCacheIds.delete(
                requestBody.date + requestBody.slotId
              );
              // console.log(
              //   "Removed attendanceDetailCacheId:",
              //   attendanceDetailCacheId
              // ); // Log cache ID sau khi xóa
            }
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
            const attendanceDetailCacheId = attendanceDetailCacheIds.get(
              requestBody.date + requestBody.slotId
            );
            if (attendanceDetailCacheId) {
              axiosClient.storage.remove(attendanceDetailCacheId);
              attendanceDetailCacheIds.delete(
                requestBody.date + requestBody.slotId
              );
              // console.log(
              //   "Removed attendanceDetailCacheId:",
              //   attendanceDetailCacheId
              // ); // Log cache ID sau khi xóa
            }
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
