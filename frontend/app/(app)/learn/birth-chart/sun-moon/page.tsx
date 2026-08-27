"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Sun, Moon, Compass } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export default function SunMoonRisingPage() {
  const { language } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-fade-in">
      <Link 
        href="/learn"
        className="inline-flex items-center text-sm font-medium text-[#7A6E65] hover:text-[#4A3525] dark:text-[#A8988C] dark:hover:text-[#E8DDD3] transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
        {language === "vi" ? "Quay lại danh mục Học Chiêm Tinh" : "Back to Learn"}
      </Link>

      {language === "vi" ? (
        /* VIETNAMESE VERSION - 100% VI */
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B5A499]/15 border border-[#B5A499]/25 text-xs font-semibold tracking-widest text-[#5C4033] dark:text-[#E8DDD3] uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Bản Đồ Sao Sinh · Cơ Bản
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic text-[#4A3525] dark:text-[#E8DDD3] leading-tight">
              Bộ Ba Cốt Lõi: Mặt Trời, Mặt Trăng & Cung Mọc
            </h1>
            <p className="text-xl text-[#7A6E65] dark:text-[#A8988C] font-light leading-relaxed">
              Ba trụ cột nền tảng định hình toàn bộ bản sắc chiêm tinh học cá nhân của bạn.
            </p>
          </header>

          <div className="space-y-8">
            {/* Sun Section */}
            <div className="p-8 rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-[#4A3525] dark:text-[#E8DDD3]">
                    Mặt Trời: Bản Ngã Cốt Lõi & Ý Chí Sống
                  </h2>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Bản Sắc Thực Sự · Con Người Bạn Đang Hướng Đến
                  </span>
                </div>
              </div>
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed">
                Mặt Trời là thiên thể trung tâm của bản đồ sao, đại diện cho cái tôi cốt lõi, ý chí sống và mục đích
                phát triển bản thân trong suốt cuộc đời. Đây là vị trí quen thuộc nhất mà hầu hết mọi người biết đến khi
                nói về &ldquo;cung hoàng đạo của tôi&rdquo; — nhưng ý nghĩa thực sự của nó vượt xa các bài bói toán thông thường.
              </p>
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed">
                Vị trí Mặt Trời trong cung hoàng đạo cho biết cách bạn thể hiện bản thân ra thế giới, nguồn năng lượng
                sống và động lực thúc đẩy bạn hành động. Ngôi nhà nơi Mặt Trời tọa lạc chỉ ra lĩnh vực cuộc sống nơi bạn
                tỏa sáng nhất và tìm thấy cảm giác thành tựu lớn nhất.
              </p>
            </div>

            {/* Moon Section */}
            <div className="p-8 rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-500/10 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-[#4A3525] dark:text-[#E8DDD3]">
                    Mặt Trăng: Thế Giới Cảm Xúc & Tiềm Thức
                  </h2>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Trực Giác · Nhu Cầu An Toàn · Bản Năng Tự Nhiên
                  </span>
                </div>
              </div>
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed">
                Trong khi Mặt Trời là nguồn sáng ban ngày rực rỡ, Mặt Trăng cai quản ban đêm và thế giới nội tâm thầm kín.
                Mặt Trăng tiết lộ cách bạn phản ứng theo bản năng khi đối diện với căng thẳng, những điều khiến bạn cảm
                thấy an toàn và cách bạn nuôi dưỡng những người thân yêu.
              </p>
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed">
                Nếu bạn từng cảm thấy mình không hoàn toàn giống với cung Mặt Trời, rất có thể cung Mặt Trăng đang chi
                phối mạnh mẽ cảm xúc và thói quen vô thức của bạn trong cuộc sống hằng ngày.
              </p>
            </div>

            {/* Rising Section */}
            <div className="p-8 rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-[#4A3525] dark:text-[#E8DDD3]">
                    Cung Mọc (Ascendant): Cánh Cổng Ra Thế Giới
                  </h2>
                  <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    Ấn Tượng Ban Đầu · Lăng Kính Tiếp Nhận Thực Tại
                  </span>
                </div>
              </div>
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed">
                Cung Mọc là cung hoàng đạo đang mọc ở đường chân trời phía đông tại thời khắc chính xác bạn cất tiếng khóc
                chào đời. Đây chính là lăng kính định hình cách bạn tiếp cận thế giới và ấn tượng đầu tiên người khác cảm nhận về bạn.
              </p>
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed">
                Cung Mọc cũng quyết định cấu trúc của toàn bộ 12 cung địa bàn trong bản đồ sao của bạn, đóng vai trò như chiếc
                la bàn điều hướng hành trình trải nghiệm cuộc đời.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ENGLISH VERSION - 100% EN */
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B5A499]/15 border border-[#B5A499]/25 text-xs font-semibold tracking-widest text-[#5C4033] dark:text-[#E8DDD3] uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Birth Chart · Basics
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic text-[#4A3525] dark:text-[#E8DDD3] leading-tight">
              The Big Three: Sun, Moon, and Rising Sign
            </h1>
            <p className="text-xl text-[#7A6E65] dark:text-[#A8988C] font-light leading-relaxed">
              The foundational pillars of your astrological identity and inner architecture.
            </p>
          </header>

          <div className="space-y-8">
            {/* Sun Section */}
            <div className="p-8 rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-[#4A3525] dark:text-[#E8DDD3]">
                    The Sun: Core Ego & Purpose
                  </h2>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Conscious Identity · The Person You Are Becoming
                  </span>
                </div>
              </div>
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed">
                The Sun is the solar engine of your birth chart, representing your core ego, life vitality, and overarching
                sense of purpose. It reflects the fundamental creative energy you project into the world and what makes you
                feel truly alive and fulfilled.
              </p>
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed">
                While popular horoscopes reduce astrology solely to your Sun sign, its house placement and aspects reveal
                where and how your hero&apos;s journey unfolds throughout your life.
              </p>
            </div>

            {/* Moon Section */}
            <div className="p-8 rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-500/10 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-[#4A3525] dark:text-[#E8DDD3]">
                    The Moon: Emotions & Subconscious
                  </h2>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Instinctual Reactions · Emotional Security · Private Self
                  </span>
                </div>
              </div>
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed">
                Where the Sun is your conscious self, the Moon is your instinctual, emotional core. It describes how you
                process feelings, what makes you feel safe and nurtured, and how you react under stress or behind closed doors.
              </p>
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed">
                Understanding your Moon sign allows you to honor your genuine emotional needs without judgment, paving the
                way for authentic self-compassion.
              </p>
            </div>

            {/* Rising Section */}
            <div className="p-8 rounded-[2rem] bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#EBE4D8] dark:border-white/5 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-[#4A3525] dark:text-[#E8DDD3]">
                    The Ascendant: Your Portal to the World
                  </h2>
                  <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    First Impressions · Physical Demeanor · Life Lens
                  </span>
                </div>
              </div>
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed">
                The Ascendant (or Rising sign) was the zodiac sign rising on the eastern horizon at the exact minute of your
                birth. It represents the lens through which you perceive reality and the immediate energetic impression you make on others.
              </p>
              <p className="text-[#5C4033] dark:text-[#A8988C] leading-relaxed">
                The Ascendant sets the entire house wheel in motion, establishing the baseline layout of your 12 life areas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
