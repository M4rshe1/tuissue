import { SETTING_SCOPE } from "@/lib/enums";
import { GLOBAL_SETTINGS } from "@/lib/settings/global";
import { db } from "@/server/db";
import { format } from "date-fns";

async function createDefaultIssueStates() {
  await db.issueState.createMany({
    data: [
      { name: "OPEN", color: "#FF0000", projectId: null, isClosing: false },
      {
        name: "IN PROGRESS",
        color: "#FFFF00",
        projectId: null,
        isClosing: false,
      },
      {
        name: "IN REVIEW",
        color: "#0000FF",
        projectId: null,
        isClosing: false,
      },
      {
        name: "RESOLVED - FIXED",
        color: "#00FF00",
        projectId: null,
        isClosing: true,
      },
      {
        name: "RESOLVED - WONT FIX",
        color: "#00FF00",
        projectId: null,
        isClosing: true,
      },
      {
        name: "RESOLVED - WORKS FOR ME",
        color: "#00FF00",
        projectId: null,
        isClosing: true,
      },
      {
        name: "DUPLICATE",
        color: "#FF0000",
        projectId: null,
        isClosing: true,
      },
    ],
  });
}

async function createCustomFields() {
  await db.customField.create({
    data: {
      label: "Priority",
      type: "SELECT",
      projectId: null,
      scope: "GLOBAL",
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
      type: "SELECT",
      projectId: null,
      scope: "GLOBAL",
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
      type: "SELECT",
      projectId: null,
      scope: "GLOBAL",
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
      type: "DATE",
      projectId: null,
      scope: "GLOBAL",
      required: true,
      defaultValue: format(new Date(), "yyyy-MM-dd"),
    },
  });
  await db.customField.create({
    data: {
      label: "Type",
      type: "SELECT",
      projectId: null,
      scope: "GLOBAL",
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
      type: "SELECT",
      projectId: null,
      scope: "GLOBAL",
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
      type: "DATE",
      projectId: null,
      scope: "GLOBAL",
      required: true,
      defaultValue: format(new Date(), "yyyy-MM-dd"),
    },
  });
  await db.customField.create({
    data: {
      label: "Fixed in Version",
      type: "DATE",
      projectId: null,
      scope: "GLOBAL",
      required: true,
      defaultValue: format(new Date(), "yyyy-MM-dd"),
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
          value: setting.defaultValue ?? "",
          scope: SETTING_SCOPE.GLOBAL,
        })),
    ],
  });
}

async function main() {
  await createDefaultIssueStates();
  await createCustomFields();
  await createSettings();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
