"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Clock } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export default function ContactPage() {
  const { language, localeHref } = useTranslation();

  return (
    <div className="min-h-[100dvh] bg-[var(--am-bg)] pt-28 sm:pt-32 pb-24 px-4 sm:px-6 transition-colors">
      <div className="max-w-3xl mx-auto">
        <Link
          href={localeHref("/")}
          className="inline-flex items-center text-sm font-medium text-[var(--am-muted)] hover:text-[var(--am-ink)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
          {language === "vi" ? "Quay lại trang chủ" : "Back to Home"}
        </Link>

        {language === "vi" ? (
          /* VIETNAMESE VERSION */
          <div className="space-y-12">
            <header className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                Liên Hệ Với Chúng Tôi
              </h1>
              <p className="text-lg text-[var(--am-muted)] max-w-xl mx-auto font-light">
                Bạn có câu hỏi về bản đồ sao, muốn đóng góp ý kiến hoặc phản hồi lỗi? Chúng tôi luôn sẵn lòng lắng nghe bạn.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] p-6 text-center shadow-[var(--am-shadow-sm)] space-y-2">
                <Mail className="w-6 h-6 mx-auto text-[var(--am-primary)]" />
                <h2 className="font-display font-bold tracking-tight font-semibold text-lg text-[var(--am-ink)]">Email</h2>
                <a
                  href="mailto:hello@astromind.app"
                  className="text-sm font-medium text-[var(--am-primary)] hover:underline break-all block"
                >
                  hello@astromind.app
                </a>
              </div>

              <div className="rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] p-6 text-center shadow-[var(--am-shadow-sm)] space-y-2">
                <MessageCircle className="w-6 h-6 mx-auto text-[var(--am-primary)]" />
                <h2 className="font-display font-bold tracking-tight font-semibold text-lg text-[var(--am-ink)]">Góp Ý</h2>
                <p className="text-sm text-[var(--am-muted)] font-light">
                  Mọi đề xuất tính năng và đóng góp xây dựng luôn được chào đón.
                </p>
              </div>

              <div className="rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] p-6 text-center shadow-[var(--am-shadow-sm)] space-y-2">
                <Clock className="w-6 h-6 mx-auto text-[var(--am-primary)]" />
                <h2 className="font-display font-bold tracking-tight font-semibold text-lg text-[var(--am-ink)]">Thời Gian Phản Hồi</h2>
                <p className="text-sm text-[var(--am-muted)] font-light">
                  Chúng tôi phản hồi thông thường trong vòng 1-2 ngày làm việc.
                </p>
              </div>
            </div>

            <div className="rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] p-8 text-center shadow-[var(--am-shadow-sm)]">
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed font-light">
                Để nhận được phản hồi nhanh nhất, vui lòng gửi email trực tiếp tới{" "}
                <a
                  href="mailto:hello@astromind.app"
                  className="font-semibold text-[var(--am-primary)] hover:underline"
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
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                Get in Touch
              </h1>
              <p className="text-lg text-[var(--am-muted)] max-w-xl mx-auto font-light">
                Questions about your chart, a bug to report, or an idea for AstroMind? We&apos;d love to hear from you.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] p-6 text-center shadow-[var(--am-shadow-sm)] space-y-2">
                <Mail className="w-6 h-6 mx-auto text-[var(--am-primary)]" />
                <h2 className="font-display font-bold tracking-tight font-semibold text-lg text-[var(--am-ink)]">Email</h2>
                <a
                  href="mailto:hello@astromind.app"
                  className="text-sm font-medium text-[var(--am-primary)] hover:underline break-all block"
                >
                  hello@astromind.app
                </a>
              </div>

              <div className="rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] p-6 text-center shadow-[var(--am-shadow-sm)] space-y-2">
                <MessageCircle className="w-6 h-6 mx-auto text-[var(--am-primary)]" />
                <h2 className="font-display font-bold tracking-tight font-semibold text-lg text-[var(--am-ink)]">Feedback</h2>
                <p className="text-sm text-[var(--am-muted)] font-light">
                  Feature requests and feedback are always warmly welcomed.
                </p>
              </div>

              <div className="rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] p-6 text-center shadow-[var(--am-shadow-sm)] space-y-2">
                <Clock className="w-6 h-6 mx-auto text-[var(--am-primary)]" />
                <h2 className="font-display font-bold tracking-tight font-semibold text-lg text-[var(--am-ink)]">Response Time</h2>
                <p className="text-sm text-[var(--am-muted)] font-light">
                  We typically reply within 1&ndash;2 business days.
                </p>
              </div>
            </div>

            <div className="rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] p-8 text-center shadow-[var(--am-shadow-sm)]">
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed font-light">
                For the fastest response, email us directly at{" "}
                <a
                  href="mailto:hello@astromind.app"
                  className="font-semibold text-[var(--am-primary)] hover:underline"
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
