import { useQuery } from "@tanstack/react-query";
import { searchProjectsAction } from "@/actions/project";
import { toast } from "@/components/tui/toaster";

export const useSearchProjectsQuery = (query: string) => {
  return useQuery({
    queryKey: ["search-projects", query],
    queryFn: async () => {
      const { data, error } = await searchProjectsAction({ query });
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
