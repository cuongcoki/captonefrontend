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
  password: string;
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
    // Create a request body object
    const requestBody = { RoleId, searchTerm, IsActive, PageIndex, PageSize };

    // Create cache ID based on the request body
    const cacheId = createCacheId("all-users", requestBody);

    // Add cache ID to the cacheIds set
    cacheIds.add(cacheId);

    // Log the added cache ID
    console.log("Added cacheId:", cacheId);

    // Make GET request with the request body as query parameters
    return axiosClient.get(`${endPointConstant.BASE_URL}/users`, {
      params: requestBody, // Pass the request body as query parameters
      id: cacheId, // Include the cache ID in the request configuration
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
          console.log("Clearing cacheIds:", cacheIds); // Log trước khi xóa
          // Xóa tất cả cache ID của searchMaterial
          cacheIds.forEach((id) => axiosClient.storage.remove(id));
          cacheIds.clear(); // Xóa danh sách cache ID sau khi xóa
          console.log("cacheIds after clearing:", cacheIds); // Log sau khi xóa
        },
      },
    }),

  changeUserStatus: (id: string, isActive: boolean) => {
    // Create a request body object
    const requestBody = { id, isActive };

    // Create cache ID based on the request body
    const cacheId = createCacheId("change-user-status", requestBody);

    // Add cache ID to the cacheIds set
    cacheIds.add(cacheId);

    // Log the added cache ID
    console.log("Added cacheId:", cacheId);

    // Make PUT request to change the user status
    return axiosClient.put(
      `${endPointConstant.BASE_URL}/users/${id}/status/${isActive}`,
      null, // No request body for this PUT request
      {
        cache: {
          update: () => {
            // Remove all cache entries in cacheIds
            listUserCacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            listUserCacheIds.clear();
            cacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });

            // Clear the cacheIds set after removing all cache entries
            cacheIds.clear();

            // Remove cache ID of getMaterial with the same user ID
            const userCacheId = userCacheIds.get(requestBody.id);
            if (userCacheId) {
              axiosClient.storage.remove(userCacheId);
              userCacheIds.delete(requestBody.id);
              console.log("Removed materialCacheId:", userCacheId);
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
            cacheIds.clear(); // Xóa danh sách cache ID sau khi xóa

            // Xóa cache ID của getMaterial có cùng ID
            const userCacheId = userCacheIds.get(user.id);
            if (userCacheId) {
              axiosClient.storage.remove(userCacheId);
              userCacheIds.delete(user.id);
              console.log("Removed materialCacheId:", userCacheId); // Log cache ID sau khi xóa
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
            listUserCacheIds.clear(); // Xóa danh sách cache ID sau khi xóa
            cacheIds.forEach((id) => {
              axiosClient.storage.remove(id);
            });
            cacheIds.clear(); // Xóa danh sách cache ID sau khi xóa

            // Xóa cache ID của getMaterial có cùng ID
            const userCacheId = userCacheIds.get(user.id);
            if (userCacheId) {
              axiosClient.storage.remove(userCacheId);
              userCacheIds.delete(user.id);
              console.log("Removed materialCacheId:", userCacheId); // Log cache ID sau khi xóa
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
            cacheIds.clear(); // Xóa danh sách cache ID sau khi xóa
          },
        },
      }
    );
  },

   getUserCompany: (companyId:string) => {
    return axiosClient.get(`${endPointConstant.BASE_URL}/users/Company`, {
      params: {
        CompanyId: companyId
      }
    });
  }

};
