"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/lib/hooks/useI18n";

interface PlanetItem {
  name: string;
  symbol: string;
  keyword: string;
  summary: string;
  image: string;
  color: string;
}

const planetsEn: PlanetItem[] = [
  {
    name: "Sun",
    symbol: "☀️",
    keyword: "Ego & Core Purpose",
    summary: "Represents your conscious identity, vitality, self-expression, and the hero's journey of your lifetime.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800&auto=format&fit=crop",
    color: "border-amber-500/40 bg-amber-500/5 text-amber-500",
  },
  {
    name: "Moon",
    symbol: "🌙",
    keyword: "Emotions & Intuition",
    summary: "Governs your instinctual feelings, subconscious patterns, inner emotional safety, and natural reactions.",
    image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?q=80&w=800&auto=format&fit=crop",
    color: "border-slate-400/40 bg-slate-400/5 text-slate-400",
  },
  {
    name: "Mercury",
    symbol: "☿️",
    keyword: "Mind & Communication",
    summary: "Rules intellect, cognitive processing, speech, writing, logical analysis, and everyday learning style.",
    image: "https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?q=80&w=800&auto=format&fit=crop",
    color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-500",
  },
  {
    name: "Venus",
    symbol: "♀️",
    keyword: "Love & Values",
    summary: "Shapes aesthetic tastes, romantic attraction, relational harmony, financial values, and personal self-worth.",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=800&auto=format&fit=crop",
    color: "border-rose-400/40 bg-rose-400/5 text-rose-400",
  },
  {
    name: "Mars",
    symbol: "♂️",
    keyword: "Action & Drive",
    summary: "Drives assertiveness, physical vitality, passion, ambition, courage, and how you pursue goals.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800&auto=format&fit=crop",
    color: "border-red-500/40 bg-red-500/5 text-red-400",
  },
  {
    name: "Jupiter",
    symbol: "♃",
    keyword: "Expansion & Wisdom",
    summary: "Brings luck, philosophical growth, optimism, generosity, and the expansion of personal horizons.",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=800&auto=format&fit=crop",
    color: "border-violet-400/40 bg-violet-400/5 text-violet-400",
  },
  {
    name: "Saturn",
    symbol: "♄",
    keyword: "Discipline & Maturity",
    summary: "Teaches perseverance, boundaries, responsibility, structural mastery, and hard-earned life wisdom.",
    image: "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?q=80&w=800&auto=format&fit=crop",
    color: "border-amber-600/40 bg-amber-600/5 text-amber-600",
  },
  {
    name: "Uranus",
    symbol: "♅",
    keyword: "Innovation & Freedom",
    summary: "Sparks sudden breakthroughs, radical individuality, authentic liberation, and revolutionary vision.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800&auto=format&fit=crop",
    color: "border-cyan-400/40 bg-cyan-400/5 text-cyan-400",
  },
  {
    name: "Neptune",
    symbol: "♆",
    keyword: "Dreams & Transcendence",
    summary: "Guides artistic imagination, spiritual empathy, intuitive mysticism, dreams, and soulful ideals.",
    image: "https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?q=80&w=800&auto=format&fit=crop",
    color: "border-blue-400/40 bg-blue-400/5 text-blue-400",
  },
  {
    name: "Pluto",
    symbol: "♇",
    keyword: "Rebirth & Power",
    summary: "Oversees deep psychological alchemy, purging of outdated cycles, inner empowerment, and rebirth.",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=800&auto=format&fit=crop",
    color: "border-purple-600/40 bg-purple-600/5 text-purple-400",
  },
];

