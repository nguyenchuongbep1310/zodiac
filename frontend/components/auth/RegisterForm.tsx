"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/types/api";

const schema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters")
      .max(128, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const { register: registerMutation } = useAuth();
  const { error: toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }: FormData) => {
    try {
      await registerMutation.mutateAsync({ email, password });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          toastError("Email already registered", "Please login instead.");
        } else {
          toastError("Registration failed", err.message);
        }
      } else {
        toastError("Registration failed", "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        id="register-email"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        icon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        id="register-password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="Minimum 12 characters"
        icon={<Lock className="h-4 w-4" />}
        hint="Must be at least 12 characters"
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        id="register-confirm-password"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="Repeat your password"
        icon={<ShieldCheck className="h-4 w-4" />}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={registerMutation.isPending}
      >
        Create account
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
