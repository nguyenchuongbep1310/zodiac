"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Heart, Users, Compass } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export default function SynastryBasicsPage() {
  const { language, localeHref } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-fade-in">
      <Link
        href={localeHref("/learn")}
        className="inline-flex items-center text-sm font-medium text-[var(--am-muted)] hover:text-[var(--am-ink)] transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 motion-safe:group-hover:-translate-x-0.5 transition-transform" />
        {language === "vi" ? "Quay lại danh mục Học Chiêm Tinh" : "Back to Learn"}
      </Link>

      {language === "vi" ? (
        /* VIETNAMESE VERSION */
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[var(--am-radius)] bg-[var(--am-primary)]/15 border border-[var(--am-primary)]/25 text-xs font-semibold tracking-widest text-[var(--am-ink)] uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Chiêm Tinh Đôi Lứa · Trung Cấp
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--am-ink)] leading-tight">
              Synastry Là Gì? Nhập Môn So Sánh Bản Đồ Sao
            </h1>
            <p className="text-xl text-[var(--am-muted)] font-light leading-relaxed">
              Nghệ thuật chiêm tinh so sánh hai bản đồ sao để giải mã hóa học cảm xúc và động lực trong mối quan hệ.
            </p>
          </header>

          <div className="space-y-8">
            <div className="p-8 rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] shadow-[var(--am-shadow)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[var(--am-radius)] bg-[var(--am-peach)] flex items-center justify-center text-[var(--am-primary)]">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    Phương Pháp So Sánh Bản Đồ Sao (Synastry)
                  </h2>
                  <span className="text-xs font-semibold text-[var(--am-primary)] dark:text-[var(--am-primary)] uppercase tracking-wider">
                    Xếp Chồng Biểu Đồ · Phân Tích Tương Tác Năng Lượng
                  </span>
                </div>
              </div>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Synastry là kỹ thuật xếp chồng hai bản đồ sao cá nhân lên nhau để phân tích các góc chiếu giữa các hành tinh
                của hai người. Thay vì chỉ đơn thuần so sánh cung Mặt Trời, Synastry soi chiếu toàn diện các tầng cảm xúc,
                phong cách tư duy và sự hấp dẫn tự nhiên.
              </p>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Không có góc chiếu nào là hoàn toàn tiêu cực hay tích cực. Các góc chiếu hài hòa mang lại sự thoải mái, trong
                khi các góc chiếu thách thức chính là nguồn nhiên liệu tạo nên sự đam mê và thúc đẩy cả hai cùng trưởng thành.
              </p>
            </div>

            <div className="p-8 rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] shadow-[var(--am-shadow)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[var(--am-radius)] bg-[var(--am-lilac)] flex items-center justify-center text-[var(--am-ink)] ">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    Hành Tinh Cá Nhân Trong Động Lực Lứa Đôi
                  </h2>
                  <span className="text-xs font-semibold text-[var(--am-ink)]  uppercase tracking-wider">
                    Mặt Trời · Mặt Trăng · Sao Kim · Sao Hỏa · Sao Thủy
                  </span>
                </div>
              </div>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Mặt Trời biểu thị sự hòa hợp về mục đích sống và bản sắc. Mặt Trăng quyết định cảm giác an toàn và sự thấu cảm
                nội tâm. Sao Kim và Sao Hỏa tạo nên hóa học ái tình mãnh liệt, trong khi Sao Thủy đảm bảo hai bạn có thể trò
                chuyện và lắng nghe nhau một cách thông suốt.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ENGLISH VERSION */
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[var(--am-radius)] bg-[var(--am-primary)]/15 border border-[var(--am-primary)]/25 text-xs font-semibold tracking-widest text-[var(--am-ink)] uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Synastry · Intermediate
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[var(--am-ink)] leading-tight">
              Understanding Synastry: Cross-Chart Dynamics
            </h1>
            <p className="text-xl text-[var(--am-muted)] font-light leading-relaxed">
              The astrological art of overlaying two birth charts to decode emotional chemistry and relationship dynamics.
            </p>
          </header>

          <div className="space-y-8">
            <div className="p-8 rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] shadow-[var(--am-shadow)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[var(--am-radius)] bg-[var(--am-peach)] flex items-center justify-center text-[var(--am-primary)]">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    The Mechanics of Synastry
                  </h2>
                  <span className="text-xs font-semibold text-[var(--am-primary)] dark:text-[var(--am-primary)] uppercase tracking-wider">
                    Bi-Wheel Comparison · Aspect Geometries
                  </span>
                </div>
              </div>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Synastry places two birth charts side-by-side or in a concentric dual-wheel to identify the geometric aspects
                formed between one person&apos;s planets and the other&apos;s. It moves far beyond superficial sun-sign matchups to
                reveal the genuine psychological dialogue taking place between two souls.
              </p>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                Harmonious trines and sextiles bring natural flow and comfort, while dynamic squares and oppositions spark
                intense attraction and catalyze shared personal growth.
              </p>
            </div>

            <div className="p-8 rounded-[var(--am-radius)] bg-[var(--am-surface)] border-2 border-[var(--am-edge)] shadow-[var(--am-shadow)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[var(--am-radius)] bg-[var(--am-lilac)] flex items-center justify-center text-[var(--am-ink)] ">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    The Personal Planet Layers
                  </h2>
                  <span className="text-xs font-semibold text-[var(--am-ink)]  uppercase tracking-wider">
                    Sun · Moon · Venus · Mars · Mercury
                  </span>
                </div>
              </div>
              <p className="text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed">
                The Sun describes fundamental respect and core vitality. The Moon governs emotional safety, domestic rhythm,
                and intuitive attunement. Venus and Mars determine romantic and physical magnetism, while Mercury anchors
                everyday communication and mutual understanding.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
