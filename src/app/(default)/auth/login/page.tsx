import { withOptionalAuth } from "@/lib/hoc-pages";
import LoginClient from "./client";

const Page = () => {
  return <LoginClient />;
};

export default withOptionalAuth(Page);
