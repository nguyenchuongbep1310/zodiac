import type { Metadata } from "next";
import { LearnPageContent } from "./LearnPageContent";

export const metadata: Metadata = {
  title: "Learn Astrology",
  description:
    "Comprehensive guides on natal charts, planets, synastry, transits, aspects, and progressions — everything you need to read a birth chart.",
};

export default function LearnPage() {
  return <LearnPageContent />;
}
