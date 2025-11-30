import { withOptionalAuth } from "@/lib/hoc-pages";
import RegisterClient from "./client";
import type { Session } from "@/server/better-auth/config";

const Page = ({ session }: { session: Session | null }) => {
  return <RegisterClient />;
};

export default withOptionalAuth(Page);
