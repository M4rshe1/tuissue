"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { cn } from "@/lib/utils";
import { Box, type BoxProps } from "./box";
import { Dialog, DialogContent, DialogTitle } from "@/components/tui/dialog";
import { Input } from "@/components/tui/input";

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function CommandDialog({
  children,
  box,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  box?: BoxProps;
}) {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0" box={box}>
        <VisuallyHidden.Root>
          <DialogTitle>Search</DialogTitle>
        </VisuallyHidden.Root>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <div data-slot="command-input-wrapper">
      <Input
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto px-2",
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Box>
      <div
        data-slot="command-empty-wrapper"
        className={cn("py-6 text-center text-sm", className)}
        {...props}
      />
    </Box>
  );
}

function CommandGroup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Box>) {
  return <Box {...props}>{children}</Box>;
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item-wrapper"
      className={cn(
        className,
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground flex h-6 cursor-pointer items-center px-2 text-sm",
      )}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
