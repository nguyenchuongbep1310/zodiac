"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/hooks/useI18n";

export default function SynastryErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language, localeHref } = useTranslation();

  useEffect(() => {
    console.error("[Synastry Error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in max-w-md p-8 rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] shadow-[var(--am-shadow)]">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-2xl font-display font-extrabold tracking-tight text-[var(--am-ink)] mb-2">
          {language === "vi" ? "Không Thể Tính Bản Đồ Sao Đôi" : "Couldn't Load Synastry"}
        </h1>
        <p className="text-[var(--am-muted)] mb-8 text-sm font-light leading-relaxed">
          {language === "vi"
            ? "Đã có lỗi khi tính toán bản đồ sao đôi. Vui lòng thử lại hoặc quay lại trang chủ."
            : "Something went wrong while calculating synastry. Please try again or go back home."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="rounded-[var(--am-radius)] px-6 py-2.5">
            {language === "vi" ? "Thử lại" : "Try again"}
          </Button>
          <Link href={localeHref("/")}>
            <Button variant="secondary" className="rounded-[var(--am-radius)] px-6 py-2.5">
              {language === "vi" ? "Trang chủ" : "Go to home"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
