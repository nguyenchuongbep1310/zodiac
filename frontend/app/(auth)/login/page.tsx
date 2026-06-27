import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Zodiac account to access your natal charts.",
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-slate-100">Welcome back</h2>
        <p className="text-sm text-slate-400 mt-1">Sign in to your account</p>
      </div>
      <LoginForm />
    </>
  );
}
