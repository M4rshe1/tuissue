"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/tui/toaster";
import {
  ConditionSearch,
  type ConditionSearchOption,
} from "@/components/tui/condition-search/index";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Client = () => {
  const [queries, setQueries] = useState<any[]>([]);

  // Example async function to fetch user values
  const fetchUserValues = async (category: string, searchQuery: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock user data
    const allUsers = [
      { value: "user1", label: "Alice Johnson", initials: "AJ" },
      { value: "user2", label: "Bob Smith", initials: "BS" },
      { value: "user3", label: "Charlie Brown", initials: "CB" },
      { value: "user4", label: "Diana Prince", initials: "DP" },
      { value: "user5", label: "Eve Adams", initials: "EA" },
    ];

    // Filter based on search query
    const filtered = allUsers.filter((user) =>
      user.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return filtered.map((user) => ({
      value: user.value,
      label: user.label,
      icon: (
        <Avatar className="size-4">
          <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
        </Avatar>
      ),
    }));
  };

  const searchOptions = [
    // TEXT type - supports text operators
    {
      category: "title",
      label: "Title",
      type: "TEXT" as const,
      values: [],
    },
    // TEXT_AREA type - supports text operators
    {
      category: "description",
      label: "Description",
      type: "TEXT_AREA" as const,
      values: [],
    },
    // NUMBER type - supports numeric operators and comparisons
    {
      category: "priority-level",
      label: "Priority Level",
      type: "NUMBER" as const,
      values: [],
      min: 1,
      max: 10,
      step: 1,
    },
    // DATE type - supports date operators and comparisons
    {
      category: "due-date",
      label: "Due Date",
      type: "DATE" as const,
      values: [],
    },
    // DATE_TIME type - supports datetime operators and comparisons
    {
      category: "created-at",
      label: "Created At",
      type: "DATE_TIME" as const,
      values: [],
    },
    // TIME type - supports time operators and comparisons
    {
      category: "time-estimate",
      label: "Time Estimate",
      type: "TIME" as const,
      values: [],
    },
    // BOOLEAN type - supports boolean operators
    {
      category: "is-urgent",
      label: "Is Urgent",
      type: "BOOLEAN" as const,
      values: [],
    },
    // LINK type - supports text operators
    {
      category: "external-link",
      label: "External Link",
      type: "LINK" as const,
      values: [],
    },
    // USER type - supports user-specific operators with async values
    {
      category: "assignee",
      label: "Assignee",
      type: "USER" as const,
      values: [],
      useAsyncValues: true,
    },
    // USER_LIST type - supports multi-user operators
    {
      category: "watchers",
      label: "Watchers",
      type: "USER_LIST" as const,
      values: [],
      useAsyncValues: true,
    },
    // SELECT type - supports selection operators
    {
      category: "priority",
      label: "Priority",
      type: "SELECT" as const,
      values: [
        { value: "low", label: "Low" },
        { value: "normal", label: "Normal" },
        { value: "high", label: "High" },
        { value: "critical", label: "Critical" },
      ],
    },
    // MULTI_SELECT type - supports multi-selection operators
    {
      category: "tags",
      label: "Tags",
      type: "MULTI_SELECT" as const,
      values: [
        { value: "bug", label: "Bug" },
        { value: "feature", label: "Feature" },
        { value: "enhancement", label: "Enhancement" },
        { value: "documentation", label: "Documentation" },
      ],
    },
    // STATE type - supports state operators
    {
      category: "status",
      label: "Status",
      type: "STATE" as const,
      values: [
        { value: "open", label: "Open" },
        { value: "in-progress", label: "In Progress" },
        { value: "resolved", label: "Resolved" },
        { value: "closed", label: "Closed" },
      ],
    },
    // MULTI_SELECT type for projects - supports multiple project selection
    {
      category: "project",
      label: "Project",
      type: "MULTI_SELECT" as const,
      values: [
        { value: "demo-project", label: "Demo project" },
        { value: "web-app", label: "Web App" },
        { value: "mobile-app", label: "Mobile App" },
      ],
    },
    // FILE type - supports file operators
    {
      category: "attachments",
      label: "Attachments",
      type: "FILE" as const,
      values: [],
    },
  ];

  const handleSearch = (queries: any[], textQuery: string) => {
    console.log("Search triggered:", { queries, textQuery });
    toast({
      title: "Search executed",
      description: `Found ${queries.length} filters and text: "${textQuery}"`,
      variant: "info",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Condition Search Example</h2>
        <ConditionSearch
          options={searchOptions as ConditionSearchOption[]}
          value={queries}
          onChange={setQueries}
          onSearch={handleSearch}
          onFetchValues={fetchUserValues}
          placeholder="Search for text or add a filter"
          boxProps={{
            style: {
              background: "bg-background",
              content: "p-2",
            },
          }}
        />
        {queries.length > 0 && (
          <div className="rounded-md border p-4">
            <h3 className="mb-2 text-sm font-semibold">Current Filters:</h3>
            <pre className="overflow-auto text-xs">
              {JSON.stringify(queries, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Toast Examples</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              toast({
                title: "Hello",
                description: "Hello",
                variant: "success",
                button: {
                  label: "Click me",
                  onClick: () => {
                    console.log("clicked");
                  },
                },
              })
            }
          >
            Success
          </Button>
          <Button
            onClick={() =>
              toast({
                title: "Hello",
                description: "Hello",
                variant: "default",
                button: {
                  label: "Click me",
                  onClick: () => {
                    console.log("clicked");
                  },
                },
              })
            }
          >
            Default
          </Button>
          <Button
            onClick={() =>
              toast({
                title: "Hello",
                description: "Hello",
                variant: "error",
                button: {
                  label: "Click me",
                  onClick: () => {
                    console.log("clicked");
                  },
                },
              })
            }
          >
            Error
          </Button>
          <Button
            onClick={() =>
              toast({
                title: "Hello",
                description: "Hello",
                variant: "warning",
                button: {
                  label: "Click me",
                  onClick: () => {
                    console.log("clicked");
                  },
                },
              })
            }
          >
            Warning
          </Button>
          <Button
            onClick={() =>
              toast({
                title: "Hello",
                description: "Hello",
                variant: "info",
                button: {
                  label: "Click me",
                  onClick: () => {
                    console.log("clicked");
                  },
                },
              })
            }
          >
            Info
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Client;
