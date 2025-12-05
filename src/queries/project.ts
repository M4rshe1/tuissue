import { useMutation, useQuery } from "@tanstack/react-query";
import { createProjectAction, searchProjectsAction } from "@/actions/project";
import { toast } from "@/components/tui/toaster";
import { z } from "zod";
import type { StructuredQuery } from "@/components/tui/condition-search/types";
import { revalidateAny } from "@/lib/get-query-client";
import { PROJECT_VISIBILITY } from "@/lib/enums";
import { valueIsValid } from "@/lib/condition-search";

export const useSearchProjectsQuery = (
  queries: StructuredQuery[],
  textQuery: string,
) => {
  return useQuery({
    queryKey: ["projects", queries, textQuery],
    queryFn: async () => {
      const { data, error } = await searchProjectsAction({
        queries: queries
          .filter((query) => valueIsValid(query.operator, query.value))
          .map((query) => ({
            ...query,
            value: query.value ? JSON.stringify(query.value) : "",
          })),
        textQuery,
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

export const useCreateProjectMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      visibility: (typeof PROJECT_VISIBILITY)[keyof typeof PROJECT_VISIBILITY];
      inheritCustomFields: boolean;
    }) => {
      const { data: projectData, error } = await createProjectAction(data);
      if (error) {
        toast({
          variant: "error",
          title: error.message,
          description: error.details,
        });
        return null;
      }
      return projectData;
    },
    onSuccess: () => {
      revalidateAny("projects");
    },
  });
};
