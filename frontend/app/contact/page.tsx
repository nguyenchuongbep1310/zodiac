"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Clock } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export default function ContactPage() {
  const { language } = useTranslation();

  return (
    <div className="min-h-[100dvh] bg-[#F7F3ED] dark:bg-[#14110F] pt-28 sm:pt-32 pb-24 px-4 sm:px-6 transition-colors">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-[#7A6E65] hover:text-[#4A3525] dark:text-[#A8988C] dark:hover:text-[#E8DDD3] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
          {language === "vi" ? "Quay lại trang chủ" : "Back to Home"}
        </Link>

        {language === "vi" ? (
          /* VIETNAMESE VERSION */
          <div className="space-y-12">
            <header className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-serif italic text-[#4A3525] dark:text-[#E8DDD3]">
                Liên Hệ Với Chúng Tôi
              </h1>
              <p className="text-lg text-[#7A6E65] dark:text-[#A8988C] max-w-xl mx-auto font-light">
                Bạn có câu hỏi về bản đồ sao, muốn đóng góp ý kiến hoặc phản hồi lỗi? Chúng tôi luôn sẵn lòng lắng nghe bạn.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/10 p-6 text-center shadow-sm space-y-2">
                <Mail className="w-6 h-6 mx-auto text-[#8C5A3C] dark:text-[#E8B896]" />
                <h2 className="font-serif italic font-semibold text-lg text-[#4A3525] dark:text-[#E8DDD3]">Email</h2>
                <a
                  href="mailto:hello@astromind.app"
                  className="text-sm font-medium text-[#8C5A3C] dark:text-[#E8B896] hover:underline break-all block"
                >
                  hello@astromind.app
                </a>
              </div>

              <div className="rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/10 p-6 text-center shadow-sm space-y-2">
                <MessageCircle className="w-6 h-6 mx-auto text-[#8C5A3C] dark:text-[#E8B896]" />
                <h2 className="font-serif italic font-semibold text-lg text-[#4A3525] dark:text-[#E8DDD3]">Góp Ý</h2>
                <p className="text-sm text-[#7A6E65] dark:text-[#A8988C] font-light">
                  Mọi đề xuất tính năng và đóng góp xây dựng luôn được chào đón.
                </p>
              </div>

              <div className="rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/10 p-6 text-center shadow-sm space-y-2">
                <Clock className="w-6 h-6 mx-auto text-[#8C5A3C] dark:text-[#E8B896]" />
                <h2 className="font-serif italic font-semibold text-lg text-[#4A3525] dark:text-[#E8DDD3]">Thời Gian Phản Hồi</h2>
                <p className="text-sm text-[#7A6E65] dark:text-[#A8988C] font-light">
                  Chúng tôi phản hồi thông thường trong vòng 1-2 ngày làm việc.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/10 p-8 text-center shadow-sm">
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed font-light">
                Để nhận được phản hồi nhanh nhất, vui lòng gửi email trực tiếp tới{" "}
                <a
                  href="mailto:hello@astromind.app"
                  className="font-semibold text-[#8C5A3C] dark:text-[#E8B896] hover:underline"
                >
                  hello@astromind.app
                </a>
                . Nếu liên quan đến một bản đồ sao cụ thể, hãy đính kèm ngày, giờ và nơi sinh để chúng tôi hỗ trợ bạn tốt nhất.
              </p>
            </div>
          </div>
        ) : (
          /* ENGLISH VERSION */
          <div className="space-y-12">
            <header className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-serif italic text-[#4A3525] dark:text-[#E8DDD3]">
                Get in Touch
              </h1>
              <p className="text-lg text-[#7A6E65] dark:text-[#A8988C] max-w-xl mx-auto font-light">
                Questions about your chart, a bug to report, or an idea for AstroMind? We&apos;d love to hear from you.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/10 p-6 text-center shadow-sm space-y-2">
                <Mail className="w-6 h-6 mx-auto text-[#8C5A3C] dark:text-[#E8B896]" />
                <h2 className="font-serif italic font-semibold text-lg text-[#4A3525] dark:text-[#E8DDD3]">Email</h2>
                <a
                  href="mailto:hello@astromind.app"
                  className="text-sm font-medium text-[#8C5A3C] dark:text-[#E8B896] hover:underline break-all block"
                >
                  hello@astromind.app
                </a>
              </div>

              <div className="rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/10 p-6 text-center shadow-sm space-y-2">
                <MessageCircle className="w-6 h-6 mx-auto text-[#8C5A3C] dark:text-[#E8B896]" />
                <h2 className="font-serif italic font-semibold text-lg text-[#4A3525] dark:text-[#E8DDD3]">Feedback</h2>
                <p className="text-sm text-[#7A6E65] dark:text-[#A8988C] font-light">
                  Feature requests and feedback are always warmly welcomed.
                </p>
              </div>

              <div className="rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/10 p-6 text-center shadow-sm space-y-2">
                <Clock className="w-6 h-6 mx-auto text-[#8C5A3C] dark:text-[#E8B896]" />
                <h2 className="font-serif italic font-semibold text-lg text-[#4A3525] dark:text-[#E8DDD3]">Response Time</h2>
                <p className="text-sm text-[#7A6E65] dark:text-[#A8988C] font-light">
                  We typically reply within 1&ndash;2 business days.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/10 p-8 text-center shadow-sm">
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed font-light">
                For the fastest response, email us directly at{" "}
                <a
                  href="mailto:hello@astromind.app"
                  className="font-semibold text-[#8C5A3C] dark:text-[#E8B896] hover:underline"
                >
                  hello@astromind.app
                </a>
                . If your inquiry is regarding a specific chart, please include the birth date, time, and location used.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
