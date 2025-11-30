"use server";

import { actionOptionalAuth } from "@/lib/hoc-actions";
import { GLOBAL_SETTINGS } from "@/lib/settings/global";
import { db } from "@/server/db";
import z from "zod";

export const getGlobalSettingAction = await actionOptionalAuth(
  z.object({
    key: z.string(),
  }),
  async ({ data, session }) => {
    const isSensitive = GLOBAL_SETTINGS?.[data.key]?.sensitive;
    if ((isSensitive && !session) || session?.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const settingType = GLOBAL_SETTINGS?.[data.key]?.type;
    if (!settingType) {
      throw new Error("Setting not found");
    }

    const setting = await db.setting.findFirst({
      where: { key: data.key, scope: "GLOBAL" },
    });
    if (!setting?.value) {
      return GLOBAL_SETTINGS?.[data.key]?.defaultValue;
    }
    return JSON.parse(setting.value);
  },
);

export const getGlobalSettingsAction = await actionOptionalAuth(
  z.object({
    keys: z.array(z.string()),
  }),
  async ({ data, session }) => {
    const allowedKeys: string[] = [];
    data.keys.forEach((key) => {
      const isSensitive = GLOBAL_SETTINGS?.[key]?.sensitive;
      const settingType = GLOBAL_SETTINGS?.[key]?.type;
      if (!settingType) {
        throw new Error("Setting not found");
      }
      if (!isSensitive || (session && session?.user.role === "admin")) {
        allowedKeys.push(key);
      }
    });
    const settings = await db.setting.findMany({
      where: { key: { in: allowedKeys }, scope: "GLOBAL" },
    });
    return settings
      .map((setting) => {
        const settingType = GLOBAL_SETTINGS?.[setting.key]?.type;
        return JSON.parse(setting.value);
      })
      .reduce((acc, curr) => {
        acc[curr.key] = curr;
        return acc;
      }, {});
  },
);
