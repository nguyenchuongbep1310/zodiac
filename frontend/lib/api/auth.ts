import apiClient from "./client";
import {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  TokenPair,
} from "@/lib/types/api";

export const authApi = {
  register: async (data: RegisterRequest): Promise<TokenPair> => {
    const res = await apiClient.post<TokenPair>("/v1/auth/register", data);
    return res.data;
  },

  login: async (data: LoginRequest): Promise<TokenPair> => {
    const res = await apiClient.post<TokenPair>("/v1/auth/login", data);
    return res.data;
  },

  refresh: async (refreshToken: string): Promise<TokenPair> => {
    const res = await apiClient.post<TokenPair>("/v1/auth/refresh", {
      refresh_token: refreshToken,
    });
    return res.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post("/v1/auth/forgot-password", data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post("/v1/auth/reset-password", data);
  },
};
