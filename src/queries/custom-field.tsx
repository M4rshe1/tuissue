"use client";

import {
  deleteProjectCustomFieldAction,
  getProjectCustomFieldsAction,
  updateProjectCustomFieldAction,
} from "@/actions/custom-field";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/components/tui/toaster";
import { revalidateAny } from "@/lib/get-query-client";

export const useGetProjectCustomFieldsQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["custom-fields", projectId],
    queryFn: async () => {
      const { data, error } = await getProjectCustomFieldsAction({
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

export const useDeleteProjectCustomFieldMutation = (projectId: string) => {
  return useMutation({
    mutationFn: async (data: { customFieldId: string }) => {
      const packageData = {
        ...data,
        projectId: projectId,
      };
      const { data: result, error } =
        await deleteProjectCustomFieldAction(packageData);
      if (error) {
        toast({
          variant: "error",
          title: error.message,
          description: error.details,
        });
        return null;
      }
      return result;
    },
    onSuccess: () => {
      revalidateAny(["custom-fields", projectId]);
    },
  });
};

export type UpdateProjectCustomFieldInput = {
  customFieldId: string;
  label?: string;
  type?: string;
  placeholder?: string | null;
  tableShow?: boolean;
  defaultValue?: string | null;
  isObsolete?: boolean;
  description?: string | null;
  dependencyOperator?: string | null;
  required?: boolean;
  order?: number;
  options?: Array<{
    id?: string;
    value: string;
    color?: string | null;
    isIssueClosing?: boolean;
    userId?: string | null;
  }>;
};

export const useUpdateProjectCustomFieldMutation = (projectId: string) => {
  return useMutation({
    mutationFn: async (data: UpdateProjectCustomFieldInput) => {
      const packageData = {
        ...data,
        projectId,
      };
      const { data: result, error } =
        await updateProjectCustomFieldAction(packageData);
      if (error) {
        toast({
          variant: "error",
          title: error.message,
          description: error.details,
        });
        return null;
      }
      return result;
    },
    onSuccess: () => {
      revalidateAny(["custom-fields", projectId]);
    },
  });
};
