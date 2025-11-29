"use client";

import { toast as sonnerToast } from "sonner";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { Box } from "@/components/tui/box";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

export function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id: string) => (
    <Toast
      id={id}
      variant={toast.variant}
      header={toast.header}
      title={toast.title}
      description={toast.description}
      button={toast.button}
    />
  ));
}

function Toast(props: ToastProps) {
  const { title, description, button, id, variant, header, hideHeader } = props;

  return (
    <Box
      className={cn("bg-card relative w-full max-w-sm p-2", {
        "text-green-600": variant === "success",
        "text-red-600": variant === "error",
        "text-yellow-600": variant === "warning",
        "text-blue-600": variant === "info",
        "text-muted-foreground": variant === "default",
      })}
      text={{
        topLeft: hideHeader ? undefined : header || variant.toUpperCase(),
      }}
    >
      <div className="bg-card absolute top-0 right-3">
        <XIcon
          className="text-muted-foreground hover:text-foreground size-4 cursor-pointer"
          onClick={() => sonnerToast.dismiss(id as string)}
        />
      </div>
      <div
        className={cn(
          "my-auto grid h-full w-full grid-cols-[1fr_auto] grid-rows-[24px_24px] items-center gap-x-2 px-2 py-2 shadow-lg ring-2",
        )}
      >
        <p className="text-foreground w-full text-sm font-bold">{title}</p>
        <div className="ml-3 shrink-0">
          {button && (
            <Button
              variant={button.style}
              size={"xs"}
              onClick={() => {
                button?.onClick();
                sonnerToast.dismiss(id);
              }}
            >
              {button.label}
            </Button>
          )}
        </div>
        <p className="text-muted-foreground col-span-2 text-xs">
          {description}
        </p>
      </div>
    </Box>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  variant: "success" | "error" | "warning" | "info" | "default";
  header?: string;
  hideHeader?: boolean;
  button?: {
    label: string;
    onClick: () => void;
    style?: VariantProps<typeof buttonVariants>["variant"];
  };
}
