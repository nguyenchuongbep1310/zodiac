"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Heart } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

interface DynamicItem {
  name: string;
  keyword: string;
  summary: string;
  color: string;
}

const dynamicsEn: DynamicItem[] = [
  {
    name: "Venus Conjunct Mars",
    keyword: "Instant Magnetic Chemistry",
    summary: "When one person's Venus merges with another's Mars, attraction is immediate, visceral, and passionate. Mars feels intensely validated and drawn in, while Venus is captivated by the direct, confident energy of Mars.",
    color: "border-rose-400/40 bg-rose-400/5 text-rose-400",
  },
  {
    name: "Venus Square Mars",
    keyword: "High-Voltage Friction",
    summary: "This dynamic square creates intense sexual tension and palpable chemistry. While attraction is undeniable, differing styles of expressing affection and desire require conscious awareness to avoid unnecessary misunderstandings.",
    color: "border-amber-400/40 bg-amber-400/5 text-amber-400",
  },
  {
    name: "Venus Trine Mars",
    keyword: "Effortless Harmony",
    summary: "This harmonious trine fosters a graceful, organic rhythm between romance and passion. Both individuals feel appreciated, understood, and naturally attractive to each other without needing to prove anything.",
    color: "border-emerald-400/40 bg-emerald-400/5 text-emerald-400",
  },
  {
    name: "Venus Opposite Mars",
    keyword: "Polarizing Magnetism",
    summary: "Opposite signs generate an irresistible game of romantic polarity and fascination. The interplay between receptivity and pursuit keeps the connection vibrant and mutually intriguing over time.",
    color: "border-violet-400/40 bg-violet-400/5 text-violet-400",
  },
  {
    name: "Venus Sextile Mars",
    keyword: "Playful Romance",
    summary: "A lighthearted, cooperative aspect that infuses the relationship with warmth, flirtatious fun, shared creative endeavors, and easy romantic understanding.",
    color: "border-cyan-400/40 bg-cyan-400/5 text-cyan-400",
  },
];

const dynamicsVi: DynamicItem[] = [
  {
    name: "Sao Kim Trùng Tụ Sao Hỏa",
    keyword: "Lực Hút Tức Thời & Mãnh Liệt",
    summary: "Khi Sao Kim của người này trùng vị trí với Sao Hỏa của người kia, sự thu hút xảy ra ngay lập tức và đầy đam mê. Người Sao Hỏa cảm thấy được thấu cảm và khao khát, còn Sao Kim bị cuốn hút bởi sự trực diện, tự tin của Sao Hỏa.",
    color: "border-rose-400/40 bg-rose-400/5 text-rose-400",
  },
  {
    name: "Sao Kim Vuông Góc Sao Hỏa",
    keyword: "Căng Thẳng Đầy Sức Hút",
    summary: "Góc chiếu thách thức này tạo ra lực hút mạnh mẽ và điện áp cảm xúc cao. Sự thu hút rất rõ ràng, nhưng sự khác biệt trong cách bộc lộ tình cảm và ham muốn đòi hỏi cả hai cần kiên nhẫn để tránh những hiểu lầm không đáng có.",
    color: "border-amber-400/40 bg-amber-400/5 text-amber-400",
  },
  {
    name: "Sao Kim Tam Hợp Sao Hỏa",
    keyword: "Hòa Hợp Tự Nhiên & Dịu Êm",
    summary: "Góc chiếu hài hòa tuyệt đẹp tạo ra dòng chảy cảm xúc êm đềm và sự tương thích tự nhiên giữa lãng mạn và đam mê. Cả hai người đều cảm nhận được sự trân trọng và khao khát lẫn nhau mà không cần phải chứng minh điều gì.",
    color: "border-emerald-400/40 bg-emerald-400/5 text-emerald-400",
  },
  {
    name: "Sao Kim Đối Góc Sao Hỏa",
    keyword: "Sức Hút Của Hai Cực Đối Lập",
    summary: "Sự phân cực giữa hai cung đối diện tạo ra trò chơi rượt đuổi lãng mạn đầy cuốn hút. Sự tương phản giữa tính đón nhận và tính chủ động giữ cho ngọn lửa tình cảm luôn sống động theo thời gian.",
    color: "border-violet-400/40 bg-violet-400/5 text-violet-400",
  },
  {
    name: "Sao Kim Lục Hợp Sao Hỏa",
    keyword: "Đồng Điệu & Vui Tươi",
    summary: "Góc chiếu tạo ra sự thoải mái, vui vẻ và ăn ý trong chuyện tình cảm. Hai bạn dễ dàng tìm thấy tiếng nói chung trong các hoạt động sáng tạo, giải trí và hâm nóng tình cảm đôi lứa.",
    color: "border-cyan-400/40 bg-cyan-400/5 text-cyan-400",
  },
];

export default function VenusMarsPage() {
  const { language } = useTranslation();
  const dynamics = language === "vi" ? dynamicsVi : dynamicsEn;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-fade-in space-y-12">
      <Link
        href="/learn"
        className="inline-flex items-center text-sm font-medium text-[#7A6E65] hover:text-[#4A3525] dark:text-[#A8988C] dark:hover:text-[#E8DDD3] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
        {language === "vi" ? "Quay lại danh mục Học Chiêm Tinh" : "Back to Learn"}
      </Link>

      <header className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B5A499]/15 border border-[#B5A499]/25 text-xs font-semibold tracking-widest text-[#5C4033] dark:text-[#E8DDD3] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          {language === "vi" ? "Chiêm Tinh Đôi Lứa · Trung Cấp" : "Synastry · Intermediate"}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-[#4A3525] dark:text-[#E8DDD3] leading-tight">
          {language === "vi" ? "Sao Kim & Sao Hỏa Trong Chiêm Tinh Đôi Lứa" : "Venus-Mars Connections in Synastry"}
        </h1>
        <p className="text-lg sm:text-xl text-[#7A6E65] dark:text-[#A8988C] font-light leading-relaxed">
          {language === "vi"
            ? "Mối liên kết giữa Sao Kim và Sao Hỏa là nền tảng cốt lõi của lực hút ái tình, nơi năng lượng đón nhận và khao khát chinh phục hòa làm một."
            : "The Venus-Mars archetype forms the foundation of romantic chemistry, bridging receptive desire with active pursuit."}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dynamics.map((d, idx) => (
          <div
            key={idx}
            className={`group overflow-hidden rounded-[2rem] border ${d.color} bg-[#FAF7F2]/80 dark:bg-[#1C1815]/80 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col p-8 justify-between space-y-4`}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 opacity-80" />
                <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                  {d.keyword}
                </span>
              </div>
              <h2 className="text-2xl font-serif italic text-[#4A3525] dark:text-[#E8DDD3] mb-3">
                {d.name}
              </h2>
              <p className="text-sm text-[#5C4033] dark:text-[#A8988C] leading-relaxed font-light">
                {d.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
