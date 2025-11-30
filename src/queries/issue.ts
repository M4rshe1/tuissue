import { searchIssuesAction } from "@/actions/search";
import { toast } from "@/components/tui/toaster";
import { useQuery } from "@tanstack/react-query";

export const useSearchIssuesQuery = (searchQuery: string, open: boolean) => {
  return useQuery({
    queryKey: ["search-issues", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return { issues: [], projects: [] };
      const { data, error } = await searchIssuesAction({
        query: searchQuery,
      });
      if (error) {
        toast({
          variant: "error",
          title: error.message,
          description: error.details,
        });
        return { issues: [], projects: [] };
      }
      return data ?? { issues: [], projects: [] };
    },
    enabled: open && searchQuery.trim().length > 0,
  });
};
