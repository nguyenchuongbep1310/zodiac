// ─── Chart geometry constants ───────────────────────────────────────────────

export const VIEWBOX_SIZE = 520;
export const CX = 260; // SVG center x
export const CY = 260; // SVG center y

/**
 * Radii for each concentric ring layer.
 * Layout from outside in:
 *   OUTER > ZODIAC_OUTER > ZODIAC_INNER > HOUSE_OUTER > HOUSE_INNER
 *   > PLANET_TRACK_OUTER > PLANET_GLYPH > PLANET_TRACK_INNER
 *   > ASPECT_RING > CENTER
 */
export const R = {
  // Zodiac band
  OUTER:              245,
  ZODIAC_OUTER:       245,
  ZODIAC_INNER:       206,

  // Degree tick marks
  TICK_BASE:          244,
  TICK_30:            229,  // 15px tick for sign boundaries
  TICK_10:            235,  // 9px tick
  TICK_5:             238,  // 6px tick
  TICK_1:             241,  // 3px tick

  // House band
  HOUSE_OUTER:        206,
  HOUSE_INNER:        168,
  HOUSE_LABEL:        187, // house number label

  // Planet track band
  PLANET_TRACK_OUTER: 168,
  PLANET_TRACK_INNER: 114,
  PLANET_GLYPH:       144, // glyph circle center (base)
  PLANET_TICK_FROM:   205, // tick origin at zodiac inner
  PLANET_TICK_TO:     160, // tick end near planet track outer

  // Aspect lines
  ASPECT_RING:         100,

  // Center glyph
  CENTER:              54,
} as const;

// ─── Colors ─────────────────────────────────────────────────────────────────

export const ELEMENT_FILL: Record<string, { sector: string; glyph: string; border: string }> = {
  fire:  { sector: 'rgba(239,68,68,0.09)',   glyph: '#f87171', border: 'rgba(239,68,68,0.25)' },
  earth: { sector: 'rgba(34,197,94,0.09)',   glyph: '#4ade80', border: 'rgba(34,197,94,0.25)' },
  air:   { sector: 'rgba(96,165,250,0.09)',  glyph: '#93c5fd', border: 'rgba(96,165,250,0.25)' },
  water: { sector: 'rgba(167,139,250,0.09)', glyph: '#c4b5fd', border: 'rgba(167,139,250,0.25)' },
};

/** Aspect visual style: color, dash pattern, opacity, stroke width */
export const ASPECT_STYLE: Record<string, {
  color: string;
  dash: string;
  opacity: number;
  width: number;
  label: string;
}> = {
  // Blue aspects
  trine:          { color: '#3b82f6', dash: 'none',  opacity: 0.70, width: 1.4, label: 'Trine' },
  sextile:        { color: '#60a5fa', dash: '5 3',   opacity: 0.60, width: 1.1, label: 'Sextile' },
  // Red aspects
  square:         { color: '#ef4444', dash: '6 2',   opacity: 0.65, width: 1.3, label: 'Square' },
  opposition:     { color: '#dc2626', dash: 'none',  opacity: 0.75, width: 1.5, label: 'Opposition' },
  // Gray aspects
  conjunction:    { color: '#9ca3af', dash: '3 3',   opacity: 0.55, width: 1.0, label: 'Conjunction' },
  // Secondary
  quincunx:       { color: '#a78bfa', dash: '2 4',   opacity: 0.40, width: 0.8, label: 'Quincunx' },
  semisquare:     { color: '#fb923c', dash: '2 3',   opacity: 0.38, width: 0.8, label: 'Semi-square' },
  sesquiquadrate: { color: '#fb923c', dash: '4 2 1', opacity: 0.38, width: 0.8, label: 'Sesqui-square' },
  semisextile:    { color: '#6b7280', dash: '1 4',   opacity: 0.32, width: 0.7, label: 'Semi-sextile' },
  _default:       { color: '#4b5563', dash: '2 4',   opacity: 0.28, width: 0.6, label: 'Minor' },
};

// ─── Astrology data ──────────────────────────────────────────────────────────

export type ZodiacElement = 'fire' | 'earth' | 'air' | 'water';

export interface ZodiacSignMeta {
  name: string;
  glyph: string;
  element: ZodiacElement;
  /** Ecliptic longitude of sign start (0 = Aries, 30 = Taurus, …) */
  startLon: number;
}

export const ZODIAC_SIGNS: ZodiacSignMeta[] = [
  { name: 'Aries',       glyph: '♈', element: 'fire',  startLon: 0   },
  { name: 'Taurus',      glyph: '♉', element: 'earth', startLon: 30  },
  { name: 'Gemini',      glyph: '♊', element: 'air',   startLon: 60  },
  { name: 'Cancer',      glyph: '♋', element: 'water', startLon: 90  },
  { name: 'Leo',         glyph: '♌', element: 'fire',  startLon: 120 },
  { name: 'Virgo',       glyph: '♍', element: 'earth', startLon: 150 },
  { name: 'Libra',       glyph: '♎', element: 'air',   startLon: 180 },
  { name: 'Scorpio',     glyph: '♏', element: 'water', startLon: 210 },
  { name: 'Sagittarius', glyph: '♐', element: 'fire',  startLon: 240 },
  { name: 'Capricorn',   glyph: '♑', element: 'earth', startLon: 270 },
  { name: 'Aquarius',    glyph: '♒', element: 'air',   startLon: 300 },
  { name: 'Pisces',      glyph: '♓', element: 'water', startLon: 330 },
];

export const PLANET_GLYPH: Record<string, string> = {
  Sun:          '☉',
  Moon:         '☽',
  Mercury:      '☿',
  Venus:        '♀',
  Mars:         '♂',
  Jupiter:      '♃',
  Saturn:       '♄',
  Uranus:       '♅',
  Neptune:      '♆',
  Pluto:        '♇',
  'North Node': '☊',
  'South Node': '☋',
  Chiron:       '⚷',
  Lilith:       '⚸',
};

export const PLANET_ABBR: Record<string, string> = {
  Sun:          'Su',
  Moon:         'Mo',
  Mercury:      'Me',
  Venus:        'Ve',
  Mars:         'Ma',
  Jupiter:      'Ju',
  Saturn:       'Sa',
  Uranus:       'Ur',
  Neptune:      'Ne',
  Pluto:        'Pl',
  'North Node': 'NN',
  'South Node': 'SN',
  Chiron:       'Ch',
  Lilith:       'Li',
};

// Minimum angular separation (°) between adjacent planet display positions
export const MIN_PLANET_SPACING_DEG = 13;

// Planet glyph circle radius
export const PLANET_CIRCLE_R = 11.5;

// Angular house numbers
export const ANGULAR_HOUSES = new Set([1, 4, 7, 10]);

// Roman numerals
export const ROMAN: Record<number, string> = {
  1:'I', 2:'II', 3:'III', 4:'IV', 5:'V', 6:'VI',
  7:'VII', 8:'VIII', 9:'IX', 10:'X', 11:'XI', 12:'XII',
};

// Axis labels for angular houses
export const AXIS_LABEL: Record<number, string> = {
  1: 'ASC', 4: 'IC', 7: 'DSC', 10: 'MC',
};
