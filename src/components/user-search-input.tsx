"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchUsersQuery, useGetUserQuery } from "@/queries/user";
import { Loader2 } from "lucide-react";

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
};

type UserSearchInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  config?: UserSearchInputConfig;
};

export type UserSearchInputConfig = {
  excludeSelf?: boolean;
  onlyUsers?: string[];
  excludeBanned?: boolean;
  excludeDeleted?: boolean;
  excludeUsers?: string[];
};

export function UserSearchInput({
  value,
  onChange,
  placeholder = "Suche Benutzer...",
  disabled = false,
  className,
  config,
}: UserSearchInputProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { data: users = [], isLoading } = useSearchUsersQuery(
    searchQuery.trim() || "",
    {
      excludeSelf: config?.excludeSelf ?? false,
      excludeBanned: config?.excludeBanned ?? true,
      excludeDeleted: config?.excludeDeleted ?? true,
      excludeUsers: config?.excludeUsers ?? [],
      onlyUsers: config?.onlyUsers ?? undefined,
    },
  );
  const { data: fetchedUser } = useGetUserQuery(value || "");

  const selectedUser = React.useMemo(() => {
    if (!value) return null;
    const userInResults = users?.find((user) => user.id === value);
    if (userInResults) return userInResults;
    return fetchedUser || null;
  }, [value, users, fetchedUser]);

  const displayName = React.useMemo(() => {
    if (!selectedUser) return "";
    const name = [selectedUser.firstName, selectedUser.lastName]
      .filter(Boolean)
      .join(" ");
    return name || selectedUser.email;
  }, [selectedUser]);

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setSearchQuery("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {displayName || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <CommandEmpty>
                  {searchQuery.trim()
                    ? "Keine Benutzer gefunden."
                    : "Geben Sie einen Suchbegriff ein..."}
                </CommandEmpty>
                <CommandGroup>
                  {users?.map((user) => {
                    const name = [user.firstName, user.lastName]
                      .filter(Boolean)
                      .join(" ");
                    const displayText = name || user.email;
                    return (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={() => {
                          onChange?.(user.id);
                          setOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === user.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{displayText}</span>
                          {name && (
                            <span className="text-muted-foreground text-xs">
                              {user.email}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
