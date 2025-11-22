interface ProjectSetting {
  key: string;
  defaultValue: string | null;
}

export const PROJECT_SETTINGS: Record<string, ProjectSetting> = {
  DEFAULT_ISSUE_STATE: {
    key: "DEFAULT_ISSUE_STATE",
    defaultValue: null,
  },
};
