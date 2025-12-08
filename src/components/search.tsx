"use client";

import { useState, useEffect } from "react";
import { SearchIcon, Hash, Folder, InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/tui/command";
import { Button } from "./ui/button";
import { useSearchIssuesQuery } from "@/queries/issue";
import { Box } from "./tui/box";
import { Input } from "./tui/input";

export function Search({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hideTips, setHideTips] = useState(false);
  const router = useRouter();
  const { data: searchResults, isLoading } = useSearchIssuesQuery(
    searchQuery,
    open,
  );
  const issues = searchResults?.issues ?? [];
  const projects = searchResults?.projects ?? [];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelectIssue = (issueId: string, projectId: string) => {
    router.push(`/projects/${projectId}/issues/${issueId}`);
    setOpen(false);
    setSearchQuery("");
  };

  const handleSelectProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
    setOpen(false);
    setSearchQuery("");
  };

  const toggleTips = () => {
    setHideTips(!hideTips);
  };

  return (
    <>
      <Button size="xs" onClick={() => setOpen(true)}>
        <SearchIcon className="size-4" />
        Search
      </Button>
      <CommandDialog
        box={{
          text: {
            topLeft: (
              <div className="flex items-center gap-1">
                <SearchIcon className="size-4 shrink-0" />
                <span>Search</span>
              </div>
            ),
          },
          style: {
            background: "bg-background",
          },
        }}
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) {
            setSearchQuery("");
          }
        }}
      >
        <div className="h-fit">
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <CommandList>
          {isLoading && (
            <Box>
              <div className="text-muted-foreground py-6 text-center text-sm">
                Searching...
              </div>
            </Box>
          )}
          {!isLoading &&
            issues.length === 0 &&
            projects.length === 0 &&
            searchQuery && <CommandEmpty>No results found.</CommandEmpty>}
          {!isLoading && (projects.length > 0 || issues.length > 0) && (
            <CommandGroup text={{ topLeft: "Results" }}>
              {projects.map((project) => (
                <CommandItem
                  key={`project-${project.id}`}
                  className="flex items-center gap-1"
                  onSelect={() => handleSelectProject(project.id)}
                >
                  <Folder className="size-4" />
                  <span className="truncate text-sm">{project.name}</span>
                </CommandItem>
              ))}
              {issues.map((issue) => (
                <CommandItem
                  key={`issue-${issue.id}`}
                  className="flex items-center gap-1"
                  onSelect={() => handleSelectIssue(issue.id, issue.projectId)}
                >
                  <Hash className="size-4" />
                  <span className="truncate text-sm">
                    {issue.project?.name && <>{issue.project.name} #</>}
                    {issue.number}: {issue.title}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
        {!hideTips && (
          <Box
            text={{ topLeft: "Tips" }}
            style={{ box: "text-warning" }}
            onClose={toggleTips}
          >
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Hash className="size-4" />
                <span>Use #123 to search by issue number</span>
              </div>
              <div className="flex items-center gap-2">
                <Folder className="size-4" />
                <span>Use @project-name to search for projects</span>
              </div>
            </div>
          </Box>
        )}
      </CommandDialog>
    </>
  );
}
