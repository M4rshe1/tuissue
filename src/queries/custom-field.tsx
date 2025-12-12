"use client";

import { getCustomFieldsAction } from "@/actions/custom-field";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/tui/toaster";

export const useGetCustomFieldsQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["custom-fields", projectId],
    queryFn: async () => {
      const { data, error } = await getCustomFieldsAction({
        projectId: projectId,
      });
      if (error) {
        toast({
          variant: "error",
          title: error.message,
          description: error.details,
        });
        return null;
      }
      return data;
    },
    enabled: !!projectId,
  });
};
