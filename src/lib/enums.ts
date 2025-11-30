import { OPERATORS as OPERATORS_OBJECT, type Operator } from "./operators";
export const PROJECT_VISIBILITY = {
  PUBLIC: "PUBLIC", // visible to everyone logged in or not, logged in users can create issues, comment but only edit issues they created
  SEMI_PUBLIC: "SEMI_PUBLIC", // visible to logged in users, users can create issues, comment but only edit issues they created
  SEMI_PROTECTED: "SEMI_PROTECTED", // visible to everyone, but only members can create issues, comment and edit issues
  PROTECTED: "PROTECTED", // visible to logged in users, but only members can create issues, comment and edit issues
  PRIVATE: "PRIVATE", // only visible to members of the project, users can create issues, comment but only edit issues they created
} as const;

export const USER_PROJECT_ROLE = {
  OWNER: "OWNER", // can do everything
  ADMIN: "ADMIN", // can do everything except delete the project
  QA: "QA", // can see, edit and create issues
  CONTRIBUTOR: "CONTRIBUTOR", // can see, edit and create issues
  VIEWER: "VIEWER", // can see issues and comments
  REPORTER: "REPORTER", // can see and create issues but not edit there own issues
} as const;

export const SETTING_SCOPE = {
  GLOBAL: "GLOBAL",
  PROJECT: "PROJECT",
  USER: "USER",
} as const;

export const USER_ISSUE_ROLE = {
  CREATOR: "CREATOR", // created the issue
  ASSIGNEE: "ASSIGNEE", // responsible for the issue
  REVIEWER: "REVIEWER", // responsible for the review of the issue
  WATCHER: "WATCHER", // responsible for the watching of the issue
} as const;

export const ATTACHMENT_TYPE = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
  DOCUMENT: "DOCUMENT",
  OTHER: "OTHER",
  TEXT: "TEXT",
} as const;

export const CUSTOM_FIELD_TYPE = {
  TEXT: "TEXT",
  TEXT_AREA: "TEXT_AREA",
  NUMBER: "NUMBER",
  DATE: "DATE",
  BOOLEAN: "BOOLEAN",
  LINK: "LINK",
  USER: "USER",
  USER_LIST: "USER_LIST",
  SELECT: "SELECT",
  MULTI_SELECT: "MULTI_SELECT",
  FILE: "FILE",
  STATE: "STATE",
  CALCULATED: "CALCULATED",
  DATE_TIME: "DATE_TIME",
  TIME: "TIME",
} as const;

export const OPERATORS = Object.values(OPERATORS_OBJECT).reduce(
  (acc: Record<string, string>, operator: Operator) => {
    acc[operator.value] = operator.value;
    return acc;
  },
  {} as Record<string, string>,
);

export const CUSTOM_FIELD_DEPENDENCY_OPERATOR = {
  AND: "AND",
  OR: "OR",
} as const;

export const ISSUE_AUDIT_ACTION = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
} as const;