"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Badge } from "@/components/ui/Badge";
import { Ornament } from "@/components/ui/Ornament";
import { useTranslation } from "@/lib/hooks/useI18n";

export function FooterEnhanced() {
  const { t, language, localeHref } = useTranslation();

  const chartLinks = [
    { label: t("footer.charts.birth"), href: "/" },
    { label: t("footer.charts.synastry"), href: "/synastry" },
    { label: t("footer.charts.transit"), href: null },
  ];

  const moreLinks = [
    { label: t("footer.more.learn"), href: "/learn" },
    { label: t("footer.more.features"), href: "/#features" },
    { label: t("footer.more.faq"), href: "/#faq" },
  ];

  const aboutLinks = [
    { label: t("footer.about.privacy"), href: "/privacy" },
    { label: t("footer.about.terms"), href: "/terms" },
    { label: t("footer.about.contact"), href: "/contact" },
  ];

  return (
    <footer
      className="relative border-t-2 border-[var(--am-edge)] bg-[#1c1410] px-6 pb-16 pt-12 text-[#f3e6c8] md:pb-20 md:pt-14"
      style={{ "--brand-accent": "#d9a521" } as CSSProperties}
    >
      <Ornament className="mx-auto mb-10 max-w-7xl text-[#d9a521]" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-12">
        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1">
          <BrandLogo size="md" className="text-[#f3e6c8]" />
          <p className="mt-4 text-sm text-[#f3e6c8]/60 leading-relaxed max-w-xs">
            {t("footer.tagline")}
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a href="https://x.com" target="_blank" rel="noreferrer" className="p-2 rounded-[var(--am-radius)] border-2 border-[#f3e6c8]/40 text-[#f3e6c8]/80 hover:border-[#d9a521] hover:text-[#d9a521] transition-colors" aria-label="X (Twitter)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-[var(--am-radius)] border-2 border-[#f3e6c8]/40 text-[#f3e6c8]/80 hover:border-[#d9a521] hover:text-[#d9a521] transition-colors" aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.41-2.68 5.38-5.24 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.53 10.53 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z" />
              </svg>
            </a>
            <a href="mailto:hello@astromind.app" className="p-2 rounded-[var(--am-radius)] border-2 border-[#f3e6c8]/40 text-[#f3e6c8]/80 hover:border-[#d9a521] hover:text-[#d9a521] transition-colors" aria-label="Email">
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* Charts */}
        <div>
          <h4 className="font-display text-[#d9a521] mb-4 text-lg">
            {t("footer.charts")}
          </h4>
          <ul className="space-y-3">
            {chartLinks.map((link) =>
              link.href ? (
                <li key={link.label}>
                  <Link href={localeHref(link.href)} className="mono-label text-[#f3e6c8]/75 transition-colors hover:text-[#d9a521]">
                    {link.label}
                  </Link>
                </li>
              ) : (
                <li key={link.label} className="text-[#f3e6c8]/35 cursor-not-allowed inline-flex items-center gap-1.5">
                  {link.label}
                  <Badge variant="slate" className="text-[10px] px-1.5 py-0 bg-white/10 text-[#f3e6c8]/70 border-white/20">{language === "vi" ? "sắp ra mắt" : "soon"}</Badge>
                </li>
              )
            )}
          </ul>
        </div>

        {/* More */}
        <div>
          <h4 className="font-display text-[#d9a521] mb-4 text-lg">
            {t("footer.more")}
          </h4>
          <ul className="space-y-3">
            {moreLinks.map((link) => (
              <li key={link.label}>
                <Link href={localeHref(link.href)} className="mono-label text-[#f3e6c8]/75 transition-colors hover:text-[#d9a521]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <h4 className="font-display text-[#d9a521] mb-4 text-lg">
            {t("footer.about")}
          </h4>
          <ul className="space-y-3">
            {aboutLinks.map((link) => (
              <li key={link.label}>
                <Link href={localeHref(link.href)} className="mono-label text-[#f3e6c8]/75 transition-colors hover:text-[#d9a521]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-center">
        <p className="text-[#f3e6c8]/45 text-sm">
          © {new Date().getFullYear()} AstroMind Astrology. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
