"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/types/api";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { login } = useAuth();
  const { error: toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await login.mutateAsync(data);
    } catch (err) {
      if (err instanceof ApiError) {
        toastError("Login failed", err.message);
      } else {
        toastError("Login failed", "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        id="login-email"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        icon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        id="login-password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••••••"
        icon={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="text-right text-sm">
        <Link
          href="/forgot-password"
          className="text-slate-400 hover:text-slate-300 transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={login.isPending}
      >
        Sign in
      </Button>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
