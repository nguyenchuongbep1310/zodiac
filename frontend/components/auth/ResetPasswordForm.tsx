"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/types/api";

const schema = z
  .object({
    newPassword: z.string().min(12, "Password must be at least 12 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { resetPassword } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword.mutateAsync({ token, new_password: data.newPassword });
      toastSuccess(
        "Password Reset",
        "Your password has been changed successfully. You can now sign in."
      );
    } catch (err) {
      if (err instanceof ApiError) {
        toastError("Password reset failed", err.message);
      } else {
        toastError(
          "Password reset failed",
          "Something went wrong. Please try again."
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        id="new-password"
        label="New Password"
        type="password"
        placeholder="••••••••••••"
        icon={<Lock className="h-4 w-4" />}
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <Input
        id="confirm-password"
        label="Confirm New Password"
        type="password"
        placeholder="••••••••••••"
        icon={<Lock className="h-4 w-4" />}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={resetPassword.isPending}
      >
        Reset Password
      </Button>
    </form>
  );
}
