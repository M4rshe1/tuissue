import NewProjectClient from "./client";
import { withAuth } from "@/lib/hoc-pages";
import type { Session } from "@/server/better-auth/config";
import { db } from "@/server/db";
import { GLOBAL_SETTINGS } from "@/lib/settings/global";
import { redirect } from "next/navigation";

const Page = async ({ session }: { session: Session }) => {
  const dbSettings = await db.setting.findMany({
    where: {
      key: {
        in: [
          GLOBAL_SETTINGS.WHO_CAN_CREATE_PROJECTS?.key ?? "",
          GLOBAL_SETTINGS.CUSTOM_CREATE_PROJECT_USERS?.key ?? "",
        ],
      },
      scope: "GLOBAL",
    },
  });

  const settings = dbSettings.reduce(
    (acc, curr) => {
      acc[curr.key] = JSON.parse(curr.value);
      return acc;
    },
    {} as Record<string, string>,
  );

  if (
    settings[GLOBAL_SETTINGS.WHO_CAN_CREATE_PROJECTS?.key ?? ""] === "ADMIN" &&
    session.user.role !== "admin"
  ) {
    redirect("/");
  }

  if (
    settings[GLOBAL_SETTINGS.WHO_CAN_CREATE_PROJECTS?.key ?? ""] === "CUSTOM" &&
    !settings[GLOBAL_SETTINGS.CUSTOM_CREATE_PROJECT_USERS?.key ?? ""]?.includes(
      session.user.id,
    )
  ) {
    redirect("/");
  }

  return <NewProjectClient />;
};

export default withAuth(Page);
