/*
  Warnings:

  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `custom_field` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `custom_field_dependency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `custom_field_option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `custom_field_value` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `issue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `issue_audit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `issue_dependency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `issue_tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `setting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `watcher_issue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Filter" DROP CONSTRAINT "Filter_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Filter" DROP CONSTRAINT "Filter_userId_fkey";

-- DropForeignKey
ALTER TABLE "FilterField" DROP CONSTRAINT "FilterField_customFieldId_fkey";

-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "attachment" DROP CONSTRAINT "attachment_issueId_fkey";

-- DropForeignKey
ALTER TABLE "attachment" DROP CONSTRAINT "attachment_userId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_issueId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "custom_field" DROP CONSTRAINT "custom_field_projectId_fkey";

-- DropForeignKey
ALTER TABLE "custom_field_dependency" DROP CONSTRAINT "custom_field_dependency_customFieldDependencyId_fkey";

-- DropForeignKey
ALTER TABLE "custom_field_dependency" DROP CONSTRAINT "custom_field_dependency_customFieldId_fkey";

-- DropForeignKey
ALTER TABLE "custom_field_option" DROP CONSTRAINT "custom_field_option_customFieldId_fkey";

-- DropForeignKey
ALTER TABLE "custom_field_option" DROP CONSTRAINT "custom_field_option_userId_fkey";

-- DropForeignKey
ALTER TABLE "custom_field_value" DROP CONSTRAINT "custom_field_value_customFieldId_fkey";

-- DropForeignKey
ALTER TABLE "custom_field_value" DROP CONSTRAINT "custom_field_value_issueId_fkey";

-- DropForeignKey
ALTER TABLE "issue" DROP CONSTRAINT "issue_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "issue" DROP CONSTRAINT "issue_projectId_fkey";

-- DropForeignKey
ALTER TABLE "issue_audit" DROP CONSTRAINT "issue_audit_issueId_fkey";

-- DropForeignKey
ALTER TABLE "issue_audit" DROP CONSTRAINT "issue_audit_userId_fkey";

-- DropForeignKey
ALTER TABLE "issue_dependency" DROP CONSTRAINT "issue_dependency_dependencyId_fkey";

-- DropForeignKey
ALTER TABLE "issue_dependency" DROP CONSTRAINT "issue_dependency_issueId_fkey";

-- DropForeignKey
ALTER TABLE "issue_tag" DROP CONSTRAINT "issue_tag_issueId_fkey";

-- DropForeignKey
ALTER TABLE "issue_tag" DROP CONSTRAINT "issue_tag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropForeignKey
ALTER TABLE "setting" DROP CONSTRAINT "setting_projectId_fkey";

-- DropForeignKey
ALTER TABLE "setting" DROP CONSTRAINT "setting_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_project" DROP CONSTRAINT "user_project_projectId_fkey";

-- DropForeignKey
ALTER TABLE "user_project" DROP CONSTRAINT "user_project_userId_fkey";

-- DropForeignKey
ALTER TABLE "watcher_issue" DROP CONSTRAINT "watcher_issue_issueId_fkey";

-- DropForeignKey
ALTER TABLE "watcher_issue" DROP CONSTRAINT "watcher_issue_userId_fkey";

-- DropTable
DROP TABLE "account";

-- DropTable
DROP TABLE "attachment";

-- DropTable
DROP TABLE "comment";

-- DropTable
DROP TABLE "custom_field";

-- DropTable
DROP TABLE "custom_field_dependency";

-- DropTable
DROP TABLE "custom_field_option";

-- DropTable
DROP TABLE "custom_field_value";

-- DropTable
DROP TABLE "issue";

-- DropTable
DROP TABLE "issue_audit";

-- DropTable
DROP TABLE "issue_dependency";

-- DropTable
DROP TABLE "issue_tag";

-- DropTable
DROP TABLE "project";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "setting";

-- DropTable
DROP TABLE "tag";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "user_project";

-- DropTable
DROP TABLE "verification";

-- DropTable
DROP TABLE "watcher_issue";

-- CreateTable
CREATE TABLE "User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
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

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "inheritCustomFields" BOOLEAN NOT NULL DEFAULT false,
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueTag" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueDependency" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "dependencyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "issueId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
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

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "projectId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomField" (
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

    CONSTRAINT "CustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFieldValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "customFieldId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFieldDependency" (
    "id" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "customFieldId" TEXT NOT NULL,
    "customFieldDependencyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomFieldDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFieldOption" (
    "id" TEXT NOT NULL,
    "value" TEXT,
    "userId" TEXT,
    "customFieldId" TEXT NOT NULL,
    "isIssueClosing" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomFieldOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProject" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatcherIssue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatcherIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueAudit" (
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

    CONSTRAINT "IssueAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "User_email_deletedAt_idx" ON "User"("email", "deletedAt");

-- CreateIndex
CREATE INDEX "User_banned_banExpires_idx" ON "User"("banned", "banExpires");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Account_userId_providerId_idx" ON "Account"("userId", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerId_accountId_key" ON "Account"("providerId", "accountId");

-- CreateIndex
CREATE INDEX "Verification_identifier_value_idx" ON "Verification"("identifier", "value");

-- CreateIndex
CREATE INDEX "Verification_expiresAt_idx" ON "Verification"("expiresAt");

-- CreateIndex
CREATE INDEX "Project_visibility_createdAt_idx" ON "Project"("visibility", "createdAt");

-- CreateIndex
CREATE INDEX "Project_name_idx" ON "Project"("name");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "IssueTag_issueId_idx" ON "IssueTag"("issueId");

-- CreateIndex
CREATE INDEX "IssueTag_tagId_idx" ON "IssueTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "IssueTag_issueId_tagId_key" ON "IssueTag"("issueId", "tagId");

-- CreateIndex
CREATE INDEX "Issue_projectId_createdAt_idx" ON "Issue"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "Issue_createdAt_idx" ON "Issue"("createdAt");

-- CreateIndex
CREATE INDEX "Issue_updatedAt_idx" ON "Issue"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_projectId_number_key" ON "Issue"("projectId", "number");

-- CreateIndex
CREATE INDEX "IssueDependency_issueId_idx" ON "IssueDependency"("issueId");

-- CreateIndex
CREATE INDEX "IssueDependency_dependencyId_idx" ON "IssueDependency"("dependencyId");

-- CreateIndex
CREATE UNIQUE INDEX "IssueDependency_issueId_dependencyId_key" ON "IssueDependency"("issueId", "dependencyId");

-- CreateIndex
CREATE INDEX "Comment_issueId_createdAt_idx" ON "Comment"("issueId", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Attachment_issueId_type_idx" ON "Attachment"("issueId", "type");

-- CreateIndex
CREATE INDEX "Attachment_userId_idx" ON "Attachment"("userId");

-- CreateIndex
CREATE INDEX "Attachment_createdAt_idx" ON "Attachment"("createdAt");

-- CreateIndex
CREATE INDEX "Setting_scope_key_idx" ON "Setting"("scope", "key");

-- CreateIndex
CREATE INDEX "Setting_projectId_key_idx" ON "Setting"("projectId", "key");

-- CreateIndex
CREATE INDEX "Setting_userId_key_idx" ON "Setting"("userId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_scope_key_projectId_userId_key" ON "Setting"("scope", "key", "projectId", "userId");

-- CreateIndex
CREATE INDEX "CustomField_projectId_isObsolete_order_idx" ON "CustomField"("projectId", "isObsolete", "order");

-- CreateIndex
CREATE INDEX "CustomField_projectId_idx" ON "CustomField"("projectId");

-- CreateIndex
CREATE INDEX "CustomFieldValue_issueId_idx" ON "CustomFieldValue"("issueId");

-- CreateIndex
CREATE INDEX "CustomFieldValue_customFieldId_value_idx" ON "CustomFieldValue"("customFieldId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldValue_issueId_customFieldId_key" ON "CustomFieldValue"("issueId", "customFieldId");

-- CreateIndex
CREATE INDEX "CustomFieldDependency_customFieldId_idx" ON "CustomFieldDependency"("customFieldId");

-- CreateIndex
CREATE INDEX "CustomFieldDependency_customFieldDependencyId_idx" ON "CustomFieldDependency"("customFieldDependencyId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldDependency_customFieldId_customFieldDependencyId_key" ON "CustomFieldDependency"("customFieldId", "customFieldDependencyId", "condition", "value");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldOption_customFieldId_value_key" ON "CustomFieldOption"("customFieldId", "value");

-- CreateIndex
CREATE INDEX "UserProject_userId_idx" ON "UserProject"("userId");

-- CreateIndex
CREATE INDEX "UserProject_projectId_role_idx" ON "UserProject"("projectId", "role");

-- CreateIndex
CREATE INDEX "UserProject_projectId_idx" ON "UserProject"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProject_userId_projectId_key" ON "UserProject"("userId", "projectId");

-- CreateIndex
CREATE INDEX "WatcherIssue_userId_idx" ON "WatcherIssue"("userId");

-- CreateIndex
CREATE INDEX "WatcherIssue_issueId_idx" ON "WatcherIssue"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "WatcherIssue_userId_issueId_key" ON "WatcherIssue"("userId", "issueId");

-- CreateIndex
CREATE INDEX "IssueAudit_issueId_createdAt_idx" ON "IssueAudit"("issueId", "createdAt");

-- CreateIndex
CREATE INDEX "IssueAudit_userId_createdAt_idx" ON "IssueAudit"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "IssueAudit_action_createdAt_idx" ON "IssueAudit"("action", "createdAt");

-- CreateIndex
CREATE INDEX "IssueAudit_issueId_action_idx" ON "IssueAudit"("issueId", "action");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterField" ADD CONSTRAINT "FilterField_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "CustomField"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueTag" ADD CONSTRAINT "IssueTag_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueTag" ADD CONSTRAINT "IssueTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueDependency" ADD CONSTRAINT "IssueDependency_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueDependency" ADD CONSTRAINT "IssueDependency_dependencyId_fkey" FOREIGN KEY ("dependencyId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomField" ADD CONSTRAINT "CustomField_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldValue" ADD CONSTRAINT "CustomFieldValue_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldValue" ADD CONSTRAINT "CustomFieldValue_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "CustomField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldDependency" ADD CONSTRAINT "CustomFieldDependency_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "CustomField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldDependency" ADD CONSTRAINT "CustomFieldDependency_customFieldDependencyId_fkey" FOREIGN KEY ("customFieldDependencyId") REFERENCES "CustomField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldOption" ADD CONSTRAINT "CustomFieldOption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldOption" ADD CONSTRAINT "CustomFieldOption_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "CustomField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatcherIssue" ADD CONSTRAINT "WatcherIssue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatcherIssue" ADD CONSTRAINT "WatcherIssue_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueAudit" ADD CONSTRAINT "IssueAudit_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueAudit" ADD CONSTRAINT "IssueAudit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
