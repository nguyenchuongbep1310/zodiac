"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Orbit, Clock, Compass } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export default function TransitsPage() {
  const { language, localeHref } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-fade-in">
      <Link
        href={localeHref("/learn")}
        className="inline-flex items-center text-sm font-medium text-[var(--am-muted)] hover:text-[var(--am-ink)] transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
        {language === "vi" ? "Quay lại danh mục Học Chiêm Tinh" : "Back to Learn"}
      </Link>

      {language === "vi" ? (
        /* VIETNAMESE VERSION */
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--am-primary)]/15 border border-[var(--am-primary)]/25 text-xs font-semibold tracking-widest text-[var(--am-ink)] uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Kỹ Thuật Dự Báo · Trung Cấp
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--am-ink)] leading-tight">
              Transit: Vận Trình Hành Tinh & Bầu Trời Chuyển Động
            </h1>
            <p className="text-xl text-[var(--am-muted)] font-light leading-relaxed">
              Bản đồ sao gốc là bất biến — nhưng vũ trụ luôn dịch chuyển để đánh thức các tiềm năng bên trong bạn.
            </p>
          </header>

          <div className="space-y-8">
            <div className="p-8 rounded-[2rem] bg-[var(--am-surface)] border border-[var(--am-line)] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                  <Orbit className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    Cơ Chế Hoạt Động Của Transit
                  </h2>
                  <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    Vận Hành Thiên Văn Thực Tế · Kích Hoạt Năng Lượng Gốc
                  </span>
                </div>
              </div>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Bản đồ sao lúc bạn sinh ra là bức ảnh chụp bầu trời cố định tại khoảnh khắc đầu đời. Tuy nhiên, các thiên thể
                vẫn tiếp tục quay trên quỹ đạo thiên văn mỗi ngày. Khi một hành tinh đang di chuyển (transit) tạo góc chiếu
                với một điểm trên bản đồ sao gốc của bạn, nó sẽ &ldquo;kích hoạt&rdquo; các chủ đề sự kiện và cảm xúc tương ứng.
              </p>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Ví dụ: Khi Sao Mộc transit qua Mặt Trời gốc, đây thường là giai đoạn mở rộng cơ hội, học tập và thăng tiến.
                Khi Sao Thổ transit qua cung Mọc, bạn sẽ cảm thấy nhu cầu tái cấu trúc cuộc sống và rèn giũa tính kỷ luật cá nhân.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-[var(--am-surface)] border border-[var(--am-line)] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    Nhịp Độ Thời Gian Của Các Hành Tinh
                  </h2>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Hành Tinh Cá Nhân Nhanh · Hành Tinh Xã Hội & Thế Hệ Sâu Sắc
                  </span>
                </div>
              </div>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Các hành tinh di chuyển nhanh như Mặt Trăng và Sao Thủy ảnh hưởng đến tâm trạng và nhịp độ giao tiếp hằng ngày.
                Trong khi đó, các hành tinh vòng ngoài (Sao Mộc, Sao Thổ, Sao Thiên Vương, Sao Hải Vương, Sao Diêm Vương)
                di chuyển chậm và định hình những bước ngoặt lớn kéo dài từ vài tháng đến nhiều năm trong cuộc đời.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ENGLISH VERSION */
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--am-primary)]/15 border border-[var(--am-primary)]/25 text-xs font-semibold tracking-widest text-[var(--am-ink)] uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Forecasting Techniques · Intermediate
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--am-ink)] leading-tight">
              Planetary Transits: The Living Cosmos
            </h1>
            <p className="text-xl text-[var(--am-muted)] font-light leading-relaxed">
              Your natal chart is fixed in time, but the living sky never stops moving to awaken your potential.
            </p>
          </header>

          <div className="space-y-8">
            <div className="p-8 rounded-[2rem] bg-[var(--am-surface)] border border-[var(--am-line)] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                  <Orbit className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    How Planetary Transits Work
                  </h2>
                  <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    Astronomical Motion · Natal Activation
                  </span>
                </div>
              </div>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Your birth chart is a snapshot of the celestial coordinates at the moment of your first breath. However, the
                planets continue their perpetual orbital dance through the zodiac. When a moving transit planet forms a geometric
                aspect to a natal planet, it temporarily energizes and activates that specific dimension of your psyche.
              </p>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Rather than treating transits as fatalistic predictions, modern psychological astrology approaches them as
                evolutionary weather patterns — invitations to develop conscious awareness and integrate new life skills.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-[var(--am-surface)] border border-[var(--am-line)] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    Cycles and Velocities
                  </h2>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Fast Inner Planets · Transformative Outer Cycles
                  </span>
                </div>
              </div>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Inner planets like the Moon, Mercury, Venus, and Mars move quickly, orchestrating day-to-day moods, conversations,
                and short-term focus. Outer planets like Jupiter, Saturn, Uranus, Neptune, and Pluto move slowly, marking major
                developmental chapters, structural milestones, and long-term evolutionary epochs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
