"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/authStore";
import { ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest } from "@/lib/types/api";

export function useAuth() {
  const router = useRouter();
  const { isAuthenticated, userId, userEmail, userRole, setTokens, logout } =
    useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (pair) => {
      setTokens(pair);
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (pair) => {
      setTokens(pair);
      router.push("/dashboard");
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    // onSuccess can be used to show a notification to the user
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      // On success, maybe redirect to login with a success message
      router.push("/login");
    },
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return {
    isAuthenticated,
    userId,
    userEmail,
    userRole,
    login: loginMutation,
    register: registerMutation,
    logout: handleLogout,
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
  };
}
