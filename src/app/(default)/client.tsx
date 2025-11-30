"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/tui/toaster";
import { ConditionSearch } from "@/components/tui/condition-search/index";
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
    {
      category: "project",
      label: "Project",
      type: "PROJECT",
      values: [
        { value: "demo-project", label: "Demo project" },
        { value: "web-app", label: "Web App" },
        { value: "mobile-app", label: "Mobile App" },
      ],
    },
    {
      category: "assignee",
      label: "Assignee",
      type: "USER",
      values: [],
      useAsyncValues: true, // Use async fetching for this category
    },
    {
      category: "priority",
      label: "Priority",
      type: "SELECT",
      values: [
        { value: "low", label: "Low" },
        { value: "normal", label: "Normal" },
        { value: "high", label: "High" },
        { value: "critical", label: "Critical" },
      ],
    },
    {
      category: "status",
      label: "Status",
      type: "STATE",
      values: [
        { value: "open", label: "Open" },
        { value: "in-progress", label: "In Progress" },
        { value: "resolved", label: "Resolved" },
        { value: "closed", label: "Closed" },
      ],
    },
    {
      category: "attachments",
      label: "Attachments",
      type: "FILE",
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
          options={searchOptions}
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
