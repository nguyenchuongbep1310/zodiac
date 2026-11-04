"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Sprout, Moon, Sun } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export default function ProgressionsPage() {
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
              <Sparkles className="w-3.5 h-3.5" /> Kỹ Thuật Dự Báo · Nâng Cao
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--am-ink)] leading-tight">
              Progression: Hành Trình Tiến Triển Nội Tâm
            </h1>
            <p className="text-xl text-[var(--am-muted)] font-light leading-relaxed">
              Trong khi Transit mô tả các biến cố bên ngoài, Secondary Progression hé lộ quá trình trưởng thành và tiến hóa tâm hồn bên trong bạn.
            </p>
          </header>

          <div className="space-y-8">
            <div className="p-8 rounded-[2rem] bg-[var(--am-surface)] border border-[var(--am-line)] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    Nguyên Lý &ldquo;Một Ngày Tương Đương Một Năm&rdquo;
                  </h2>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Tiến Triển Thứ Cấp (Secondary Progressions)
                  </span>
                </div>
              </div>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Kỹ thuật Secondary Progressions sử dụng công thức thiên văn biểu trưng: mỗi ngày trôi qua sau khi bạn chào đời
                tương ứng với một năm phát triển trong cuộc đời. Ví dụ: để xem bản đồ tiến triển ở tuổi 30, hệ thống sẽ tính toán
                tọa độ các hành tinh vào ngày thứ 30 sau ngày sinh của bạn.
              </p>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Bản đồ tiến triển phản ánh sự biến chuyển chậm rãi nhưng sâu sắc của các tầng tâm lý, sở thích, thế giới quan
                và các bước chuyển giai đoạn cuộc đời.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-[var(--am-surface)] border border-[var(--am-line)] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    Mặt Trăng Tiến Triển & Chu Kỳ Cảm Xúc
                  </h2>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Chu Kỳ 28 Năm · Đổi Cung Mỗi 2.5 Năm
                  </span>
                </div>
              </div>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Mặt Trăng tiến triển di chuyển nhanh nhất trên bản đồ tiến triển, đổi cung khoảng mỗi 2.5 năm và hoàn thành
                vòng quay 12 cung sau khoảng 27-28 năm. Vị trí cung và nhà của Mặt Trăng tiến triển cho biết trọng tâm cảm xúc
                và nhu cầu trải nghiệm chính yếu của bạn trong giai đoạn đó.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ENGLISH VERSION */
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--am-primary)]/15 border border-[var(--am-primary)]/25 text-xs font-semibold tracking-widest text-[var(--am-ink)] uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Forecasting Techniques · Advanced
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--am-ink)] leading-tight">
              Secondary Progressions: The Soul&apos;s Unfolding Clock
            </h1>
            <p className="text-xl text-[var(--am-muted)] font-light leading-relaxed">
              While transits bring external events, progressions reveal your organic internal emotional and psychological maturation over time.
            </p>
          </header>

          <div className="space-y-8">
            <div className="p-8 rounded-[2rem] bg-[var(--am-surface)] border border-[var(--am-line)] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    The &ldquo;Day-for-a-Year&rdquo; Formula
                  </h2>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Symbolic Time · Internal Maturation
                  </span>
                </div>
              </div>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Secondary Progression is based on the symbolic ancient principle of &ldquo;one day after birth equals one year of life&rdquo;.
                To understand your internal psychological weather at age 30, the planetary ephemeris for the 30th day following your birth
                is calculated.
              </p>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                This reveals the gradual unfolding of your core self — like watching a seedling naturally grow into a mature, branching tree.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-[var(--am-surface)] border border-[var(--am-line)] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    The Progressed Moon &amp; Life Chapters
                  </h2>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    28-Year Great Cycle · 2.5 Years Per Sign
                  </span>
                </div>
              </div>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                The Progressed Moon is the fastest mover in the progressed chart, traversing one sign every 2.5 years and completing its
                full circuit in 28 years. Its current house and sign pinpoint the prevailing emotional focus and personal life chapter you are actively inhabiting.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
