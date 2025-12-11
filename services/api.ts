import axios from "axios";
import { storage } from "../utils/storage";

// Auth Service (Port 3001)
const AUTH_API_URL = "http://localhost:3001/api/v1";

// Wallet Service (Port 3002)
const WALLET_API_URL = "http://localhost:3002/api/v1";

// Create Auth API client
export const authApi = axios.create({
  baseURL: AUTH_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create Wallet API client
export const walletApi = axios.create({
  baseURL: WALLET_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Shared request interceptor (attach token)
const requestInterceptor = async (config: {
  headers: { Authorization: string };
}) => {
  const token = await storage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.url?.includes("verify-pin")) {
    console.log("🔍 VERIFY-PIN REQUEST DEBUG:");
    console.log("URL:", config.url);
    console.log("Method:", config.method);
    console.log("Body (config.data):", JSON.stringify(config.data));
    console.log("Body type:", typeof config.data);
    console.log("Body keys:", config.data ? Object.keys(config.data) : "null");
    console.log("Headers:", config.headers);
  }

  return config;
};

// Shared response interceptor (handle token refresh)
const responseInterceptor = async (error: any) => {
  const originalRequest = error.config;

  // ✅ Only retry on 401 (Unauthorized), NOT on 400 (Bad Request)
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const refreshToken = await storage.getRefreshToken();

      // Refresh using auth service
      const { data } = await axios.post(`${AUTH_API_URL}/auth/refresh`, {
        token: refreshToken,
      });

      await storage.setAccessToken(data.accessToken);

      // ✅ IMPORTANT: Preserve original request body
      // Don't let the refresh token overwrite the original data
      const newToken = data.accessToken;

      // Clone the original request config
      const retryConfig = {
        ...originalRequest,
        headers: {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        },
      };

      // Determine which API to use
      if (originalRequest.baseURL === AUTH_API_URL) {
        return authApi(retryConfig);
      } else {
        return walletApi(retryConfig);
      }
    } catch (refreshError) {
      await storage.clearAuth();
      // Navigate to login
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
};

// Apply interceptors to both clients
authApi.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);
authApi.interceptors.response.use((response) => response, responseInterceptor);

walletApi.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);
walletApi.interceptors.response.use(
  (response) => response,
  responseInterceptor
);
