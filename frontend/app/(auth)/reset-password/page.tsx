"use client";

import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-slate-100">Reset Your Password</h2>
        <p className="text-sm text-slate-400 mt-1">
          Enter a new password for your account.
        </p>
      </div>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="text-center text-sm text-red-400">
          Invalid or missing password reset token. Please request a new link.
        </p>
      )}
    </>
  );
}
