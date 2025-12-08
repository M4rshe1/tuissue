export const PERMISSIONS = {
  PROJECT: {
    DELETE: {
      OWNER: true,
      ADMIN: false,
      QA: false,
      CONTRIBUTOR: true,
      VIEWER: false,
      REPORTER: false,
    },
    EDIT: {
      OWNER: true,
      ADMIN: true,
      QA: false,
      CONTRIBUTOR: false,
      VIEWER: false,
      REPORTER: false,
    },
  },
  ISSUE: {
    DELETE: {
      _CREATOR: true,
      OWNER: true,
      ADMIN: false,
      QA: false,
      CONTRIBUTOR: true,
      VIEWER: false,
      REPORTER: false,
    },
    EDIT: {
      _CREATOR: true,
      OWNER: true,
      ADMIN: true,
      QA: true,
      CONTRIBUTOR: true,
      VIEWER: false,
      REPORTER: false,
    },
    COMMENT: {
      _CREATOR: true,
      OWNER: true,
      ADMIN: true,
      QA: true,
      CONTRIBUTOR: true,
      VIEWER: false,
      REPORTER: true,
    },
  },
  CUSTOM_FIELD: {
    DELETE: {
      OWNER: true,
      ADMIN: true,
      QA: false,
      CONTRIBUTOR: false,
      VIEWER: false,
      REPORTER: false,
    },
    EDIT: {
      OWNER: true,
      ADMIN: true,
      QA: false,
      CONTRIBUTOR: false,
      VIEWER: false,
      REPORTER: false,
    },
  },
};

export const getPermission = (
  permission: keyof typeof PERMISSIONS,
  action: keyof (typeof PERMISSIONS)[typeof permission],
  role: string,
) => {
  return PERMISSIONS[permission][
    action as keyof (typeof PERMISSIONS)[typeof permission]
  ][role as keyof (typeof PERMISSIONS)[typeof permission][typeof action]];
};
