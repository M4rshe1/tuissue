-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "deletedAt" TIMESTAMP(3),
    "role" TEXT,
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "inheritCustomFields" BOOLEAN NOT NULL DEFAULT false,
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterField" (
    "id" TEXT NOT NULL,
    "filterId" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "customFieldId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilterField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_tag" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issue_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_dependency" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "dependencyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issue_dependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "issueId" TEXT NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachment" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'IMAGE',
    "mimeType" TEXT,
    "userId" TEXT,
    "issueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "projectId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_field" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "label" TEXT NOT NULL,
    "placeholder" TEXT,
    "tableShow" BOOLEAN NOT NULL DEFAULT true,
    "defaultValue" TEXT,
    "isObsolete" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "dependencyOperator" TEXT DEFAULT 'AND',
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_field_value" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "customFieldId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_field_value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_field_dependency" (
    "id" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "customFieldId" TEXT NOT NULL,
    "customFieldDependencyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_field_dependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_field_option" (
    "id" TEXT NOT NULL,
    "value" TEXT,
    "userId" TEXT,
    "customFieldId" TEXT NOT NULL,
    "isIssueClosing" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_field_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watcher_issue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "watcher_issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_audit" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issue_audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_deletedAt_idx" ON "user"("deletedAt");

-- CreateIndex
CREATE INDEX "user_email_deletedAt_idx" ON "user"("email", "deletedAt");

-- CreateIndex
CREATE INDEX "user_banned_banExpires_idx" ON "user"("banned", "banExpires");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_expiresAt_idx" ON "session"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "session_expiresAt_idx" ON "session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_providerId_idx" ON "account"("userId", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");

-- CreateIndex
CREATE INDEX "verification_identifier_value_idx" ON "verification"("identifier", "value");

-- CreateIndex
CREATE INDEX "verification_expiresAt_idx" ON "verification"("expiresAt");

-- CreateIndex
CREATE INDEX "project_visibility_createdAt_idx" ON "project"("visibility", "createdAt");

-- CreateIndex
CREATE INDEX "project_name_idx" ON "project"("name");

-- CreateIndex
CREATE INDEX "project_createdAt_idx" ON "project"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE INDEX "issue_tag_issueId_idx" ON "issue_tag"("issueId");

-- CreateIndex
CREATE INDEX "issue_tag_tagId_idx" ON "issue_tag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "issue_tag_issueId_tagId_key" ON "issue_tag"("issueId", "tagId");

-- CreateIndex
CREATE INDEX "issue_projectId_createdAt_idx" ON "issue"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "issue_createdAt_idx" ON "issue"("createdAt");

-- CreateIndex
CREATE INDEX "issue_updatedAt_idx" ON "issue"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "issue_projectId_number_key" ON "issue"("projectId", "number");

-- CreateIndex
CREATE INDEX "issue_dependency_issueId_idx" ON "issue_dependency"("issueId");

-- CreateIndex
CREATE INDEX "issue_dependency_dependencyId_idx" ON "issue_dependency"("dependencyId");

-- CreateIndex
CREATE UNIQUE INDEX "issue_dependency_issueId_dependencyId_key" ON "issue_dependency"("issueId", "dependencyId");

-- CreateIndex
CREATE INDEX "comment_issueId_createdAt_idx" ON "comment"("issueId", "createdAt");

-- CreateIndex
CREATE INDEX "comment_userId_idx" ON "comment"("userId");

-- CreateIndex
CREATE INDEX "attachment_issueId_type_idx" ON "attachment"("issueId", "type");

-- CreateIndex
CREATE INDEX "attachment_userId_idx" ON "attachment"("userId");

-- CreateIndex
CREATE INDEX "attachment_createdAt_idx" ON "attachment"("createdAt");

-- CreateIndex
CREATE INDEX "setting_scope_key_idx" ON "setting"("scope", "key");

-- CreateIndex
CREATE INDEX "setting_projectId_key_idx" ON "setting"("projectId", "key");

