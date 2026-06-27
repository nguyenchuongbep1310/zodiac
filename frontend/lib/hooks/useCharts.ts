"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chartsApi, chartKeys } from "@/lib/api/charts";
import { useI18nStore } from "./useI18n";
import { CalculateChartRequest } from "@/lib/types/api";

export function useChart(id: string) {
  return useQuery({
    queryKey: chartKeys.detail(id),
    queryFn: () => chartsApi.getById(id),
    enabled: !!id,
  });
}

export function useChartInterpretations(id: string) {
  const lang = useI18nStore((state) => state.language);
  
  return useQuery({
    queryKey: chartKeys.interpretations(id, lang),
    queryFn: () => chartsApi.getInterpretations(id, lang),
    enabled: !!id,
  });
}

export function useCalculateChart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CalculateChartRequest) => chartsApi.calculate(data),
    onSuccess: (chart) => {
      queryClient.setQueryData(chartKeys.detail(chart.id), chart);
    },
  });
}
