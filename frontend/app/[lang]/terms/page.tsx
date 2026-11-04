"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export default function TermsPage() {
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
          <div className="space-y-8">
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--am-ink)] mb-3">
                Điều Khoản Dịch Vụ
              </h1>
              <p className="text-[var(--am-muted)] font-light">
                Cập nhật lần cuối: Tháng 8, 2026
              </p>
            </header>

            <div className="space-y-8 text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed font-light">
              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">1. Chấp Thuận Điều Khoản</h2>
                <p>
                  Bằng việc truy cập hoặc sử dụng ứng dụng AstroMind, bạn đồng ý tuân thủ các Điều Khoản Dịch Vụ này.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">2. Bản Chất Dịch Vụ</h2>
                <p>
                  AstroMind cung cấp các công cụ tính toán bản đồ sao thiên văn và nội dung chiêm tinh học nhằm mục đích khám phá bản thân,
                  học tập và chiêm nghiệm cá nhân. Nội dung trên nền tảng không thay thế cho các lời khuyên chuyên môn về y tế, pháp lý, tài chính hoặc tâm lý.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">3. Quyền Sở Hữu Trí Tuệ</h2>
                <p>
                  Giao diện, hình ảnh nghệ thuật và nội dung biên soạn thuộc bản quyền của AstroMind. Dữ liệu bản đồ sao sinh được tạo ra dựa trên thông tin
                  của bạn thuộc quyền sở hữu của bạn và bạn có thể tự do chia sẻ, lưu trữ.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">4. Liên Hệ</h2>
                <p>
                  Mọi thắc mắc về điều khoản dịch vụ xin vui lòng gửi về:{" "}
                  <a href="mailto:hello@astromind.app" className="font-medium text-[var(--am-primary)] hover:underline">
                    hello@astromind.app
                  </a>.
                </p>
              </section>
            </div>
          </div>
        ) : (
          /* ENGLISH VERSION */
          <div className="space-y-8">
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--am-ink)] mb-3">
                Terms of Service
              </h1>
              <p className="text-[var(--am-muted)] font-light">
                Last updated: August 2026
              </p>
            </header>

            <div className="space-y-8 text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed font-light">
              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using AstroMind, you agree to be bound by these Terms of Service. If you do not agree, please discontinue using the platform.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">2. Nature of the Service</h2>
                <p>
                  AstroMind provides astrological chart calculations and educational content for self-reflection and personal growth. Nothing on this platform
                  constitutes medical, legal, financial, or psychological advice.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">3. Intellectual Property</h2>
                <p>
                  The AstroMind interface, brand, and editorial content are the property of AstroMind. Chart data generated from your birth information
                  belongs to you and may be freely exported or shared.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">4. Contact</h2>
                <p>
                  Questions regarding these terms can be directed to{" "}
                  <a href="mailto:hello@astromind.app" className="font-medium text-[var(--am-primary)] hover:underline">
                    hello@astromind.app
                  </a>.
                </p>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
