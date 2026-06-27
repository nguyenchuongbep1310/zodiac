import apiClient from "./client";
import {
  CalculateChartRequest,
  ChartResponse,
  ChartInterpretationResponse,
} from "@/lib/types/api";

export const chartsApi = {
  calculate: async (data: CalculateChartRequest): Promise<ChartResponse> => {
    const res = await apiClient.post<ChartResponse>("/v1/charts/calculate", data);
    return res.data;
  },

  getById: async (id: string): Promise<ChartResponse> => {
    const res = await apiClient.get<ChartResponse>(`/v1/charts/${id}`);
    return res.data;
  },

  getInterpretations: async (id: string, lang: string = "en"): Promise<ChartInterpretationResponse> => {
    const res = await apiClient.get<ChartInterpretationResponse>(`/v1/charts/${id}/interpretations?lang=${lang}`);
    return res.data;
  },
};

// ─── Query key factory ────────────────────────────────────────────────────────

export const chartKeys = {
  all: ["charts"] as const,
  detail: (id: string) => [...chartKeys.all, "detail", id] as const,
  interpretations: (id: string, lang: string) => [...chartKeys.all, "interpretations", id, lang] as const,
};
