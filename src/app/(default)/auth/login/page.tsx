import { withAuth } from "@/lib/hoc-pages";
import LoginClient from "./client";

const Page = () => {
  return <LoginClient />;
};

export default withAuth(Page, true);
