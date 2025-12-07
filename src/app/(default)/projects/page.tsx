import ProjectsClient from "./client";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { searchProjectsAction } from "@/actions/project";
import { withOptionalAuth } from "@/lib/hoc-pages";
import type { Session } from "@/server/better-auth/config";

const Page = async ({ session }: { session: Session | null }) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["search-projects", [], ""],
    queryFn: () => searchProjectsAction({ queries: [], textQuery: "" }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectsClient />
    </HydrationBoundary>
  );
};

export default withOptionalAuth(Page);
