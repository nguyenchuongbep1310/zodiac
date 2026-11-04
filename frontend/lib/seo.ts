import type { Metadata } from "next";
import { locales, localePath, type Locale } from "@/lib/i18n/locale";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://astromind.app";
export const siteName = "AstroMind";

type Localized<T> = Record<Locale, T>;

export const ogLocale: Localized<string> = { en: "en_US", vi: "vi_VN" };

export const siteTitle: Localized<string> = {
  en: "AstroMind — Free Birth Chart Calculator: Sun, Moon & Rising",
  vi: "AstroMind — Xem Bản Đồ Sao Miễn Phí: Mặt Trời, Mặt Trăng & Cung Mọc",
};

export const siteDescriptionByLocale: Localized<string> = {
  en: "Free birth chart calculator. Find your Sun, Moon and Rising sign, houses and aspects in seconds, then check compatibility with your crush or bestie.",
  vi: "Xem bản đồ sao miễn phí. Biết ngay cung Mặt Trời, Mặt Trăng, Cung Mọc, 12 nhà và góc chiếu chỉ trong vài giây, rồi xem độ hợp với crush hay bạn thân.",
};

export const siteDescription = siteDescriptionByLocale.en;

export const siteKeywords: Localized<string[]> = {
  en: [
    "birth chart calculator",
    "free natal chart",
    "big three astrology",
    "sun moon rising calculator",
    "rising sign calculator",
    "what is my moon sign",
    "zodiac compatibility",
    "synastry chart",
    "astrology for beginners",
  ],
  vi: [
    "bản đồ sao",
    "xem bản đồ sao miễn phí",
    "bản đồ sao cá nhân",
    "cung mọc",
    "cung mặt trăng",
    "cung hoàng đạo",
    "chiêm tinh học",
    "xem độ hợp cung hoàng đạo",
    "big three chiêm tinh",
  ],
};

/** Absolute URL for a site path, for JSON-LD and other places that need it. */
export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

/** canonical + hreflang links for a page that exists in every locale. */
export function localeAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localePath(l, path);
  languages["x-default"] = localePath("en", path);
  return { canonical: localePath(locale, path), languages };
}

interface PageSeo {
  title: string;
  description: string;
  keywords?: string[];
}

