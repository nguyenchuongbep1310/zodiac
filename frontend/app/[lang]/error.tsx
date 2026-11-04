"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/hooks/useI18n";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language, localeHref } = useTranslation();

  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] bg-[var(--am-bg)] flex items-center justify-center px-4 transition-colors">
      <div className="text-center animate-fade-in max-w-md p-8 rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] shadow-[var(--am-shadow)]">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-2xl font-display font-extrabold tracking-tight text-[var(--am-ink)] mb-2">
          {language === "vi" ? "Đã Xảy Ra Lỗi" : "Something Went Wrong"}
        </h1>
        <p className="text-[var(--am-muted)] mb-8 text-sm font-light leading-relaxed">
          {language === "vi"
            ? "Đã xảy ra sự gián đoạn năng lượng không mong muốn. Vui lòng thử lại hoặc quay lại trang chủ."
            : "An unexpected error occurred. The planets are momentarily misaligned — please try again."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="rounded-[var(--am-radius)] px-6 py-2.5">
            {language === "vi" ? "Thử lại" : "Try again"}
          </Button>
          <Button variant="secondary" onClick={() => (window.location.href = localeHref("/"))} className="rounded-[var(--am-radius)] px-6 py-2.5">
            {language === "vi" ? "Trang chủ" : "Go to home"}
          </Button>
        </div>
      </div>
    </div>
  );
}
