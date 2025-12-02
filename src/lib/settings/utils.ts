import { db } from "@/server/db";
import { SETTING_SCOPE } from "../enums";

export async function getSettings(
  keys: string | string[],
  scope: (typeof SETTING_SCOPE)[keyof typeof SETTING_SCOPE],
  ids: string | string[] | undefined,
) {
  const settings = await db.setting.findMany({
    where: {
      key: { in: Array.isArray(keys) ? keys : [keys] },
      scope,
      projectId:
        ids && scope === SETTING_SCOPE.PROJECT
          ? { in: Array.isArray(ids) ? ids : [ids] }
          : undefined,
      userId:
        ids && scope === SETTING_SCOPE.USER
          ? { in: Array.isArray(ids) ? ids : [ids] }
          : undefined,
    },
  });
  return settings.reduce(
    (acc, curr) => {
      acc[curr.key] = JSON.parse(curr.value);
      return acc;
    },
    {} as Record<string, string>,
  );
}