/** Metadata for one page in one locale, with canonical, hreflang and social tags. */
export function pageMetadata(
  locale: Locale,
  path: string,
  seo: PageSeo,
  { type = "website", absoluteTitle = false }: { type?: "website" | "article"; absoluteTitle?: boolean } = {}
): Metadata {
  return {
    title: absoluteTitle ? { absolute: seo.title } : seo.title,
    description: seo.description,
    keywords: seo.keywords ?? siteKeywords[locale],
    alternates: localeAlternates(locale, path),
    openGraph: {
      type,
      title: seo.title,
      description: seo.description,
      url: localePath(locale, path),
      siteName,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

/** Search copy for the static pages, keyed by path. */
export const pageSeo: Record<string, Localized<PageSeo>> = {
  "/learn": {
    en: {
      title: "Astrology 101: Learn to Read Your Birth Chart",
      description: "Short, beginner-friendly guides to your Big Three, the planets, aspects, transits and zodiac compatibility.",
    },
    vi: {
      title: "Chiêm Tinh 101: Học Cách Đọc Bản Đồ Sao",
      description: "Bài viết ngắn, dễ hiểu cho người mới về bộ ba Mặt Trời – Mặt Trăng – Cung Mọc, các hành tinh, góc chiếu, vận trình và độ hợp.",
    },
  },
  "/synastry": {
    en: {
      title: "Zodiac Compatibility Checker | Synastry Chart Calculator",
      description:
        "Free zodiac compatibility checker. Compare two birth charts and see the chemistry, house overlays and every aspect between you and your crush, partner or bestie.",
      keywords: ["zodiac compatibility", "synastry chart calculator", "love compatibility astrology"],
    },
    vi: {
      title: "Xem Độ Hợp Cung Hoàng Đạo | Bản Đồ Sao Đôi (Synastry)",
      description:
        "Xem độ hợp miễn phí. So sánh hai bản đồ sao để thấy sức hút, điểm hợp và điểm dễ va chạm giữa bạn và crush, người yêu hay bạn thân.",
      keywords: ["xem độ hợp cung hoàng đạo", "bản đồ sao đôi", "synastry", "độ hợp tình yêu chiêm tinh"],
    },
  },
  "/contact": {
    en: {
      title: "Contact Us",
      description: "Questions, feedback or partnership ideas? Get in touch with the AstroMind team.",
    },
    vi: {
      title: "Liên Hệ",
      description: "Có câu hỏi, góp ý hay ý tưởng hợp tác? Liên hệ với đội ngũ AstroMind.",
    },
  },
  "/privacy": {
    en: {
      title: "Privacy Policy",
      description: "How AstroMind collects, stores and protects your birth data and chart information.",
    },
    vi: {
      title: "Chính Sách Bảo Mật",
      description: "Cách AstroMind thu thập, lưu trữ và bảo vệ thông tin ngày sinh và bản đồ sao của bạn.",
    },
  },
  "/terms": {
    en: {
      title: "Terms of Service",
      description: "The terms that apply when you use AstroMind's birth chart calculator and astrology content.",
    },
    vi: {
      title: "Điều Khoản Dịch Vụ",
      description: "Các điều khoản áp dụng khi bạn sử dụng công cụ bản đồ sao và nội dung chiêm tinh của AstroMind.",
    },
  },
};

export interface LearnArticleSeo {
  path: string;
  seo: Localized<PageSeo>;
}

/** Search metadata for the /learn articles, whose pages are client components. */
export const learnArticles: Record<string, LearnArticleSeo> = {
  "sun-moon": {
    path: "/learn/birth-chart/sun-moon",
    seo: {
      en: {
        title: "Sun, Moon & Rising Signs Explained: Your Big Three",
        description: "What your Sun, Moon and Rising signs mean, how they work together, and how to find your Big Three in your birth chart.",
        keywords: ["big three astrology", "sun moon rising meaning", "rising sign meaning"],
      },
      vi: {
        title: "Mặt Trời, Mặt Trăng & Cung Mọc: Giải Mã Bộ Ba Cốt Lõi",
        description: "Ý nghĩa cung Mặt Trời, Mặt Trăng và Cung Mọc, cách chúng kết hợp với nhau và cách tìm bộ ba của bạn trong bản đồ sao.",
        keywords: ["cung mọc là gì", "mặt trời mặt trăng cung mọc", "big three chiêm tinh", "cách xem cung mọc"],
      },
    },
  },
  planets: {
    path: "/learn/birth-chart/planets",
    seo: {
      en: {
        title: "The 10 Planets in Astrology and What They Mean",
        description: "A beginner's guide to the Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto in your birth chart.",
        keywords: ["planets in astrology", "planet meanings astrology"],
      },
      vi: {
        title: "Ý Nghĩa 10 Hành Tinh Trong Chiêm Tinh Học",
        description: "Hướng dẫn cho người mới về Mặt Trời, Mặt Trăng, sao Thủy, Kim, Hỏa, Mộc, Thổ, Thiên Vương, Hải Vương và Diêm Vương trong bản đồ sao.",
        keywords: ["ý nghĩa các hành tinh chiêm tinh", "hành tinh trong bản đồ sao"],
      },
    },
  },
  "synastry-basics": {
    path: "/learn/synastry/basics",
    seo: {
      en: {
        title: "What Is Synastry? Zodiac Compatibility for Beginners",
        description: "Learn how synastry compares two birth charts to show chemistry, friction and long-term compatibility between two people.",
        keywords: ["synastry", "zodiac compatibility", "birth chart compatibility"],
      },
      vi: {
        title: "Synastry Là Gì? Xem Độ Hợp Cung Hoàng Đạo Cho Người Mới",
        description: "Synastry so sánh hai bản đồ sao để cho thấy sức hút, va chạm và độ hợp lâu dài giữa hai người.",
        keywords: ["synastry là gì", "xem độ hợp cung hoàng đạo", "so sánh bản đồ sao"],
      },
    },
  },
  "venus-mars": {
    path: "/learn/synastry/venus-mars",
    seo: {
      en: {
        title: "Venus and Mars in Synastry: Attraction and Chemistry",
        description: "How Venus and Mars contacts between two charts describe attraction, romance and chemistry in a relationship.",
        keywords: ["venus mars synastry", "venus conjunct mars", "astrology attraction"],
      },
      vi: {
        title: "Sao Kim & Sao Hỏa Trong Synastry: Sức Hút Và Phản Ứng Hóa Học",
        description: "Các góc chiếu giữa sao Kim và sao Hỏa của hai người nói gì về sức hút, sự lãng mạn và phản ứng hóa học trong tình yêu.",
        keywords: ["sao kim sao hỏa", "sức hút chiêm tinh", "synastry tình yêu"],
      },
    },
  },
  aspects: {
    path: "/learn/techniques/aspects",
    seo: {
      en: {
        title: "Astrology Aspects Explained: Conjunction, Trine, Square & More",
        description: "A simple guide to the major aspects in astrology: conjunction, sextile, square, trine and opposition, and how to read them.",
        keywords: ["astrology aspects", "trine square opposition"],
      },
      vi: {
        title: "Góc Chiếu Trong Chiêm Tinh: Hợp, Tam Hợp, Vuông, Đối Đỉnh",
        description: "Hướng dẫn dễ hiểu về các góc chiếu chính: hợp, lục hợp, vuông, tam hợp, đối đỉnh và cách đọc chúng.",
        keywords: ["góc chiếu chiêm tinh", "góc tam hợp", "góc vuông chiêm tinh"],
      },
    },
  },
  progressions: {
    path: "/learn/techniques/progressions",
    seo: {
      en: {
        title: "Secondary Progressions in Astrology: How You Evolve",
        description: "What secondary progressions are, how the progressed Moon works, and what they reveal about your personal growth over time.",
        keywords: ["secondary progressions", "progressed moon"],
      },
      vi: {
        title: "Progression Trong Chiêm Tinh: Bạn Thay Đổi Theo Thời Gian Ra Sao",
        description: "Progression thứ cấp là gì, Mặt Trăng tiến triển hoạt động thế nào và chúng nói gì về sự trưởng thành của bạn.",
        keywords: ["progression chiêm tinh", "mặt trăng tiến triển"],
      },
    },
  },
  transits: {
    path: "/learn/techniques/transits",
    seo: {
      en: {
        title: "Astrology Transits Explained: What the Sky Is Doing to Your Chart",
        description: "How planetary transits interact with your birth chart, from Saturn return to Jupiter transits, explained for beginners.",
        keywords: ["astrology transits", "saturn return"],
      },
      vi: {
        title: "Transit Là Gì? Bầu Trời Hiện Tại Tác Động Đến Bản Đồ Sao Của Bạn",
        description: "Vận trình hành tinh tương tác với bản đồ sao của bạn ra sao, từ Sao Thổ hồi quy đến transit sao Mộc, giải thích cho người mới.",
        keywords: ["transit chiêm tinh", "sao thổ hồi quy", "vận trình hành tinh"],
      },
    },
  },
};
