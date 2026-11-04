import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatBirthDate(birthDate: string, birthTime: string, timezone: string): string {
  return `${birthDate} at ${birthTime} (${timezone})`;
}

export function degreesToDMS(deg: number): string {
  const d = Math.floor(Math.abs(deg));
  const m = Math.floor((Math.abs(deg) - d) * 60);
  const s = Math.round(((Math.abs(deg) - d) * 60 - m) * 60);
  return `${d}°${m}'${s}"`;
}

/** U+FE0E asks for the text glyph; without it iOS/macOS draw coloured emoji for ♀ ♂ and the signs. */
const asText = (glyphs: Record<string, string>): Record<string, string> =>
  Object.fromEntries(Object.entries(glyphs).map(([k, g]) => [k, `${g}\uFE0E`]));

export const PLANET_GLYPHS: Record<string, string> = asText({
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
  "North Node": "☊",
  "South Node": "☋",
  Chiron: "⚷",
});

export const ZODIAC_GLYPHS: Record<string, string> = asText({
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
});

export const ASPECT_COLORS: Record<string, string> = {
  conjunction: "#a67c7e", // Dusty Rose
  opposition: "#d97b7b", // Soft Coral
  trine: "#819a96", // Soft Teal / Sage
  square: "#bc8f8f", // Rosy Brown
  sextile: "#8fa3b5", // Muted Slate Blue
  quincunx: "#b09eaf", // Soft Lavender
  semisquare: "#c4a482", // Muted Gold / Sand
  sesquiquadrate: "#c4a482", // Muted Gold / Sand
};

export const ZODIAC_ELEMENTS: Record<string, string> = {
  Aries: "fire", Leo: "fire", Sagittarius: "fire",
  Taurus: "earth", Virgo: "earth", Capricorn: "earth",
  Gemini: "air", Libra: "air", Aquarius: "air",
  Cancer: "water", Scorpio: "water", Pisces: "water",
};

export const ELEMENT_COLORS: Record<string, string> = {
  fire: "#d4a373", // Warm Sand / Gold
  earth: "#a3b18a", // Soft Olive / Sage
  air: "#a4b8c4", // Soft Slate Blue
  water: "#8ba3b5", // Muted Cerulean
};

export const ZODIAC_SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];
