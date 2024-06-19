import { searchMaterial } from "@/types/material.type";
import axiosClient from "../auth/jwtService";

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
    console.log("Added attendanceCacheId:", cacheId); // Log cache ID khi thêm
    return axiosClient.get<searchAttendanceOverallResponse>(
      `${endPointConstant.BASE_URL}/attendance/overall`,
      {
        params: requestBody,
        id: cacheId,
      }
    );
  },
  createAttendance: (requestBody: CreateAttendanceSlotBody) => {
    return axiosClient.post<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/attendance/batch`,
      requestBody,
      {
        cache: {
          update: () => {
            console.log("Clearing attendanceCacheIds:", attendanceCacheIds); // Log trước khi xóa
            // Xóa tất cả cache ID của searchAttendance
            attendanceCacheIds.forEach((id) => axiosClient.storage.remove(id));
            attendanceCacheIds.clear(); // Xóa danh sách cache ID sau khi xóa
            console.log(
              "attendanceCacheIds after clearing:",
              attendanceCacheIds
            ); // Log sau khi xóa
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
    console.log("Added attendanceDetailCacheId:", cacheId); // Log cache ID khi thêm
    return axiosClient.get<GetAttendanceResponse>(
      `${endPointConstant.BASE_URL}/attendance`,
      {
        params: requestBody,
        id: cacheId,
      }
    );
  },
  updateAttendance: (requestBody: UpdateAttendanceBody) => {
    return axiosClient.put<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/attendance`,
      requestBody,
      {
        cache: {
          update: () => {
            console.log("Clearing attendanceCacheIds:", attendanceCacheIds); // Log trước khi xóa
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
              console.log(
                "Removed attendanceDetailCacheId:",
                attendanceDetailCacheId
              ); // Log cache ID sau khi xóa
            }
          },
        },
      }
    );
  },
  getUsers: (requestBody: GetUsersBody) => {
    const cacheId = createCacheId("get-users", requestBody);
    console.log("Added usersCacheId:", cacheId); // Log cache ID khi thêm
    return axiosClient.get<GetUsersResponse>(
      `${endPointConstant.BASE_URL}/users`,
      {
        params: requestBody,
        id: cacheId,
      }
    );
  },
};
