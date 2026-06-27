import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset for your Zodiac account.",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-slate-100">Forgot Password?</h2>
        <p className="text-sm text-slate-400 mt-1">
          Enter your email and we'll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
