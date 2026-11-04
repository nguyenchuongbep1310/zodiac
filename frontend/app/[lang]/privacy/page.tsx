"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export default function PrivacyPage() {
  const { language, localeHref } = useTranslation();

  return (
    <div className="min-h-[100dvh] bg-[var(--am-bg)] pt-28 sm:pt-32 pb-24 px-4 sm:px-6 transition-colors">
      <div className="max-w-3xl mx-auto">
        <Link
          href={localeHref("/")}
          className="inline-flex items-center text-sm font-medium text-[var(--am-muted)] hover:text-[var(--am-ink)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 motion-safe:group-hover:-translate-x-0.5 transition-transform" />
          {language === "vi" ? "Quay lại trang chủ" : "Back to Home"}
        </Link>

        {language === "vi" ? (
          /* VIETNAMESE VERSION */
          <div className="space-y-8">
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--am-ink)] mb-3">
                Chính Sách Bảo Mật
              </h1>
              <p className="text-[var(--am-muted)] font-light">
                Cập nhật lần cuối: Tháng 8, 2026
              </p>
            </header>

            <div className="space-y-8 text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed font-light">
              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">1. Dữ Liệu Chúng Tôi Thu Thập</h2>
                <p>
                  Để tính toán bản đồ sao cá nhân của bạn một cách chuẩn xác, hệ thống yêu cầu thông tin về ngày sinh, giờ sinh và địa điểm sinh.
                  Dữ liệu này chỉ được sử dụng duy nhất cho mục đích tính toán thiên văn (tọa độ hành tinh, đỉnh nhà, góc chiếu) và không bao giờ
                  bị bán cho bên thứ ba hoặc dùng để theo dõi quảng cáo. Mỗi biểu đồ bạn tạo (tên, ngày giờ sinh, địa điểm và kết quả tính toán) được
                  lưu trên máy chủ của chúng tôi và ai có đường dẫn biểu đồ đều có thể xem; bạn có thể yêu cầu xóa như nêu ở Mục 4. Khi tìm kiếm thành phố,
                  tên thành phố bạn nhập được gửi tới dịch vụ bản đồ OpenStreetMap Nominatim.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">2. Mục Đích Sử Dụng Dữ Liệu</h2>
                <p>
                  Thông tin ngày giờ sinh chỉ được dùng để xuất biểu đồ và các luận giải chiêm tinh liên quan (vận trình transit, bản đồ sao đôi synastry,
                  tiến triển thứ cấp progressions). Chúng tôi tôn trọng quyền riêng tư tuyệt đối của người dùng.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">3. Lưu Trữ Cục Bộ (Local Storage)</h2>
                <p>
                  Hệ thống sử dụng bộ nhớ cục bộ trên trình duyệt để lưu lại ngôn ngữ ưa thích (Tiếng Việt / English) và giao diện sáng/tối.
                  Chúng tôi không sử dụng các đoạn mã theo dõi hành vi của bên thứ ba.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">4. Quyền Của Bạn</h2>
                <p>
                  Bạn có toàn quyền yêu cầu xóa bất kỳ dữ liệu hồ sơ nào đã lưu trên hệ thống bất kỳ lúc nào bằng cách liên hệ với chúng tôi qua email:{" "}
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
                Privacy Policy
              </h1>
              <p className="text-[var(--am-muted)] font-light">
                Last updated: August 2026
              </p>
            </header>

            <div className="space-y-8 text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed font-light">
              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">1. What We Collect</h2>
                <p>
                  To calculate your natal chart, AstroMind requests your birth date, birth time, and birth location. This information is used
                  solely to compute astronomical data (planetary positions, house cusps, and aspects) and is never sold to third parties or used for advertising profiling.
                  Each chart you create (name, birth details, location and the computed result) is stored on our servers and can be viewed by anyone who has
                  its link; you can request deletion as described in Section 4. When you search for a city, the text you type is sent to the OpenStreetMap
                  Nominatim geocoding service.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">2. How We Use Your Data</h2>
                <p>
                  Birth data is used exclusively to generate your chart and related interpretations (transits, synastry, progressions). We do not share
                  individual birth data with advertisers or data brokers.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">3. Local Storage &amp; Cookies</h2>
                <p>
                  We use local storage to remember your language and theme preferences. We do not employ third-party advertising trackers.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">4. Your Rights</h2>
                <p>
                  You may request deletion of your saved profiles or charts at any time by reaching out to us at{" "}
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
