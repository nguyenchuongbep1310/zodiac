// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

// ─── Profiles ─────────────────────────────────────────────────────────────────

export interface LocationResponse {
  latitude: number;
  longitude: number;
  city: string;
}

export interface ProfileResponse {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  timezone: string;
  location: LocationResponse;
  created_at: string;
  updated_at: string;
}

export interface ProfileListResponse {
  data: ProfileResponse[];
  total: number;
}

export interface CreateProfileRequest {
  name: string;
  birth_date: string;
  birth_time: string;
  timezone: string;
  latitude: number;
  longitude: number;
  city: string;
}

// ─── Charts ───────────────────────────────────────────────────────────────────

export interface PlanetPositionResponse {
  planet: string;
  longitude: number;
  latitude: number;
  speed: number;
  is_retrograde: boolean;
  sign: string;
  house_number: number;
}

export interface HouseCuspResponse {
  house_number: number;
  cusp_longitude: number;
  sign: string;
}

export interface AspectResponse {
  planet_1: string;
  planet_2: string;
  aspect_type: string;
  orb: number;
  is_applying: boolean;
}

export interface ChartResponse {
  id: string;
  profile_id: string;
  house_system: string;
  zodiac_system: string;
  is_rectified: boolean;
  planets: PlanetPositionResponse[];
  houses: HouseCuspResponse[];
  aspects: AspectResponse[];
  created_at: string;
}

export interface CalculateChartRequest {
  profile_id: string;
  house_system?: "placidus" | "koch" | "whole_sign" | "equal";
  zodiac_system?: "tropical" | "sidereal";
}

// ─── Interpretations ────────────────────────────────────────────────────────────

export interface InterpretationContentResponse {
  title?: string;
  core_meaning?: string;
  real_life?: string;
  strengths?: string;
  challenges?: string;
  relationships?: string;
  growth_path?: string;
  key_themes?: string[];
}

export interface PlanetInSignResponse {
  planet: string;
  sign: string;
  interpretation?: InterpretationContentResponse;
}

export interface PlanetInHouseResponse {
  planet: string;
  house_number: number;
  interpretation?: InterpretationContentResponse;
}

export interface AspectInterpretationResponse {
  planet_1: string;
  planet_2: string;
  aspect_type: string;
  orb: number;
  is_applying: boolean;
  interpretation?: InterpretationContentResponse;
}

export interface ChartInterpretationResponse {
  chart_id: string;
  language: string;
  planet_in_sign: PlanetInSignResponse[];
  planet_in_house: PlanetInHouseResponse[];
  aspects: AspectInterpretationResponse[];
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export class ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, string>;

  constructor(status: number, code: string, message: string, details?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
