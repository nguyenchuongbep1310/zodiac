"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const { success: toastSuccess } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await forgotPassword.mutateAsync(data);
    toastSuccess(
      "Request sent",
      "If an account with that email exists, a password reset link has been sent."
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        id="forgot-password-email"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        icon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register("email")}
      />

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={forgotPassword.isPending}
      >
        Send reset link
      </Button>

      <p className="text-center text-sm text-slate-500">
        Remember your password?{" "}
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
