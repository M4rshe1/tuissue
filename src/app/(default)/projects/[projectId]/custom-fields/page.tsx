import { getProjectCustomFieldsAction } from "@/actions/custom-field";
import { getProjectAction } from "@/actions/project";
import { getQueryClient } from "@/lib/get-query-client";
import { withOptionalAuth } from "@/lib/hoc-pages";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import Client from "./client";

const Page = async ({ params }: { params: { projectId: string } }) => {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
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
    }),
    queryClient.prefetchQuery({
      queryKey: ["custom-fields", params.projectId],
      queryFn: async () => {
        const { data, error } = await getProjectCustomFieldsAction({
          projectId: params.projectId,
        });
        if (error) {
          notFound();
        }
        return data;
      },
    }),
  ]);

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

export default withOptionalAuth(Page);
