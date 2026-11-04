"use client";

import { MotionConfig } from "framer-motion";

/** Makes every framer-motion transform animation respect `prefers-reduced-motion`. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
