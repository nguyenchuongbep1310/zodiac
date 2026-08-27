import tzlookup from "tz-lookup";

export interface GeoLocation {
  lat: number;
  lon: number;
  city: string;
  timezone: string;
}

const KNOWN_CITIES: Record<string, { lat: number; lon: number; city: string; timezone: string }> = {
  "ha noi": { lat: 21.0285, lon: 105.8542, city: "Hà Nội", timezone: "Asia/Ho_Chi_Minh" },
  "hanoi": { lat: 21.0285, lon: 105.8542, city: "Hà Nội", timezone: "Asia/Ho_Chi_Minh" },
  "tp ho chi minh": { lat: 10.8231, lon: 106.6297, city: "TP Hồ Chí Minh", timezone: "Asia/Ho_Chi_Minh" },
  "ho chi minh": { lat: 10.8231, lon: 106.6297, city: "TP Hồ Chí Minh", timezone: "Asia/Ho_Chi_Minh" },
  "ho chi minh city": { lat: 10.8231, lon: 106.6297, city: "TP Hồ Chí Minh", timezone: "Asia/Ho_Chi_Minh" },
  "saigon": { lat: 10.8231, lon: 106.6297, city: "TP Hồ Chí Minh", timezone: "Asia/Ho_Chi_Minh" },
  "sai gon": { lat: 10.8231, lon: 106.6297, city: "TP Hồ Chí Minh", timezone: "Asia/Ho_Chi_Minh" },
  "da nang": { lat: 16.0544, lon: 108.2022, city: "Đà Nẵng", timezone: "Asia/Ho_Chi_Minh" },
  "danang": { lat: 16.0544, lon: 108.2022, city: "Đà Nẵng", timezone: "Asia/Ho_Chi_Minh" },
  "hai phong": { lat: 20.8449, lon: 106.6881, city: "Hải Phòng", timezone: "Asia/Ho_Chi_Minh" },
  "haiphong": { lat: 20.8449, lon: 106.6881, city: "Hải Phòng", timezone: "Asia/Ho_Chi_Minh" },
  "can tho": { lat: 10.0452, lon: 105.7469, city: "Cần Thơ", timezone: "Asia/Ho_Chi_Minh" },
  "cantho": { lat: 10.0452, lon: 105.7469, city: "Cần Thơ", timezone: "Asia/Ho_Chi_Minh" },
  "da lat": { lat: 11.9404, lon: 108.4583, city: "Đà Lạt", timezone: "Asia/Ho_Chi_Minh" },
  "dalat": { lat: 11.9404, lon: 108.4583, city: "Đà Lạt", timezone: "Asia/Ho_Chi_Minh" },
  "nha trang": { lat: 12.2388, lon: 109.1967, city: "Nha Trang", timezone: "Asia/Ho_Chi_Minh" },
  "nhatrang": { lat: 12.2388, lon: 109.1967, city: "Nha Trang", timezone: "Asia/Ho_Chi_Minh" },
  "hue": { lat: 16.4637, lon: 107.5909, city: "Huế", timezone: "Asia/Ho_Chi_Minh" },
  "vung tau": { lat: 10.3460, lon: 107.0843, city: "Vũng Tàu", timezone: "Asia/Ho_Chi_Minh" },
  "vungtau": { lat: 10.3460, lon: 107.0843, city: "Vũng Tàu", timezone: "Asia/Ho_Chi_Minh" },
  "new york": { lat: 40.7128, lon: -74.0060, city: "New York", timezone: "America/New_York" },
  "los angeles": { lat: 34.0522, lon: -118.2437, city: "Los Angeles", timezone: "America/Los_Angeles" },
  "london": { lat: 51.5074, lon: -0.1278, city: "London", timezone: "Europe/London" },
  "paris": { lat: 48.8566, lon: 2.3522, city: "Paris", timezone: "Europe/Paris" },
  "tokyo": { lat: 35.6762, lon: 139.6503, city: "Tokyo", timezone: "Asia/Tokyo" },
  "sydney": { lat: -33.8688, lon: 151.2093, city: "Sydney", timezone: "Australia/Sydney" },
  "singapore": { lat: 1.3521, lon: 103.8198, city: "Singapore", timezone: "Asia/Singapore" },
  "bangkok": { lat: 13.7563, lon: 100.5018, city: "Bangkok", timezone: "Asia/Bangkok" },
  "seoul": { lat: 37.5665, lon: 126.9780, city: "Seoul", timezone: "Asia/Seoul" },
  "berlin": { lat: 52.5200, lon: 13.4050, city: "Berlin", timezone: "Europe/Berlin" },
};

function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

export async function searchCities(query: string): Promise<Array<{ display_name: string; lat: string; lon: string }>> {
  if (!query || query.length < 2) return [];

  const norm = normalizeKey(query);
  const matched = Object.entries(KNOWN_CITIES)
    .filter(([k]) => k.includes(norm) || norm.includes(k))
    .map(([_, v]) => ({
      display_name: v.city,
      lat: String(v.lat),
      lon: String(v.lon),
    }));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      { signal: controller.signal, referrerPolicy: "origin" }
    );
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Network or CORS error — ignore and use fallback
  }

  return matched;
}

export async function resolveLocation(cityName: string): Promise<GeoLocation | null> {
  const norm = normalizeKey(cityName);
  const known = KNOWN_CITIES[norm] || Object.entries(KNOWN_CITIES).find(([k]) => norm.includes(k))?.[1];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`,
      { signal: controller.signal, referrerPolicy: "origin" }
    );
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const resolvedCity = data[0].display_name.split(",")[0].trim();
        let tz = "UTC";
        try {
          tz = tzlookup(lat, lon);
        } catch {
          if (known) tz = known.timezone;
        }
        return { lat, lon, city: resolvedCity, timezone: tz };
      }
    }
  } catch {
    // Network error
  }

  if (known) {
    return {
      lat: known.lat,
      lon: known.lon,
      city: known.city,
      timezone: known.timezone,
    };
  }

  // Nothing matched a known city and the geocoding API found nothing either.
  return null;
}
