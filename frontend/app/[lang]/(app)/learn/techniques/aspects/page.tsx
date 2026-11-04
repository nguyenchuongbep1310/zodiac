"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

interface AspectItem {
  name: string;
  symbol: string;
  degree: string;
  keyword: string;
  summary: string;
  color: string;
}

const aspectsEn: AspectItem[] = [
  {
    name: "Conjunction",
    symbol: "☌",
    degree: "0°",
    keyword: "Fusion & Focus",
    summary: "Two planets occupy the exact same celestial longitude, merging their archetype energies into an indivisible, intensely focused powerhouse.",
    color: "border-[var(--am-edge)] bg-[var(--am-peach)]",
  },
  {
    name: "Sextile",
    symbol: "⚹",
    degree: "60°",
    keyword: "Opportunity & Flow",
    summary: "A harmonious 60-degree angle creating friendly cooperation between complementary elements (Fire-Air or Earth-Water), offering easy opportunities that reward proactive effort.",
    color: "border-[var(--am-edge)] bg-[var(--am-mint)]",
  },
  {
    name: "Square",
    symbol: "□",
    degree: "90°",
    keyword: "Tension & Catalyst",
    summary: "A dynamic 90-degree friction that sparks internal tension, motivating problem-solving, grit, resilience, and monumental developmental breakthroughs.",
    color: "border-[var(--am-edge)] bg-[var(--am-peach)]",
  },
  {
    name: "Trine",
    symbol: "△",
    degree: "120°",
    keyword: "Innate Grace & Talent",
    summary: "The most naturally harmonious aspect, linking planets of the same element to bestow natural gifts, intuitive flow, and effortless creative expression.",
    color: "border-[var(--am-edge)] bg-[var(--am-lilac)]",
  },
  {
    name: "Opposition",
    symbol: "☍",
    degree: "180°",
    keyword: "Polarity & Awareness",
    summary: "Planets standing across from each other on the zodiac wheel create an energetic tug-of-war, teaching the master art of compromise, balance, and relational awareness.",
    color: "border-[var(--am-edge)] bg-[var(--am-lilac)]",
  },
  {
    name: "Quincunx (Inconjunct)",
    symbol: "⚻",
    degree: "150°",
    keyword: "Adjustment & Realignment",
    summary: "Linking signs that share neither element nor modality, the quincunx demands ongoing creative adjustments and psychological fine-tuning.",
    color: "border-[var(--am-edge)] bg-[var(--am-lilac)]",
  },
];

