import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "The Planets in Astrology",
  description: "Understand what each planet represents in your natal birth chart.",
};

const planets = [
  {
    name: "Sun (Mặt Trời)",
    symbol: "☀️",
    keyword: "Bản Ngã & Identity",
    summary: "Đại diện cho cái tôi cốt lõi, ý chí sống, cá tính thật và mục đích phát triển bản thân.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800&auto=format&fit=crop",
    color: "border-amber-500/40 bg-amber-500/5 text-amber-400",
  },
  {
    name: "Moon (Mặt Trăng)",
    symbol: "🌙",
    keyword: "Cảm Xúc & Trực Giác",
    summary: "Đại diện cho thế giới nội tâm, nhu cầu cảm xúc, tiềm thức, phản xạ tự nhiên và nhu cầu an toàn.",
    image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?q=80&w=800&auto=format&fit=crop",
    color: "border-slate-400/40 bg-slate-400/5 text-slate-300",
  },
  {
    name: "Mercury (Thủy Tinh)",
    symbol: "☿️",
    keyword: "Tư Duy & Giao Tiếp",
    summary: "Đại diện cho cách bạn suy nghĩ, xử lý thông tin, giao tiếp, ngôn ngữ và khả năng học hỏi.",
    image: "https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?q=80&w=800&auto=format&fit=crop",
    color: "border-emerald-400/40 bg-emerald-400/5 text-emerald-400",
  },
  {
    name: "Venus (Kim Tinh)",
    symbol: "♀️",
    keyword: "Tình Yêu & Giá Trị",
    summary: "Đại diện cho gu thẩm mỹ, cách bạn yêu thương, thu hút mối quan hệ, tiền bạc và những gì bạn trân trọng.",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=800&auto=format&fit=crop",
    color: "border-rose-400/40 bg-rose-400/5 text-rose-400",
  },
  {
    name: "Mars (Hỏa Tinh)",
    symbol: "♂️",
    keyword: "Hành Động & Đam Mê",
    summary: "Đại diện cho năng lượng thực thi, ham muốn, sự khao khát, ý chí chiến đấu và cách giải quyết xung đột.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800&auto=format&fit=crop",
    color: "border-red-500/40 bg-red-500/5 text-red-400",
  },
  {
    name: "Jupiter (Mộc Tinh)",
    symbol: "♃",
    keyword: "May Mắn & Phóng Đại",
    summary: "Đại diện cho sự phát triển, triết lý sống, niềm tin, cơ hội mở rộng và sự may mắn trong cuộc sống.",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=800&auto=format&fit=crop",
    color: "border-violet-400/40 bg-violet-400/5 text-violet-300",
  },
  {
    name: "Saturn (Thổ Tinh)",
    symbol: "♄",
    keyword: "Kỷ Luật & Bài Học",
    summary: "Đại diện cho giới hạn, trách nhiệm, sự kiên nhẫn, thử thách và những bài học cuộc sống cần vượt qua.",
    image: "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?q=80&w=800&auto=format&fit=crop",
    color: "border-yellow-600/40 bg-yellow-600/5 text-yellow-500",
  },
  {
    name: "Uranus (Thiên Vương Tinh)",
    symbol: "♅",
    keyword: "Đổi Mới & Đột Phá",
    summary: "Đại diện cho tính cá bản độc đáo, tinh thần tự do, sự bứt phá khỏi truyền thống và những thay đổi bất ngờ.",
    image: "https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?q=80&w=800&auto=format&fit=crop",
    color: "border-cyan-400/40 bg-cyan-400/5 text-cyan-400",
  },
  {
    name: "Neptune (Hải Vương Tinh)",
    symbol: "♆",
    keyword: "Ước Mơ & Tâm Linh",
    summary: "Đại diện cho khả năng tưởng tượng, lý tưởng hóa, tâm linh, nghệ thuật, lòng trắc ẩn và những giấc mơ.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    color: "border-indigo-400/40 bg-indigo-400/5 text-indigo-300",
  },
  {
    name: "Pluto (Diêm Vương Tinh)",
    symbol: "♇",
    keyword: "Chuyển Hóa & Tái Sinh",
    summary: "Đại diện cho sức mạnh tiềm ẩn, quá trình lột xác, sự thao túng, chuyển hóa tâm lý sâu sắc và sự tái sinh.",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop",
    color: "border-purple-500/40 bg-purple-500/5 text-purple-400",
  },
];

export default function PlanetsPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-fade-in space-y-10">
      <Link 
        href="/learn"
        className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại trang Learn
      </Link>

      <header className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold tracking-widest text-violet-300 uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Kiến Thức Chiêm Tinh
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-slate-100 leading-tight">
          Ý Nghĩa Các Hành Tinh Trong Bản Đồ Sao
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
          Mỗi hành tinh trong Chiêm tinh học đại diện cho một phần tính cách và động lực cốt lõi trong tâm trí bạn.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        {planets.map((p, idx) => (
          <div 
            key={idx}
            className={`group overflow-hidden rounded-3xl border ${p.color} bg-white/50 dark:bg-slate-900/40 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col`}
          >
            {/* Image Header */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-950">
              <img 
                src={p.image} 
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl filter drop-shadow-md">{p.symbol}</span>
                  <h3 className="text-xl font-display font-bold text-white tracking-wide">{p.name}</h3>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xs">
                  {p.keyword}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light">
                {p.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
