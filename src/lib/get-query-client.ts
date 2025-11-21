import { isServer, QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function revalidateAny(queryKeys: string[] | string) {
  const queryKeyArray = Array.isArray(queryKeys) ? queryKeys : [queryKeys];
  if (queryKeys === "any") {
    getQueryClient().resetQueries();
    return;
  }
  getQueryClient().invalidateQueries({
    predicate: (query) =>
      queryKeyArray.some((key) => query.queryKey.includes(key)),
  });
}
