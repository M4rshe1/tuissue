"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserAction, searchUsersAction } from "@/actions/user";
import { toast } from "@/components/tui/toaster";

export const useSearchUsersQuery = (
  query: string,
  options?: {
    excludeSelf?: boolean;
    onlyUsers?: string[];
    excludeBanned?: boolean;
    excludeDeleted?: boolean;
    excludeUsers?: string[];
    teamId?: string;
  },
) => {
  return useQuery({
    queryKey: ["users", query, options],
    queryFn: async () => {
      const { data, error } = await searchUsersAction({
        query,
        excludeSelf: options?.excludeSelf ?? false,
        excludeBanned: options?.excludeBanned ?? true,
        excludeDeleted: options?.excludeDeleted ?? true,
        excludeUsers: options?.excludeUsers ?? [],
        onlyUsers: options?.onlyUsers ?? [],
        teamId: options?.teamId ?? undefined,
      });
      if (error) {
        toast({
          variant: "error",
          title: error.message,
          description: error.details,
        });
        return null;
      }
      return data ?? [];
    },
  });
};

export const useGetUserQuery = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data, error } = await getUserAction({ id });
      if (error) {
        toast({
          variant: "error",
          title: error.message,
          description: error.details,
        });
        return null;
      }
      return data ?? null;
    },
    enabled: options?.enabled !== false && !!id,
  });
};
