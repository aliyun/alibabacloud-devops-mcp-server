import { z } from "zod";

// Organization Role related types
export const OrganizationRoleSchema = z.object({
  id: z.string().describe("Role ID"),
  name: z.string().describe("Role name"),
  organizationId: z.string().describe("Organization ID"),
  permissions: z.array(z.string()).describe("Role permission list")
});

export const OrganizationRole = z.array(OrganizationRoleSchema);
export const ListOrganizationRolesSchema = z.object({
  organizationId: z.string().describe("Organization ID")
});

export const GetOrganizationRoleSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  roleId: z.string().describe("Role ID")
});

// Organization Department related types
export const GetOrganizationDepartmentAncestorsSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  id: z.string().describe("Department ID"),
});

export const GetOrganizationDepartmentInfoSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  id: z.string().describe("Department ID"),
});

export const GetOrganizationDepartmentsSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  parentId: z.string().optional().describe("Parent department ID"),
});

// Organization related types
export const CurrentOrganizationInfoSchema = z.object({
  lastOrganization: z.string().optional().describe("Organization ID of the most recent login, used for subsequent API calls, should be used as organizationId"),
  userId: z.string().optional().describe("Current user ID, not the organization ID"),
  userName: z.string().optional().describe("Current user name"),
});

export const OrganizationInfoSchema = z.object({
  id: z.string().optional().describe("Organization ID"),
  name: z.string().optional().describe("Organization name"),
  description: z.string().optional().describe("Organization description"),
});

export const UserOrganizationsInfoSchema = z.array(OrganizationInfoSchema);

// User related types
export const UserInfoSchema = z.object({
  id: z.string().nullable().optional().describe("User ID"),
  name: z.string().nullable().optional().describe("User name"),
});

// Current user information schema
export const CurrentUserSchema = z.object({
  id: z.string().nullable().optional().describe("User ID"),
  name: z.string().optional().describe("Display name"),
  email: z.string().optional().describe("Email address"),
  username: z.string().optional().describe("Login account name"),
  lastOrganization: z.string().optional().describe("Last login organization ID"),
  staffId: z.string().optional().describe("Staff ID"),
  nickName: z.string().optional().describe("Nickname"),
  sysDeptIds: z.array(z.string()).optional().describe("Department IDs"),
  createdAt: z.string().optional().describe("Creation time (ISO 8601格式)"),
  deletedAt: z.string().optional().describe("Deletion time (ISO 8601格式)")
});

// Organization Department related types
export const DepartmentInfoSchema = z.object({
  creatorId: z.string().optional().describe("创建人 ID"),
  id: z.string().optional().describe("部门 ID"),
  name: z.string().optional().describe("部门名称"),
  organizationId: z.string().optional().describe("组织 ID"),
  parentId: z.string().optional().describe("父部门 ID"),
  hasSub: z.boolean().optional().describe("是否有子部门")
});

export const OrganizationDepartmentsSchema = z.array(DepartmentInfoSchema);

export type DepartmentInfo = z.infer<typeof DepartmentInfoSchema>;

// Organization Member related types
export const MemberInfoSchema = z.object({
  deptIds: z.array(z.string()).optional().describe("所属组织部门列表"),
  id: z.string().optional().describe("成员 ID"),
  joined: z.string().optional().describe("加入时间 (ISO 8601格式)"),
  name: z.string().optional().describe("成员名"),
  organizationId: z.string().optional().describe("组织 ID"),
  roleIds: z.array(z.string()).optional().describe("角色信息"),
  status: z.string().optional().describe("成员状态，可选值：ENABLED,DISABLED,UNDELETED,DELETED,NORMAL_USING,UNVISITED"),
  userId: z.string().optional().describe("用户 ID"),
  visited: z.string().optional().describe("最后访问时间 (ISO 8601格式)"),
});

export const OrganizationMembersSchema = z.array(MemberInfoSchema);
export type OrganizationMembers = z.infer<typeof OrganizationMembersSchema>;

// Organization Member detail types
export const GetOrganizationMemberInfoSchema = z.object({
  organizationId: z.string().describe("组织 ID"),
  memberId: z.string().describe("成员 ID"),
});

export type GetOrganizationMemberInfo = z.infer<typeof MemberInfoSchema>;

// Get organization member by user ID types
export const GetOrganizationMemberByUserIdInfoSchema = z.object({
  organizationId: z.string().describe("组织 ID"),
  userId: z.string().describe("用户 ID"),
});

export type GetOrganizationMemberByUserIdInfo = z.infer<typeof GetOrganizationMemberByUserIdInfoSchema>;

// Search organization members types
export const SearchOrganizationMembersSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  deptIds: z.array(z.string()).optional().describe("Department IDs to search for"),
  query: z.string().optional().describe("Search query"),
  includeChildren: z.boolean().optional().describe("Whether to include sub-departments"),
  nextToken: z.string().optional().describe("Next token for pagination"),
  roleIds: z.array(z.string()).optional().describe("Role IDs to search for"),
  statuses: z.array(z.string()).optional().describe("User statuses, posibble values: ENABLED,DISABLED,UNDELETED,DELETED,NORMAL_USING,UNVISITED。ENABLED=NORMAL_USING+UNVISITED;UNDELETED=ENABLED+DISABLED"),
  page: z.number().int().optional().describe("Current page number, defaults to 1"),
  perPage: z.number().int().optional().describe("Number of items per page, defaults to 100")
});

export const SearchOrganizationMembersResultSchema = z.array(MemberInfoSchema);

export type SearchOrganizationMembersParams = z.infer<typeof SearchOrganizationMembersSchema>;
export type SearchOrganizationMembersResult = z.infer<typeof SearchOrganizationMembersResultSchema>;

// Get organization members schema
export const GetOrganizationMembersSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  page: z.number().int().optional().describe("Page number"),
  perPage: z.number().int().optional().describe("Page size"),
});