"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  description?: React.ReactNode;
  onRetry?: () => void;
  details?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  details,
  onRetry,
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
      <Alert variant="destructive">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <div className="flex w-full items-center justify-between gap-4">
            <div className="text-muted-foreground text-sm">{description}</div>
            {/* {details && (
              <div className="text-muted-foreground text-sm">
                {details}
              </div>
            )} */}
            <div className="flex items-center gap-2">
              <span
                className="text-muted-foreground hover:text-primary cursor-pointer text-sm transition-all hover:underline"
                onClick={() => router.back()}
              >
                Go back
              </span>
              {/* {onRetry ? (
                <span
                  className="text-muted-foreground cursor-pointer text-sm"
                  onClick={onRetry}
                >
                  Try again
                </span>
              ) : null} */}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
