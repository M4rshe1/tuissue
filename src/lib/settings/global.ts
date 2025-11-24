interface GlobalSettingBase {
  key: string;
}

interface GlobalSettingBoolean extends GlobalSettingBase {
  defaultValue: boolean;
  type: "boolean";
}

interface GlobalSettingString extends GlobalSettingBase {
  defaultValue: string;
  type: "string";
}

interface GlobalSettingEnum extends GlobalSettingBase {
  defaultValue: string;
  enum: string[];
  type: "enum";
}

interface GlobalSettingEnumList extends GlobalSettingBase {
  defaultValue: string[];
  enum: string[];
  type: "enum_list";
}

interface GlobalSettingList extends GlobalSettingBase {
  defaultValue: string[];
  type: "list";
}

type GlobalSetting =
  | GlobalSettingBoolean
  | GlobalSettingString
  | GlobalSettingEnum
  | GlobalSettingEnumList
  | GlobalSettingList;

export const GLOBAL_SETTINGS: Record<string, GlobalSetting> = {
  ALLOW_SIGNUP: {
    key: "ALLOW_SIGNUP",
    type: "boolean",
    defaultValue: true,
  },
  DEFAULT_ISSUE_STATE: {
    key: "DEFAULT_ISSUE_STATE",
    type: "string",
    defaultValue: "OPEN",
  },
  ENABLE_EMAIL_VERIFICATION: {
    key: "ENABLE_EMAIL_VERIFICATION",
    type: "boolean",
    defaultValue: false,
  },
  ENABLE_PASSWORD_RESET: {
    key: "ENABLE_PASSWORD_RESET",
    type: "boolean",
    defaultValue: true,
  },
  ENABLE_SMTP: {
    key: "ENABLE_SMTP",
    type: "boolean",
    defaultValue: false,
  },
  SMTP_HOST: {
    key: "SMTP_HOST",
    type: "string",
    defaultValue: "",
  },
  SMTP_PORT: {
    key: "SMTP_PORT",
    type: "string",
    defaultValue: "",
  },
  SMTP_SENDER_EMAIL: {
    key: "SMTP_SENDER_EMAIL",
    type: "string",
    defaultValue: "",
  },
  SMTP_SENDER_NAME: {
    key: "SMTP_SENDER_NAME",
    type: "string",
    defaultValue: "",
  },
  SMTP_PASSWORD: {
    key: "SMTP_PASSWORD",
    type: "string",
    defaultValue: "",
  },
  WHO_CAN_CREATE_PROJECTS: {
    key: "WHO_CAN_CREATE_PROJECTS",
    type: "enum",
    defaultValue: "EVERYONE",
    enum: ["EVERYONE", "ADMIN", "CUSTOM"],
  },
  CUSTOM_CREATE_PROJECT_USERS: {
    key: "CUSTOM_CREATE_PROJECT_USERS",
    type: "list",
    defaultValue: [],
  },
};
