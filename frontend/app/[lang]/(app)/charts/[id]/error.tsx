"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/hooks/useI18n";

export default function ChartErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language, localeHref } = useTranslation();

  useEffect(() => {
    console.error("[Chart Error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in max-w-md p-8 rounded-[2rem] bg-[var(--am-surface)] border border-[var(--am-line)] dark:border-white/10 shadow-xl">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-2xl font-display font-extrabold tracking-tight text-[var(--am-ink)] mb-2">
          {language === "vi" ? "Không Thể Hiển Thị Bản Đồ Sao" : "Couldn't Load This Chart"}
        </h1>
        <p className="text-[var(--am-muted)] mb-8 text-sm font-light leading-relaxed">
          {language === "vi"
            ? "Đã có lỗi khi tải bản đồ sao này. Vui lòng thử lại hoặc quay lại trang chủ."
            : "Something went wrong while loading this chart. Please try again or go back home."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="rounded-full px-6 py-2.5">
            {language === "vi" ? "Thử lại" : "Try again"}
          </Button>
          <Link href={localeHref("/")}>
            <Button variant="secondary" className="rounded-full px-6 py-2.5">
              {language === "vi" ? "Trang chủ" : "Go to home"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