const planetsVi: PlanetItem[] = [
  {
    name: "Mặt Trời",
    symbol: "☀️",
    keyword: "Bản Ngã & Mục Đích Sống",
    summary: "Đại diện cho cái tôi cốt lõi, ý chí sống, cá tính đích thực và con đường phát triển bản thân.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800&auto=format&fit=crop",
    color: "border-amber-500/40 bg-amber-500/5 text-amber-500",
  },
  {
    name: "Mặt Trăng",
    symbol: "🌙",
    keyword: "Cảm Xúc & Trực Giác",
    summary: "Cai quản thế giới nội tâm, nhu cầu an toàn cảm xúc, phản xạ vô thức và bản năng tự nhiên.",
    image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?q=80&w=800&auto=format&fit=crop",
    color: "border-slate-400/40 bg-slate-400/5 text-slate-400",
  },
  {
    name: "Sao Thủy",
    symbol: "☿️",
    keyword: "Tư Duy & Giao Tiếp",
    summary: "Chủ quản tư duy logic, xử lý thông tin, phong cách diễn đạt ngôn ngữ và khả năng học tập.",
    image: "https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?q=80&w=800&auto=format&fit=crop",
    color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-500",
  },
  {
    name: "Sao Kim",
    symbol: "♀️",
    keyword: "Tình Yêu & Giá Trị Bản Thân",
    summary: "Định hình gu thẩm mỹ, lực hút tình cảm, cách bạn yêu thương, tiền bạc và những giá trị bạn trân quý.",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=800&auto=format&fit=crop",
    color: "border-rose-400/40 bg-rose-400/5 text-rose-400",
  },
  {
    name: "Sao Hỏa",
    symbol: "♂️",
    keyword: "Hành Động & Ý Chí",
    summary: "Thúc đẩy năng lượng hành động, đam mê, sự quả cảm, tham vọng và cách giải quyết xung đột.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800&auto=format&fit=crop",
    color: "border-red-500/40 bg-red-500/5 text-red-400",
  },
  {
    name: "Sao Mộc",
    symbol: "♃",
    keyword: "May Mắn & Mở Rộng",
    summary: "Mang lại cơ hội, sự phóng khoáng, triết lý sống, niềm tin lạc quan và sự thịnh vượng.",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=800&auto=format&fit=crop",
    color: "border-violet-400/40 bg-violet-400/5 text-violet-400",
  },
  {
    name: "Sao Thổ",
    symbol: "♄",
    keyword: "Kỷ Luật & Bài Học Cuộc Đời",
    summary: "Đại diện cho trách nhiệm, ranh giới cá nhân, sự kiên định, thử thách và thành tựu bền vững.",
    image: "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?q=80&w=800&auto=format&fit=crop",
    color: "border-amber-600/40 bg-amber-600/5 text-amber-600",
  },
  {
    name: "Sao Thiên Vương",
    symbol: "♅",
    keyword: "Đột Phá & Tự Do",
    summary: "Thắp lên sự đổi mới, tính độc lập nguyên bản, tầm nhìn tiến bộ và những bước chuyển bất ngờ.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800&auto=format&fit=crop",
    color: "border-cyan-400/40 bg-cyan-400/5 text-cyan-400",
  },
  {
    name: "Sao Hải Vương",
    symbol: "♆",
    keyword: "Ước Mơ & Tâm Linh",
    summary: "Khơi gợi trực giác sâu sắc, cảm hứng nghệ thuật, lòng trắc ẩn và lý tưởng tâm hồn cao đẹp.",
    image: "https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?q=80&w=800&auto=format&fit=crop",
    color: "border-blue-400/40 bg-blue-400/5 text-blue-400",
  },
  {
    name: "Sao Diêm Vương",
    symbol: "♇",
    keyword: "Tái Sinh & Chuyển Hóa",
    summary: "Chủ quản sự lột xác tâm lý, khai mở sức mạnh tiềm ẩn, thanh lọc cái cũ và tái sinh mạnh mẽ.",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=800&auto=format&fit=crop",
    color: "border-purple-600/40 bg-purple-600/5 text-purple-400",
  },
];

export default function PlanetsPage() {
  const { language, localeHref } = useTranslation();
  const planets = language === "vi" ? planetsVi : planetsEn;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-fade-in space-y-12">
      <Link 
        href={localeHref("/learn")}
        className="inline-flex items-center text-sm font-medium text-[var(--am-muted)] hover:text-[var(--am-ink)] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
        {language === "vi" ? "Quay lại danh mục Học Chiêm Tinh" : "Back to Learn"}
      </Link>

      <header className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--am-primary)]/15 border border-[var(--am-primary)]/25 text-xs font-semibold tracking-widest text-[var(--am-ink)] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          {language === "vi" ? "Bản Đồ Sao Sinh · Cơ Bản" : "Birth Chart · Basics"}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-[var(--am-ink)] leading-tight">
          {language === "vi" ? "Hệ Thống Các Hành Tinh Chiêm Tinh" : "The Planets in Astrology"}
        </h1>
        <p className="text-lg sm:text-xl text-[var(--am-muted)] font-light leading-relaxed">
          {language === "vi"
            ? "Mỗi thiên thể là một nguồn năng lượng nguyên mẫu, đóng vai trò như một nhân vật độc đáo trong dàn nhạc tâm lý của bạn."
            : "Every celestial body is a psychological archetype, acting as a distinct voice within your inner cosmic orchestra."}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {planets.map((planet) => (
          <div
            key={planet.name}
            className={`group overflow-hidden rounded-[2rem] border ${planet.color} bg-[var(--am-surface)]/80 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col`}
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={planet.image}
                alt={planet.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--am-surface)] via-transparent to-transparent" />
              <span className="absolute bottom-3 left-6 text-4xl drop-shadow-md">{planet.symbol}</span>
            </div>

            <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h2 className="text-2xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                    {planet.name}
                  </h2>
                </div>
                <span className="text-xs font-semibold tracking-wide uppercase opacity-75 block mb-3">
                  {planet.keyword}
                </span>
                <p className="text-sm text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed font-light">
                  {planet.summary}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
