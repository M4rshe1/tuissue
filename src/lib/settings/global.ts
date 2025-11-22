interface GlobalSetting {
  key: string;
  defaultValue: string | null;
}

export const GLOBAL_SETTINGS: Record<string, GlobalSetting> = {
  ALLOW_SIGNUP: {
    key: "ALLOW_SIGNUP",
    defaultValue: "true",
  },
  DEFAULT_ISSUE_STATE: {
    key: "DEFAULT_ISSUE_STATE",
    defaultValue: "OPEN",
  },
  ENABLE_EMAIL_VERIFICATION: {
    key: "ENABLE_EMAIL_VERIFICATION",
    defaultValue: "false",
  },
  ENABLE_PASSWORD_RESET: {
    key: "ENABLE_PASSWORD_RESET",
    defaultValue: "true",
  },
  ENABLE_SMTP: {
    key: "ENABLE_SMTP",
    defaultValue: "false",
  },
  SMTP_HOST: {
    key: "SMTP_HOST",
    defaultValue: null,
  },
  SMTP_PORT: {
    key: "SMTP_PORT",
    defaultValue: null,
  },
  SMTP_SENDER_EMAIL: {
    key: "SMTP_SENDER_EMAIL",
    defaultValue: null,
  },
  SMTP_SENDER_NAME: {
    key: "SMTP_SENDER_NAME",
    defaultValue: null,
  },
  SMTP_PASSWORD: {
    key: "SMTP_PASSWORD",
    defaultValue: null,
  },
};
