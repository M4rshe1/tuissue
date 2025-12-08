import Client from "./client";
import { withProject } from "@/lib/hoc-pages";
import { getProjectAction } from "@/actions/project";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: { projectId: string } }) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["project", params.projectId],
    queryFn: async () => {
      const { data, error } = await getProjectAction({
        projectId: params.projectId,
      });
      if (error) {
        notFound();
      }
      return data;
    },
  });

  const project = await queryClient.getQueryData(["project", params.projectId]);
  if (!project) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Client projectId={params.projectId} />
    </HydrationBoundary>
  );
};

export default withProject(Page);
