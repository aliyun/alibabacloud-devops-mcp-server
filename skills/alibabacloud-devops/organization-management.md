# Organization Management (organization-management)

Tools in this toolset: **9**

## Tools

- `get_organization_department_info` - Get information about a department in an organization
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `id` (string): Department ID


- `get_organization_department_ancestors` - Get the ancestors of a department in an organization
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `id` (string): Department ID


- `get_organization_member_info` - Get information about a member in an organization
    - **Required parameters**:
      - `organizationId` (string): 组织 ID
      - `memberId` (string): 成员 ID


- `get_organization_member_info_by_user_id` - Get information about a member in an organization by user ID
    - **Required parameters**:
      - `organizationId` (string): 组织 ID
      - `userId` (string): 用户 ID


- `get_organization_role` - [Organization Management] Get information about an organization role
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `roleId` (string): Role ID


- `list_organization_departments` - Get the list of departments in an organization
    - **Required parameters**:
      - `organizationId` (string): Organization ID
    - **Optional parameters**:
      - `parentId` (string): Parent department ID


- `list_organization_members` - list user members in an organization
    - **Required parameters**:
      - `organizationId` (string): Organization ID
    - **Optional parameters**:
      - `page` (integer): Page number
      - `perPage` (integer): Page size


- `list_organization_roles` - [Organization Management] List organization roles
    - **Required parameters**:
      - `organizationId` (string): Organization ID


- `search_organization_members` - [Organization Management] Search for organization members
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
    - **Optional parameters**:
      - `deptIds` (array): Department IDs to search for
      - `query` (string): Search query
      - `includeChildren` (boolean): Whether to include sub-departments
      - `nextToken` (string): Next token for pagination
      - `roleIds` (array): Role IDs to search for
      - `statuses` (array): User statuses, posibble values: ENABLED,DISABLED,UNDELETED,DELETED,NORMAL_USING,UNVISITED。ENABLED=NORMAL_USING+UNVISITED;UNDELETED=ENABLED+DISABLED
      - `page` (integer): Current page number, defaults to 1
      - `perPage` (integer): Number of items per page, defaults to 100
