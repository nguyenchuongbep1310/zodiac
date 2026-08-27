"use client";

import { LearnPageLayout } from "@/components/landing/LearnPageLayout";
import { useTranslation } from "@/lib/hooks/useI18n";

interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  category: "basics" | "intermediate" | "advanced" | "techniques";
  readTime: string;
  href: string;
  featured?: boolean;
}

const articlesEn: ArticleItem[] = [
  {
    id: "sun-moon",
    title: "The Big Three: Sun, Moon, and Rising",
    excerpt:
      "Understand the three foundational placements that shape your core identity, inner emotional world, and outward presence.",
    category: "basics",
    readTime: "7 min",
    href: "/learn/birth-chart/sun-moon",
    featured: true,
  },
  {
    id: "planets",
    title: "The Planets in Astrology",
    excerpt:
      "A complete guide to the celestial archetypes in your chart, from Mercury's communication style to Pluto's transformation.",
    category: "basics",
    readTime: "9 min",
    href: "/learn/birth-chart/planets",
  },
  {
    id: "synastry-basics",
    title: "Understanding Synastry & Compatibility",
    excerpt:
      "The astrological art of cross-chart comparison to decode relationship dynamics, chemistry, and growth areas.",
    category: "intermediate",
    readTime: "9 min",
    href: "/learn/synastry/basics",
  },
  {
    id: "venus-mars",
    title: "Venus-Mars Connections in Synastry",
    excerpt:
      "Explore magnetic attraction, romantic interplay, and sexual passion when Venus and Mars align between two charts.",
    category: "intermediate",
    readTime: "8 min",
    href: "/learn/synastry/venus-mars",
  },
  {
    id: "transits",
    title: "Planetary Transits: The Living Sky",
    excerpt:
      "Your birth chart is fixed, but the cosmos is in constant motion. Discover how planetary transits trigger your natal placements.",
    category: "techniques",
    readTime: "10 min",
    href: "/learn/techniques/transits",
  },
  {
    id: "aspects",
    title: "Planetary Aspects Demystified",
    excerpt:
      "Understand Conjunctions, Sextiles, Squares, Trines, and Oppositions — the angular dialogues shaping your cosmic blueprint.",
    category: "techniques",
    readTime: "8 min",
    href: "/learn/techniques/aspects",
  },
  {
    id: "progressions",
    title: "Secondary Progressions: The Inner Journey",
    excerpt:
      "Explore the internal evolution of the soul, unfolding psychology, and emotional maturation across your lifetime.",
    category: "advanced",
    readTime: "9 min",
    href: "/learn/techniques/progressions",
  },
];

const articlesVi: ArticleItem[] = [
  {
    id: "sun-moon",
    title: "Bộ Ba Cốt Lõi: Mặt Trời, Mặt Trăng & Cung Mọc",
    excerpt:
      "Thấu hiểu ba vị trí nền tảng định hình bản ngã cốt lõi, thế giới nội tâm và phong thái thể hiện ra bên ngoài.",
    category: "basics",
    readTime: "7 phút",
    href: "/learn/birth-chart/sun-moon",
    featured: true,
  },
  {
    id: "planets",
    title: "Hệ Thống Các Hành Tinh Chiêm Tinh",
    excerpt:
      "Cẩm nang toàn diện về vai trò của từng thiên thể, từ khả năng tư duy của Sao Thủy đến sự chuyển hóa của Sao Diêm Vương.",
    category: "basics",
    readTime: "9 phút",
    href: "/learn/birth-chart/planets",
  },
  {
    id: "synastry-basics",
    title: "Synastry Là Gì? Chiêm Tinh Đôi Lứa",
    excerpt:
      "Nghệ thuật so sánh hai bản đồ sao để giải mã hóa học cảm xúc, sự gắn kết và những thử thách cần vượt qua.",
    category: "intermediate",
    readTime: "9 phút",
    href: "/learn/synastry/basics",
  },
  {
    id: "venus-mars",
    title: "Sao Kim & Sao Hỏa Trong Chiêm Tinh Đôi Lứa",
    excerpt:
      "Khám phá mối liên kết Venus-Mars — nền tảng của sự thu hút, đam mê và hòa hợp lãng mạn giữa hai người.",
    category: "intermediate",
    readTime: "8 phút",
    href: "/learn/synastry/venus-mars",
  },
  {
    id: "transits",
    title: "Vận Trình Transit: Bầu Trời Chuyển Động",
    excerpt:
      "Bản đồ sao gốc là bất biến nhưng vũ trụ luôn dịch chuyển. Tìm hiểu cách các hành tinh transit kích hoạt tiềm năng của bạn.",
    category: "techniques",
    readTime: "10 phút",
    href: "/learn/techniques/transits",
  },
  {
    id: "aspects",
    title: "Các Góc Chiếu Giữa Các Hành Tinh",
    excerpt:
      "Tìm hiểu ý nghĩa Trùng Tụ, Lục Hợp, Vuông Góc, Tam Hợp và Đối Góc — các mối tương tác góc độ định hình vận mệnh.",
    category: "techniques",
    readTime: "8 phút",
    href: "/learn/techniques/aspects",
  },
  {
    id: "progressions",
    title: "Hành Trình Tiến Triển Secondary Progression",
    excerpt:
      "Khám phá kỹ thuật tiến triển thứ cấp cho thấy quá trình trưởng thành tâm lý và cảm xúc theo thời gian.",
    category: "advanced",
    readTime: "9 phút",
    href: "/learn/techniques/progressions",
  },
];

export function LearnPageContent() {
  const { language } = useTranslation();
  const articles = language === "vi" ? articlesVi : articlesEn;

  return <LearnPageLayout articles={articles} />;
}
