import axios from "axios";
import { refreshToken } from "./apis";
import API_URL from "./ApiUrl";
import { AppErrorCode } from "@/src/types/types";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let pendingRequests = [];

// Interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor để xử lý token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu token hết hạn (mã 400)
    if (error.response?.status === 400 && !originalRequest._retry) {
      if (error.response.error_code === AppErrorCode.INVALID_REFRESH_TOKEN) {
        // Refresh token hết hạn => logout
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
      if (isRefreshing) {
        // Nếu đang refresh, hãy chờ cho đến khi có token mới
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }

            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const { data } = await refreshToken(); // Hàm làm mới token

        localStorage.setItem("access_token", data.access_token);
        console.log(data);

        // Xử lý các yêu cầu đã xếp hàng
        pendingRequests.forEach((req) => req.resolve(data.access_token));
        pendingRequests = [];

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] =
            `Bearer ${data.access_token}`;
        }

        return axiosInstance(originalRequest);
      } catch (err) {
        pendingRequests.forEach((req) => req.reject(err));
        pendingRequests = [];
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
