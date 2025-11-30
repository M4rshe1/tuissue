"use client";

import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { useEffect } from "react";

export type BoxProps = React.ComponentProps<"div"> & {
  style?: {
    background?: string;
    content?: string;
    box?: string;
  };
  shortcuts?: {
    label: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    letters: string[];
    action: (event: KeyboardEvent) => void;
  }[];
  onClose?: () => void;
  text?: {
    topLeft?: string | React.ReactNode;
    topRight?: string | React.ReactNode;
    topCenter?: string | React.ReactNode;
    bottomCenter?: string | React.ReactNode;
    bottomLeft?: string | React.ReactNode;
    bottomRight?: string | React.ReactNode;
  };
};

export const Box = ({
  children,
  style = {
    background: "bg-background",
  },
  shortcuts = undefined,
  onClose,
  text,
}: BoxProps & { children: React.ReactNode }) => {
  const handleShortcut = (event: KeyboardEvent) => {
    if (!shortcuts) return;
    for (const shortcut of shortcuts) {
      if (
        !shortcut.letters.every((letter) =>
          event.key.toLowerCase().includes(letter.toLowerCase()),
        )
      )
        continue;
      if (shortcut.ctrlKey && !event.ctrlKey) continue;
      if (shortcut.shiftKey && !event.shiftKey) continue;
      if (shortcut.altKey && !event.altKey) continue;
      if (shortcut.metaKey && !event.metaKey) continue;
      event.preventDefault();
      shortcut.action(event);
      break;
    }
  };
  useEffect(() => {
    if (!shortcuts) return;
    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [shortcuts]);
  return (
    <div
      className={cn(
        "text-muted-foreground relative h-full min-h-0 w-full p-2.5",
        style?.background,
        style?.box,
      )}
    >
      {text?.topLeft && (
        <div
          className={cn(
            "absolute top-0 left-4 px-1 text-sm font-bold",
            style?.background,
          )}
        >
          {text.topLeft}
        </div>
      )}
      {text?.topRight && (
        <div
          className={cn(
            "absolute top-0 right-4 px-1 text-sm font-bold",
            style?.background,
          )}
        >
          {text.topRight}
        </div>
      )}
      {text?.topCenter && (
        <div
          className={cn(
            "absolute top-0 right-1/2 translate-x-1/2 px-1 text-sm font-bold",
            style?.background,
          )}
        >
          {text.topCenter}
        </div>
      )}
      {text?.bottomCenter && (
        <div
          className={cn(
            "absolute right-1/2 bottom-0 translate-x-1/2 px-1 text-sm font-bold",
            style?.background,
          )}
        >
          {text.bottomCenter}
        </div>
      )}
      {text?.bottomLeft && (
        <div
          className={cn(
            "absolute bottom-0 left-4 px-1 text-sm font-bold",
            style?.background,
          )}
        >
          {text.bottomLeft}
        </div>
      )}
      {text?.bottomRight && (
        <div
          className={cn(
            "absolute right-4 bottom-0 px-1 text-sm font-bold",
            style?.background,
          )}
        >
          {text.bottomRight}
        </div>
      )}
      {shortcuts && (
        <div
          className={cn(
            "text-muted-foreground absolute right-1/2 bottom-0 h-fit w-fit translate-x-1/2 text-sm",
            style?.background,
          )}
        >
          {shortcuts.map((shortcut) => (
            <div key={shortcut.label} className="text-sm font-bold">
              [{shortcut.letters.join("+")}
              {shortcut.ctrlKey && "Ctrl"}
              {shortcut.shiftKey && "Shift"}
              {shortcut.altKey && "Alt"}
              {shortcut.metaKey && "Meta"}] {shortcut.label}
            </div>
          ))}
        </div>
      )}
      {onClose && (
        <div
          className="bg-foreground text-background hover:bg-error hover:text-error-foreground absolute top-0 right-0"
          onClick={onClose}
        >
          <XIcon className="size-5 cursor-pointer" />
        </div>
      )}
      <div
        className={cn(
          "h-full w-full overflow-auto rounded-xs p-2.5 ring-2",
          style?.content,
        )}
      >
        {children}
      </div>
    </div>
  );
};
