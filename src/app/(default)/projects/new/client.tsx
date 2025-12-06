"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Box } from "@/components/tui/box";
import { Input } from "@/components/tui/input";
import { toast } from "@/components/tui/toaster";
import { Textarea } from "@/components/tui/textarea";
import { useCreateProjectMutation } from "@/queries/project";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PROJECT_VISIBILITY } from "@/lib/enums";

const NewProjectClient = () => {
  const router = useRouter();
  const { mutateAsync: createProject, isPending } = useCreateProjectMutation();

  const handleSubmit = (formData: FormData) => {
    if (!formData.get("name")?.toString().trim()) {
      toast({
        title: "Validation Error",
        description: "Project name is required",
        variant: "error",
      });
      return;
    }

    createProject({
      name: formData.get("name")?.toString().trim() ?? "",
      description: formData.get("description")?.toString().trim() ?? "",
      visibility: formData
        .get("visibility")
        ?.toString()
        .trim() as (typeof PROJECT_VISIBILITY)[keyof typeof PROJECT_VISIBILITY],
      inheritCustomFields:
        formData.get("inheritCustomFields")?.toString().trim() === "true",
    });

    toast({
      title: "Success",
      description: `Project "${formData.get("name")?.toString().trim()}" created successfully`,
      variant: "success",
    });

    router.push("/projects");
  };

  const handleCancel = () => {
    router.push("/projects");
  };

  return (
    <Box
      style={{
        background: "bg-background",
        content: "flex items-center justify-center",
      }}
      text={{
        topLeft: "Create New Project",
        bottomLeft: "/projects/new",
      }}
    >
      <form action={handleSubmit} className="w-full space-y-6 md:max-w-lg">
        {/* Project Name */}
        <div className="space-y-2">
          <Input
            name="name"
            type="text"
            box={{
              text: {
                topLeft: "Project Name",
              },
            }}
            placeholder="Enter project name"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Textarea
            name="description"
            box={{
              text: {
                topLeft: "Project Description",
              },
            }}
            placeholder="Enter project description"
            rows={4}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <Select name="visibility">
          <SelectTrigger>
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PROJECT_VISIBILITY).map((visibility) => (
              <SelectItem key={visibility} value={visibility}>
                {visibility}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Project</Button>
        </div>
      </form>
    </Box>
  );
};

export default NewProjectClient;
