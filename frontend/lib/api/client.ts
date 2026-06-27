import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError, ApiErrorResponse, TokenPair } from "@/lib/types/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const ACCESS_TOKEN_KEY = "zodiac_access_token";
const REFRESH_TOKEN_KEY = "zodiac_refresh_token";

// ─── Token helpers ────────────────────────────────────────────────────────────

export const tokenStorage = {
  getAccess: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefresh: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  set: (pair: TokenPair): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, pair.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, pair.refresh_token);
    document.cookie = "zodiac_auth_check=authenticated; path=/; max-age=604800; samesite=lax";
  },
  clear: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    document.cookie = "zodiac_auth_check=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },
};

// ─── Axios instance ───────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ─── Request interceptor: attach Bearer token ─────────────────────────────────

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: 401 → refresh → retry ─────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Parse API error
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401 && !originalRequest._retry) {
        const refreshToken = tokenStorage.getRefresh();

        if (!refreshToken) {
          tokenStorage.clear();
          if (typeof window !== "undefined") window.location.href = "/login";
          return Promise.reject(
            new ApiError(401, "UNAUTHORIZED", "Session expired")
          );
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data: pair } = await axios.post<TokenPair>(
            `${BASE_URL}/v1/auth/refresh`,
            { refresh_token: refreshToken }
          );
          tokenStorage.set(pair);
          apiClient.defaults.headers.common.Authorization = `Bearer ${pair.access_token}`;
          processQueue(null, pair.access_token);
          originalRequest.headers.Authorization = `Bearer ${pair.access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          tokenStorage.clear();
          if (typeof window !== "undefined") window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      throw new ApiError(
        status,
        data?.code || "UNKNOWN_ERROR",
        data?.message || "An unexpected error occurred",
        data?.details
      );
    }

    throw new ApiError(0, "NETWORK_ERROR", "Network error — please check your connection");
  }
);

export default apiClient;