-- CreateIndex
CREATE INDEX "setting_userId_key_idx" ON "setting"("userId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "setting_scope_key_projectId_userId_key" ON "setting"("scope", "key", "projectId", "userId");

-- CreateIndex
CREATE INDEX "custom_field_projectId_isObsolete_order_idx" ON "custom_field"("projectId", "isObsolete", "order");

-- CreateIndex
CREATE INDEX "custom_field_projectId_idx" ON "custom_field"("projectId");

-- CreateIndex
CREATE INDEX "custom_field_value_issueId_idx" ON "custom_field_value"("issueId");

-- CreateIndex
CREATE INDEX "custom_field_value_customFieldId_value_idx" ON "custom_field_value"("customFieldId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "custom_field_value_issueId_customFieldId_key" ON "custom_field_value"("issueId", "customFieldId");

-- CreateIndex
CREATE INDEX "custom_field_dependency_customFieldId_idx" ON "custom_field_dependency"("customFieldId");

-- CreateIndex
CREATE INDEX "custom_field_dependency_customFieldDependencyId_idx" ON "custom_field_dependency"("customFieldDependencyId");

-- CreateIndex
CREATE UNIQUE INDEX "custom_field_dependency_customFieldId_customFieldDependency_key" ON "custom_field_dependency"("customFieldId", "customFieldDependencyId", "condition", "value");

-- CreateIndex
CREATE UNIQUE INDEX "custom_field_option_customFieldId_value_key" ON "custom_field_option"("customFieldId", "value");

-- CreateIndex
CREATE INDEX "user_project_userId_idx" ON "user_project"("userId");

-- CreateIndex
CREATE INDEX "user_project_projectId_role_idx" ON "user_project"("projectId", "role");

-- CreateIndex
CREATE INDEX "user_project_projectId_idx" ON "user_project"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "user_project_userId_projectId_key" ON "user_project"("userId", "projectId");

-- CreateIndex
CREATE INDEX "watcher_issue_userId_idx" ON "watcher_issue"("userId");

-- CreateIndex
CREATE INDEX "watcher_issue_issueId_idx" ON "watcher_issue"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "watcher_issue_userId_issueId_key" ON "watcher_issue"("userId", "issueId");

-- CreateIndex
CREATE INDEX "issue_audit_issueId_createdAt_idx" ON "issue_audit"("issueId", "createdAt");

-- CreateIndex
CREATE INDEX "issue_audit_userId_createdAt_idx" ON "issue_audit"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "issue_audit_action_createdAt_idx" ON "issue_audit"("action", "createdAt");

-- CreateIndex
CREATE INDEX "issue_audit_issueId_action_idx" ON "issue_audit"("issueId", "action");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterField" ADD CONSTRAINT "FilterField_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "Filter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterField" ADD CONSTRAINT "FilterField_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "custom_field"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_tag" ADD CONSTRAINT "issue_tag_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_tag" ADD CONSTRAINT "issue_tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_dependency" ADD CONSTRAINT "issue_dependency_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_dependency" ADD CONSTRAINT "issue_dependency_dependencyId_fkey" FOREIGN KEY ("dependencyId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting" ADD CONSTRAINT "setting_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting" ADD CONSTRAINT "setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field" ADD CONSTRAINT "custom_field_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_value" ADD CONSTRAINT "custom_field_value_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_value" ADD CONSTRAINT "custom_field_value_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "custom_field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_dependency" ADD CONSTRAINT "custom_field_dependency_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "custom_field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_dependency" ADD CONSTRAINT "custom_field_dependency_customFieldDependencyId_fkey" FOREIGN KEY ("customFieldDependencyId") REFERENCES "custom_field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_option" ADD CONSTRAINT "custom_field_option_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_option" ADD CONSTRAINT "custom_field_option_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "custom_field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_project" ADD CONSTRAINT "user_project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_project" ADD CONSTRAINT "user_project_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watcher_issue" ADD CONSTRAINT "watcher_issue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watcher_issue" ADD CONSTRAINT "watcher_issue_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_audit" ADD CONSTRAINT "issue_audit_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_audit" ADD CONSTRAINT "issue_audit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
