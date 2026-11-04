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

export function ZodiacMarquee() {
  const { t } = useTranslation();

  // Rendered twice so the -50% keyframe loops without a visible seam; the
  // second copy is hidden from assistive tech to avoid reading the list twice.
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-3 pr-3">
      {SIGNS.map((sign) => (
        <li
          key={sign.key}
          className="flex items-center gap-2 rounded-full border border-[var(--am-line)] bg-[var(--am-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--am-ink)] whitespace-nowrap"
        >
          <span className="text-lg text-[var(--am-primary)]" aria-hidden="true">
            {sign.glyph}
          </span>
          {t(`sign.${sign.key}`)}
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={t("home.marquee.label")} className="relative py-6 overflow-hidden">
      <div className="flex w-max am-marquee">
        {row(false)}
        {row(true)}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--am-bg)] to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--am-bg)] to-transparent" />
    </section>
  );
}
