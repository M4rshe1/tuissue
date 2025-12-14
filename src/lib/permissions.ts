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
    CREATE: {
      OWNER: true,
      ADMIN: true,
      QA: true,
      CONTRIBUTOR: true,
      VIEWER: false,
      REPORTER: true,
    },
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
    CREATE: {
      OWNER: true,
      ADMIN: true,
      QA: false,
      CONTRIBUTOR: false,
      VIEWER: false,
      REPORTER: false,
    },
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
  MEMBER: {
    ADD: {
      OWNER: true,
      ADMIN: true,
      QA: false,
      CONTRIBUTOR: false,
      VIEWER: false,
      REPORTER: false,
    },
    REMOVE: {
      OWNER: true,
      ADMIN: true,
      QA: false,
      CONTRIBUTOR: false,
      VIEWER: false,
      REPORTER: false,
    },
  },
} as const;

export const getPermission = <P extends keyof typeof PERMISSIONS>(
  permission: P,
  action: keyof (typeof PERMISSIONS)[P],
  role: string,
  creator?: boolean,
) => {
  const rolesObject =
    PERMISSIONS[permission][action as keyof (typeof PERMISSIONS)[P]];
  const rolePermission = rolesObject[role as keyof typeof rolesObject];
  if (creator) {
    return (
      rolesObject?.["_CREATOR" as keyof typeof rolesObject] ||
      false ||
      rolePermission
    );
  }
  return rolePermission;
};
