interface GlobalSettingBase {
  key: string;
  sensitive?: boolean;
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

interface GlobalSettingUserList extends GlobalSettingBase {
  defaultValue: string[];
  type: "user_list";
}

type GlobalSetting =
  | GlobalSettingBoolean
  | GlobalSettingString
  | GlobalSettingEnum
  | GlobalSettingEnumList
  | GlobalSettingList
  | GlobalSettingUserList;

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
    sensitive: true,
  },
  SMTP_HOST: {
    key: "SMTP_HOST",
    type: "string",
    defaultValue: "",
    sensitive: true,
  },
  SMTP_PORT: {
    key: "SMTP_PORT",
    type: "string",
    defaultValue: "",
    sensitive: true,
  },
  SMTP_SENDER_EMAIL: {
    key: "SMTP_SENDER_EMAIL",
    type: "string",
    defaultValue: "",
    sensitive: true,
  },
  SMTP_SENDER_NAME: {
    key: "SMTP_SENDER_NAME",
    type: "string",
    defaultValue: "",
    sensitive: true,
  },
  SMTP_PASSWORD: {
    key: "SMTP_PASSWORD",
    type: "string",
    defaultValue: "",
    sensitive: true,
  },
  WHO_CAN_CREATE_PROJECTS: {
    key: "WHO_CAN_CREATE_PROJECTS",
    type: "enum",
    defaultValue: "EVERYONE",
    enum: ["EVERYONE", "ADMIN", "CUSTOM"],
  },
  CUSTOM_CREATE_PROJECT_USERS: {
    key: "CUSTOM_CREATE_PROJECT_USERS",
    type: "user_list",
    defaultValue: [],
  },
};