const aspectsVi: AspectItem[] = [
  {
    name: "Trùng Tụ (Conjunction)",
    symbol: "☌",
    degree: "0°",
    keyword: "Hòa Quyện & Tập Trung Cao Độ",
    summary: "Hai hành tinh cùng tọa lạc tại một vị trí, năng lượng của chúng hòa làm một khối thống nhất, tạo nên một sức mạnh nội tâm vô cùng tập trung và đậm nét.",
    color: "border-[var(--am-edge)] bg-[var(--am-peach)]",
  },
  {
    name: "Lục Hợp (Sextile)",
    symbol: "⚹",
    degree: "60°",
    keyword: "Cơ Hội & Dòng Chảy Thuận Lợi",
    summary: "Góc chiếu hài hòa 60 độ kết nối hai yếu tố tương trợ (Lửa-Khí hoặc Đất-Nước), mang đến những cơ hội thuận lợi mà bạn chỉ cần chủ động nắm bắt là sẽ gặt hái thành quả.",
    color: "border-[var(--am-edge)] bg-[var(--am-mint)]",
  },
  {
    name: "Vuông Góc (Square)",
    symbol: "□",
    degree: "90°",
    keyword: "Căng Thẳng & Động Lực Bứt Phá",
    summary: "Góc chiếu 90 độ tạo ra sự cọ xát và xung đột nội tại. Dù đòi hỏi nỗ lực lớn, đây chính là chất xúc tác mạnh mẽ nhất rèn luyện bản lĩnh, nghị lực và thành công vượt bậc.",
    color: "border-[var(--am-edge)] bg-[var(--am-peach)]",
  },
  {
    name: "Tam Hợp (Trine)",
    symbol: "△",
    degree: "120°",
    keyword: "Tài Năng Bẩm Sinh & Hài Hòa",
    summary: "Góc chiếu 120 độ êm đềm và may mắn nhất, liên kết các hành tinh cùng nhóm nguyên tố, mang lại năng khiếu tự nhiên, trực giác nhạy bén và dòng chảy cuộc sống mượt mà.",
    color: "border-[var(--am-edge)] bg-[var(--am-lilac)]",
  },
  {
    name: "Đối Góc (Opposition)",
    symbol: "☍",
    degree: "180°",
    keyword: "Phân Cực & Nghệ Thuật Cân Bằng",
    summary: "Hai hành tinh đứng ở hai vị trí đối diện nhau tạo ra lực căng bập bênh, giúp bạn nhận thức sâu sắc cả hai mặt của vấn đề và học cách dung hòa các mặt đối lập.",
    color: "border-[var(--am-edge)] bg-[var(--am-lilac)]",
  },
  {
    name: "Bất Tương (Quincunx)",
    symbol: "⚻",
    degree: "150°",
    keyword: "Điều Chỉnh & Tái Cân Chỉnh",
    summary: "Kết nối hai cung hoàng đạo không có điểm chung về tính chất hay nguyên tố, đòi hỏi sự linh hoạt tinh chỉnh thói quen và thích ứng tâm lý liên tục.",
    color: "border-[var(--am-edge)] bg-[var(--am-lilac)]",
  },
];

export default function AspectsPage() {
  const { language, localeHref } = useTranslation();
  const aspects = language === "vi" ? aspectsVi : aspectsEn;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-fade-in space-y-12">
      <Link
        href={localeHref("/learn")}
        className="inline-flex items-center text-sm font-medium text-[var(--am-muted)] hover:text-[var(--am-ink)] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 motion-safe:group-hover:-translate-x-0.5 transition-transform" />
        {language === "vi" ? "Quay lại danh mục Học Chiêm Tinh" : "Back to Learn"}
      </Link>

      <header className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[var(--am-radius)] bg-[var(--am-primary)]/15 border border-[var(--am-primary)]/25 text-xs font-semibold tracking-widest text-[var(--am-ink)] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          {language === "vi" ? "Kỹ Thuật Chiêm Tinh · Cơ Bản Đến Nâng Cao" : "Astrological Techniques · All Levels"}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-[var(--am-ink)] leading-tight">
          {language === "vi" ? "Các Góc Chiếu Giữa Các Hành Tinh" : "Planetary Aspects Demystified"}
        </h1>
        <p className="text-lg sm:text-xl text-[var(--am-muted)] font-light leading-relaxed">
          {language === "vi"
            ? "Góc chiếu là cuộc hội thoại hình học giữa các thiên thể, quyết định cách các nguồn năng lượng hòa hợp hay thúc đẩy lẫn nhau trong bản đồ sao của bạn."
            : "Aspects are the geometric conversations between planets, determining how archetypal forces harmonize or challenge each other within your blueprint."}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {aspects.map((a, idx) => (
          <div
            key={idx}
            className={`group overflow-hidden rounded-[var(--am-radius)] border-2 ${a.color} shadow-[var(--am-shadow)] transition-[transform,box-shadow] duration-150 motion-safe:hover:[transform:translate(-2px,-2px)] hover:shadow-[6px_6px_0_var(--am-edge)] flex flex-col p-8 justify-between space-y-4`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl ">{a.symbol}</span>
                  <div>
                    <h2 className="text-xl font-display font-bold tracking-tight text-[var(--am-ink)]">
                      {a.name}
                    </h2>
                    <span className="text-xs font-mono text-[var(--am-muted)]">{a.degree}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide opacity-75 block mb-2">
                {a.keyword}
              </span>
              <p className="text-sm text-[var(--am-ink)] dark:text-[var(--am-muted)] leading-relaxed font-light">
                {a.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
