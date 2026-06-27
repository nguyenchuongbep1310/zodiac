import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Zodiac account to start calculating natal charts.",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-slate-100">Create an account</h2>
        <p className="text-sm text-slate-400 mt-1">
          Join Zodiac to explore your natal chart
        </p>
      </div>
      <RegisterForm />
    </>
  );
}
