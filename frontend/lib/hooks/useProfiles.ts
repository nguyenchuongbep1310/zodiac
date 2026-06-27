"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profilesApi, profileKeys } from "@/lib/api/profiles";
import { CreateProfileRequest } from "@/lib/types/api";

export function useProfiles() {
  return useQuery({
    queryKey: profileKeys.lists(),
    queryFn: profilesApi.list,
  });
}

export function useProfile(id: string) {
  return useQuery({
    queryKey: profileKeys.detail(id),
    queryFn: () => profilesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProfileRequest) => profilesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
    },
  });
}
