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

export const PLANET_GLYPHS: Record<string, string> = {
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
};

export const ZODIAC_GLYPHS: Record<string, string> = {
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
};

export const ASPECT_COLORS: Record<string, string> = {
  conjunction: "#f59e0b",
  opposition: "#f43f5e",
  trine: "#34d399",
  square: "#f43f5e",
  sextile: "#60a5fa",
  quincunx: "#c084fc",
  semisquare: "#fb923c",
  sesquiquadrate: "#fb923c",
};

export const ZODIAC_ELEMENTS: Record<string, string> = {
  Aries: "fire", Leo: "fire", Sagittarius: "fire",
  Taurus: "earth", Virgo: "earth", Capricorn: "earth",
  Gemini: "air", Libra: "air", Aquarius: "air",
  Cancer: "water", Scorpio: "water", Pisces: "water",
};

export const ELEMENT_COLORS: Record<string, string> = {
  fire: "#f59e0b",
  earth: "#34d399",
  air: "#60a5fa",
  water: "#818cf8",
};

export const ZODIAC_SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];
