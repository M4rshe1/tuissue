import { withOptionalAuth } from "@/lib/hoc-pages";
import { Box } from "@/components/tui/box";
import type { Session } from "@/server/better-auth/config";
import Client from "./client";

const Page = ({ session }: { session: Session | null }) => {
  return (
    <Box
      text={{
        bottomLeft: <span className="text-muted-foreground">/</span>,
        topLeft: (
          <span className="text-foreground">
            {session?.user?.name
              ? `Welcome back, ${session?.user?.name}`
              : "Welcome, [USERNAME]"}
          </span>
        ),
      }}
    >
      <Client />
    </Box>
  );
};

export default withOptionalAuth(Page);
