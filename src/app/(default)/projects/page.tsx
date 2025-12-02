import { withAuth } from "@/lib/hoc-pages";
import ProjectsClient from "./client";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { searchProjectsAction } from "@/actions/project";

const Page = async () => {
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

export default withAuth(Page);
