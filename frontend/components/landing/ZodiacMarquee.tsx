"use client";

import { useTranslation } from "@/lib/hooks/useI18n";

const SIGNS = [
  { key: "aries", glyph: "♈" },
  { key: "taurus", glyph: "♉" },
  { key: "gemini", glyph: "♊" },
  { key: "cancer", glyph: "♋" },
  { key: "leo", glyph: "♌" },
  { key: "virgo", glyph: "♍" },
  { key: "libra", glyph: "♎" },
  { key: "scorpio", glyph: "♏" },
  { key: "sagittarius", glyph: "♐" },
  { key: "capricorn", glyph: "♑" },
  { key: "aquarius", glyph: "♒" },
  { key: "pisces", glyph: "♓" },
];

/** A ticker band of the twelve signs, like a marquee over a fortune-teller's door. */
export function ZodiacMarquee() {
  const { t } = useTranslation();

  // Rendered twice so the -50% keyframe loops without a visible seam; the
  // second copy is hidden from assistive tech to avoid reading the list twice.
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {SIGNS.map((sign) => (
        <li key={sign.key} className="mono-label flex items-center gap-3 whitespace-nowrap px-5 font-bold">
          <span className="text-base text-[#d9a521]" aria-hidden="true">
            {/* U+FE0E asks for the text glyph; without it iOS/macOS draw coloured emoji. */}
            {sign.glyph}&#xFE0E;
          </span>
          {t(`sign.${sign.key}`)}
          <span className="pl-2 text-[#d9a521]" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-label={t("home.marquee.label")}
      className="overflow-hidden border-y-2 border-[var(--am-edge)] bg-[#1c1410] py-3 text-[#f3e6c8]"
    >
      <div data-marquee className="am-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
