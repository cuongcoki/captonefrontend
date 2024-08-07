// ** Axios import
import axios from "axios";
import { useRouter, usePathname } from 'next/navigation';
// ** Config import
import jwtConfig from "@/configs/auth";
import { authService } from "./authService";
import { setupCache } from "axios-cache-interceptor";
import toast from "react-hot-toast";
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
});
const cache = setupCache(axiosInstance, {
  ttl: 15 * 60 * 1000, // Thời gian bộ nhớ đệm (15 phút)
});
const axiosClient = cache;
axiosClient.interceptors.request.use(
  async (config) => {
    const jwtToken = localStorage.getItem(jwtConfig.storageTokenKeyName);
    if (jwtToken && config.headers) {
      config.headers.Authorization = `${jwtConfig.tokenType} ${jwtToken}`;
    }

    return config;
  },
  async (error) => {
    return Promise.reject(error.response.data.errors[0].message);
  }
);
axiosClient.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    // toast.error(error.response.data.message)
    console.log(error);
    if (error.response) {
      // const { code } = error
      const config = error.config;
      if (error.response.status === 401) {
        toast.error(error.response.data.message)
        return authService
          .refreshToken()
          .then((rs) => {
            if (rs.data?.data?.accessToken) {
              const payload = rs.data.data;
              config.headers = {
                ...config.headers,
                Authorization: `${jwtConfig.tokenType} ${payload.accessToken}`,
              };
              authService.updateStorageWhenRefreshToken(payload);

              return axiosClient(config);
            } else {
              console.log("loi2");
              authService.removeLocalStorageWhenLogout();
              if (window.location.pathname !== '/sign-in') {
                window.location.href = jwtConfig.loginEndpoint;
              }
            }
          })
          .catch((err) => {
            console.log("loi1");
            console.log(err);
            toast.error(err.response.data.message)
            authService.removeLocalStorageWhenLogout();
            if (window.location.pathname !== '/sign-in') {
              window.location.href = jwtConfig.loginEndpoint;
            }
          });
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

const clearCache = (url: string) => {
  axiosClient.storage.remove(url);
};

export default axiosClient;
