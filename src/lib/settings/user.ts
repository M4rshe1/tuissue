interface UserSetting {
  key: string;
  defaultValue: string;
}

export const USER_SETTINGS: Record<string, UserSetting> = {};
