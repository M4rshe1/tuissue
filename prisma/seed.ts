import { CUSTOM_FIELD_TYPE, SETTING_SCOPE } from "@/lib/enums";
import { GLOBAL_SETTINGS } from "@/lib/settings/global";
import { db } from "@/server/db";
import { format } from "date-fns";

async function createCustomFields() {
  await db.customField.create({
    data: {
      label: "State",
      type: CUSTOM_FIELD_TYPE.STATE,
      projectId: null,
      required: true,
      defaultShow: true,
      defaultValue: "OPEN",
      customFieldOptions: {
        create: [
          { value: "OPEN", color: "#FF0000", isIssueClosing: false },
          { value: "IN PROGRESS", color: "#FFFF00", isIssueClosing: false },
          { value: "IN REVIEW", color: "#0000FF", isIssueClosing: false },
          {
            value: "RESOLVED - FIXED",
            color: "#00FF00",
            isIssueClosing: true,
          },
          {
            value: "RESOLVED - WON'T FIX",
            color: "#00FF00",
            isIssueClosing: true,
          },
          {
            value: "RESOLVED - WORKS FOR ME",
            color: "#00FF00",
            isIssueClosing: true,
          },
          { value: "DUPLICATE", color: "#FF0000", isIssueClosing: true },
        ],
      },
    },
  });
  await db.customField.create({
    data: {
      label: "Priority",
      type: CUSTOM_FIELD_TYPE.SELECT,
      projectId: null,
      defaultShow: true,
      required: true,
      defaultValue: "1 - LOW",
      customFieldOptions: {
        create: [
          { value: "1 - Showstopper" },
          { value: "2 - Critical" },
          { value: "3 - Major" },
          { value: "4 - Normal" },
          { value: "5 - Trivial" },
        ],
      },
    },
  });
  await db.customField.create({
    data: {
      label: "Severity",
      type: CUSTOM_FIELD_TYPE.SELECT,
      projectId: null,
      defaultShow: true,
      required: true,
      defaultValue: "1 - LOW",
      customFieldOptions: {
        create: [
          { value: "1 - LOW" },
          { value: "2 - MEDIUM" },
          { value: "3 - HIGH" },
        ],
      },
    },
  });
  await db.customField.create({
    data: {
      label: "Component",
      type: CUSTOM_FIELD_TYPE.SELECT,
      projectId: null,
      required: true,
      defaultValue: "Component",
      customFieldOptions: {
        create: [
          { value: "Frontend" },
          { value: "Backend" },
          { value: "Database" },
          { value: "Infrastructure" },
          { value: "Documentation" },
          { value: "Other" },
        ],
      },
    },
  });
  await db.customField.create({
    data: {
      label: "Due Date",
      type: CUSTOM_FIELD_TYPE.DATE,
      projectId: null,
      required: true,
      defaultValue: format(new Date(), "yyyy-MM-dd"),
    },
  });
  await db.customField.create({
    data: {
      label: "Type",
      type: CUSTOM_FIELD_TYPE.SELECT,
      projectId: null,
      required: true,
      defaultValue: "BUG",
      customFieldOptions: {
        create: [{ value: "BUG" }, { value: "ENHANCEMENT" }, { value: "TASK" }],
      },
    },
  });
  await db.customField.create({
    data: {
      label: "Hardware",
      type: CUSTOM_FIELD_TYPE.SELECT,
      projectId: null,
      required: true,
      defaultValue: "LINUX",
      customFieldOptions: {
        create: [
          { value: "DXC" },
          { value: "CLIENT" },
          { value: "MDT" },
          { value: "OTHER" },
        ],
      },
    },
  });
  await db.customField.create({
    data: {
      label: "Version",
      type: CUSTOM_FIELD_TYPE.DATE,
      projectId: null,
      required: true,
      defaultValue: format(new Date(), "yyyy-MM-dd"),
    },
  });
  await db.customField.create({
    data: {
      label: "Fixed in Version",
      type: CUSTOM_FIELD_TYPE.DATE,
      projectId: null,
      required: true,
      defaultValue: format(new Date(), "yyyy-MM-dd"),
    },
  });
  await db.customField.create({
    data: {
      label: "Assignee",
      type: CUSTOM_FIELD_TYPE.USER,
      projectId: null,
      required: true,
      defaultValue: null,
    },
  });
}

async function createSettings() {
  await db.settings.createMany({
    data: [
      ...Object.values(GLOBAL_SETTINGS)
        .filter((setting) => setting.defaultValue !== null)
        .map((setting) => ({
          key: setting.key,
          value: JSON.stringify(setting.defaultValue),
          scope: SETTING_SCOPE.GLOBAL,
        })),
    ],
  });
}

async function main() {
  await createCustomFields();
  await createSettings();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
