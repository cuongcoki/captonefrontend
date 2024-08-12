// ** Axios client import
import { UserUpdateFormType } from "@/schema";
import axiosClient from "../auth/jwtService";

// ** Constants import
import { endPointConstant } from "@/constants/endpoint";
import { SuccessResponse } from "@/types/util.type";
import ChangePasswod from "@/components/shared/change-password/change-password";

// ** Function to create unique cache ID
const createCacheId = (base: string, params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return `${base}?${query}`;
};

// ** Store for cache IDs
const cacheIds: Set<string> = new Set();
const userCacheIds: Map<string, string> = new Map();
const listUserCacheIds: Set<string> = new Set();

type userType = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  // password: string;
  roleId: number;
  dob: string;
  gender: string;
  isActive: boolean;
  companyId: string;
  avatar: any;
  salaryByDayRequest: SalaryByDayRequest;
  salaryOverTimeRequest: salaryOverTimeRequest;
};
type SalaryByDayRequest = {
  salary: number;
  startDate: string;
};
type salaryOverTimeRequest = {
  salary: number;
  startDate: string;
};

type userUpdateType = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  roleId: number;
  dob: string;
  gender: string;
  companyId: string;
  avatar: string;
  salaryByDayRequest: SalaryByDayRequest;
  salaryOverTimeRequest: salaryOverTimeRequest;
};

type changePasswordBody = {
  userId: string;
  oldPassword: string;
  newPassword: string;
};

export const userApi = {
  allUsers: (
    RoleId: number,
    searchTerm: string,
    IsActive: any,
    PageIndex: any,
    PageSize: any
  ) => {
    const requestBody = { RoleId, searchTerm, IsActive, PageIndex, PageSize };
    const cacheId = createCacheId("all-users", requestBody);

    cacheIds.add(cacheId);


    return axiosClient.get(`${endPointConstant.BASE_URL}/users`, {
      params: requestBody,
      id: cacheId,
    });
  },

  getUserId: (id: string) => {
    const cacheId = createCacheId("get-user", { id });
    listUserCacheIds.add(cacheId);
    return axiosClient.get(`${endPointConstant.BASE_URL}/users/${id}`, {
      id: cacheId,
    });
  },

  createUser: (data: userType) =>
    axiosClient.post(`${endPointConstant.BASE_URL}/users`, data, {
      cache: {
        update: () => {
          cacheIds.forEach((id) => axiosClient.storage.remove(id));
          cacheIds.clear(); // Xóa danh sách cache ID sau khi xóa
        },
      },
    }),

  changeUserStatus: (id: string, isActive: boolean) => {
    const requestBody = { id, isActive };
    const cacheId = createCacheId("change-user-status", requestBody);
    cacheIds.add(cacheId);

    return axiosClient.put(
      `${endPointConstant.BASE_URL}/users/${id}/status/${isActive}`,
      null,
      {
        cache: {
          update: () => {
            listUserCacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            listUserCacheIds.clear();
            cacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });

            cacheIds.clear();

            const userCacheId = userCacheIds.get(requestBody.id);
            if (userCacheId) {
              axiosClient.storage.remove(userCacheId);
              userCacheIds.delete(requestBody.id);
            }
          },
        },
      }
    );
  },

  updateUser: (user: UserUpdateFormType) =>
    axiosClient.put<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/users`,
      user,
      {
        cache: {
          update: () => {
            cacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            cacheIds.clear();

            const userCacheId = userCacheIds.get(user.id);
            if (userCacheId) {
              axiosClient.storage.remove(userCacheId);
              userCacheIds.delete(user.id);
            }
          },
        },
      }
    ),

  userUpdate: (user: userUpdateType) =>
    axiosClient.put<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/users`,
      user,
      {
        cache: {
          update: () => {
            listUserCacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            listUserCacheIds.clear();
            cacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            cacheIds.clear();

            const userCacheId = userCacheIds.get(user.id);
            if (userCacheId) {
              axiosClient.storage.remove(userCacheId);
              userCacheIds.delete(user.id);
            }
          },
        },
      }
    ),

  changePassword: (body: changePasswordBody) => {
    return axiosClient.put<SuccessResponse<null>>(
      `${endPointConstant.BASE_URL}/users/change-password`,
      body,
      {
        cache: {
          update: () => {
            cacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            cacheIds.clear();
          },
        },
      }
    );
  },

  getUserCompany: (companyId: string) => {
    return axiosClient.get(`${endPointConstant.BASE_URL}/users/Company`, {
      params: {
        CompanyId: companyId
      }
    });
  },

  getMe: (UserID: string) =>
    axiosClient.get(`${endPointConstant.BASE_URL}/users/me`, {
      params: {
        CompanyId: UserID
      }
    })

};
