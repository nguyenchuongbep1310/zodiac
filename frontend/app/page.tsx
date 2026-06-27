import { redirect } from "next/navigation";

// Root page: always redirect to dashboard (middleware handles auth check)
export default function HomePage() {
  redirect("/dashboard");
}
