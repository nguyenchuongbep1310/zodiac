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
  const { language } = useTranslation();

  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] bg-[#F7F3ED] dark:bg-[#14110F] flex items-center justify-center px-4 transition-colors">
      <div className="text-center animate-fade-in max-w-md p-8 rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/10 shadow-xl">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-2xl font-serif italic font-bold text-[#4A3525] dark:text-[#E8DDD3] mb-2">
          {language === "vi" ? "Đã Xảy Ra Lỗi" : "Something Went Wrong"}
        </h1>
        <p className="text-[#7A6E65] dark:text-[#A8988C] mb-8 text-sm font-light leading-relaxed">
          {language === "vi"
            ? "Đã xảy ra sự gián đoạn năng lượng không mong muốn. Vui lòng thử lại hoặc quay lại trang chủ."
            : "An unexpected error occurred. The planets are momentarily misaligned — please try again."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="rounded-full px-6 py-2.5">
            {language === "vi" ? "Thử lại" : "Try again"}
          </Button>
          <Button variant="secondary" onClick={() => (window.location.href = "/")} className="rounded-full px-6 py-2.5">
            {language === "vi" ? "Trang chủ" : "Go to home"}
          </Button>
        </div>
      </div>
    </div>
  );
}
