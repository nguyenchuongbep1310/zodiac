"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/hooks/useI18n";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const { language } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F7F3ED] dark:bg-[#14110F] flex items-center justify-center px-4 transition-colors">
      <div className="text-center animate-fade-in max-w-md p-8 rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/10 shadow-xl">
        <div className="text-6xl mb-4 font-serif italic font-bold text-[#8C5A3C] dark:text-[#E8B896]">404</div>
        <div className="text-3xl mb-4 text-[#B5A499]">✦</div>
        <h1 className="text-2xl font-serif italic font-bold text-[#4A3525] dark:text-[#E8DDD3] mb-2">
          {language === "vi" ? "Không Tìm Thấy Trang" : "Page Not Found"}
        </h1>
        <p className="text-[#7A6E65] dark:text-[#A8988C] mb-8 text-sm font-light leading-relaxed">
          {language === "vi"
            ? "Thiên thể này dường như đã trôi ra khỏi tầm quan sát. Hãy để các vì sao dẫn lối bạn quay về."
            : "This celestial body has drifted out of our reach. Let the stars guide you back."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5C4033] to-[#8C5A3C] hover:from-[#4A3525] hover:to-[#7A4A30] px-6 py-3 text-sm font-semibold text-[#F7F3ED] transition-all shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "vi" ? "Quay lại trang chủ" : "Return to home"}
        </Link>
      </div>
    </div>
  );
}
