import axios, { AxiosError, AxiosInstance } from "axios";
import { ApiError, ApiErrorResponse } from "@/lib/types/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const getBaseUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || "/api";
  const trimmed = raw.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const BASE_URL = getBaseUrl();

// ─── Axios instance ───────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ─── Response interceptor: Wrap API errors ───────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Parse API error
    if (error.response) {
      const { status, data } = error.response;
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

