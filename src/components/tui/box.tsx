"use client";

import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

export type BoxProps = React.ComponentProps<"div"> & {
  style?: {
    background?: string;
    content?: string;
    box?: string;
  };
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
  style,
  onClose,
  text,
}: BoxProps & { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "text-muted-foreground bg-background relative h-full min-h-0 w-full p-2.5",
        style?.background,
        style?.box,
      )}
    >
      {text?.topLeft && (
        <div
          className={cn(
            "bg-background absolute top-0 left-4 px-1 text-sm font-bold",
            style?.background,
          )}
        >
          {text.topLeft}
        </div>
      )}
      {text?.topRight && (
        <div
          className={cn(
            "bg-background absolute top-0 right-4 px-1 text-sm font-bold",
            style?.background,
          )}
        >
          {text.topRight}
        </div>
      )}
      {text?.topCenter && (
        <div
          className={cn(
            "bg-background absolute top-0 right-1/2 translate-x-1/2 px-1 text-sm font-bold",
            style?.background,
          )}
        >
          {text.topCenter}
        </div>
      )}
      {text?.bottomCenter && (
        <div
          className={cn(
            "bg-background absolute right-1/2 bottom-0 translate-x-1/2 px-1 text-sm font-bold",
            style?.background,
          )}
        >
          {text.bottomCenter}
        </div>
      )}
      {text?.bottomLeft && (
        <div
          className={cn(
            "bg-background absolute bottom-0 left-4 px-1 text-sm font-bold",
            style?.background,
          )}
        >
          {text.bottomLeft}
        </div>
      )}
      {text?.bottomRight && (
        <div
          className={cn(
            "bg-background absolute right-4 bottom-0 px-1 text-sm font-bold",
            style?.background,
          )}
        >
          {text.bottomRight}
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
