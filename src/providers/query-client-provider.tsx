"use client";

import { getQueryClient } from "@/lib/get-query-client";
import { QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

export function QueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());
  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  );
}
