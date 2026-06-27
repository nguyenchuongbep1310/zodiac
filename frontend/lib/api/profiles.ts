import apiClient from "./client";
import {
  CreateProfileRequest,
  ProfileListResponse,
  ProfileResponse,
} from "@/lib/types/api";

export const profilesApi = {
  list: async (): Promise<ProfileListResponse> => {
    const res = await apiClient.get<ProfileListResponse>("/v1/profiles");
    return res.data;
  },

  getById: async (id: string): Promise<ProfileResponse> => {
    const res = await apiClient.get<ProfileResponse>(`/v1/profiles/${id}`);
    return res.data;
  },

  create: async (data: CreateProfileRequest): Promise<ProfileResponse> => {
    const res = await apiClient.post<ProfileResponse>("/v1/profiles", data);
    return res.data;
  },
};

// ─── Query key factory ────────────────────────────────────────────────────────

export const profileKeys = {
  all: ["profiles"] as const,
  lists: () => [...profileKeys.all, "list"] as const,
  detail: (id: string) => [...profileKeys.all, "detail", id] as const,
};
