import { withAuth } from "@/lib/hoc-pages";
import RegisterClient from "./client";
import type { Session } from "@/server/better-auth/config";

const Page = ({ session }: { session: Session | null }) => {
  return <RegisterClient />;
};

export default withAuth(Page, true);
