# Code Management (code-management)

Tools in this toolset: **22**

## Tools

- `create_branch` - [Code Management] Create a new branch in a Codeup repository
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `repositoryId` (string): Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)
      - `branch` (string): Name of the branch to be created
    - **Optional parameters**:
      - `ref` (string): Source branch name, the new branch will be created based on this branch, default value is master


- `create_file` - [Code Management] Create a new file in a Codeup repository
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `repositoryId` (string): Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)
      - `filePath` (string): File path, needs to be URL encoded, for example: /src/main/java/com/aliyun/test.java
      - `content` (string): File content
      - `commitMessage` (string): Commit message, not empty, no more than 102400 characters
      - `branch` (string): Branch name
    - **Optional parameters**:
      - `encoding` (string): Encoding rule, options {text, base64}, default is text


- `create_change_request` - [Code Management] Create a new change request (merge request). Supports specifying source/target branches, reviewers, associated work items, and optional AI review trigger.
    - **Required parameters**:
      - `organizationId` (string): 组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'
      - `repositoryId` (string): 代码库ID或者URL-Encoder编码的全路径。示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）
      - `title` (string): 标题，不超过256个字符。示例：'mr title' 或 '修复登录bug'
      - `sourceBranch` (string): 源分支名称，即要合并的分支。示例：'demo-branch' 或 'feature/user-login'
      - `targetBranch` (string): 目标分支名称，即合并到的分支。示例：'master' 或 'main'
    - **Optional parameters**:
      - `description` (unknown): 描述，不超过10000个字符。示例：'mr description' 或 '修复了用户登录时的验证逻辑问题'
      - `sourceProjectId` (integer): 源库ID，如果未提供，将尝试自动获取。示例：2813489
      - `targetProjectId` (integer): 目标库ID，如果未提供，将尝试自动获取。示例：2813489
      - `reviewerUserIds` (unknown): 评审人用户ID列表。示例：['62c795xxxb468af8'] 或 ['62c795xxxb468af8', '62c795xxxb468af9']
      - `workItemIds` (unknown): 关联工作项ID列表。示例：['workitem-123', 'workitem-456']
      - `createFrom` (string): 创建来源。WEB - 页面创建；COMMAND_LINE - 命令行创建。默认为WEB
      - `triggerAIReviewRun` (boolean): 是否触发AI评审。true - 触发AI评审；false - 不触发（默认）


- `create_change_request_comment` - [Code Management] Create a comment on a change request. Supports two types: GLOBAL_COMMENT (global comment on the entire merge request) and INLINE_COMMENT (inline comment on specific code lines). For INLINE_COMMENT, you must provide file_path, line_number, from_patchset_biz_id, and to_patchset_biz_id parameters.
    - **Required parameters**:
      - `organizationId` (string): 组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'
      - `repositoryId` (string): 代码库ID或者URL-Encoder编码的全路径。示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）
      - `localId` (string): 局部ID，表示代码库中第几个合并请求。示例：'1' 或 '42'
      - `content` (string): 评论内容，长度必须在 1 到 65535 之间。示例：'This is a comment content.' 或 '这里需要优化性能，建议使用缓存机制'
      - `patchset_biz_id` (string): 关联版本ID，具有唯一性。对于全局评论，使用最新合并源版本ID；对于行内评论，选择 from_patchset_biz_id 或 to_patchset_biz_id 中的一个。示例：'bf117304dfe44d5d9b1132f348edf92e'
    - **Optional parameters**:
      - `comment_type` (string): 评论类型。GLOBAL_COMMENT - 全局评论（对整个合并请求的评论）；INLINE_COMMENT - 行内评论（针对特定代码行的评论）。创建行内评论时，必须提供 file_path、line_number、from_patchset_biz_id 和 to_patchset_biz_id 参数
      - `draft` (boolean): 是否草稿评论。true - 草稿评论（不会立即显示给其他人）；false - 正式评论（默认值）
      - `resolved` (boolean): 是否标记已解决。true - 已解决；false - 未解决（默认值）
      - `file_path` (string): 文件路径，仅行内评论需要。表示评论针对的文件路径。示例：'/src/main/java/com/example/MyClass.java' 或 'src/utils/helper.ts' 或 'frontend/components/Button.tsx'
      - `line_number` (integer): 行号，仅行内评论需要。表示评论针对的代码行号，从1开始计数。示例：42 表示第42行，100 表示第100行
      - `from_patchset_biz_id` (string): 比较的起始版本ID，行内评论类型必传。表示代码比较的起始版本（通常是目标分支版本，即合并目标对应的版本）。示例：'bf117304dfe44d5d9b1132f348edf92e'
      - `to_patchset_biz_id` (string): 比较的目标版本ID，行内评论类型必传。表示代码比较的目标版本（通常是源分支版本，即合并源对应的版本）。示例：'537367017a9841738ac4269fbf6aacbe'
      - `parent_comment_biz_id` (string): 父评论ID，用于回复评论。如果这是对某个评论的回复，需要传入被回复评论的 bizId。示例：'1d8171cf0cc2453197fae0e0a27d5ece'


- `create_commit_comment` - [Code Management] Create a comment on a commit
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `repositoryId` (string): 代码库ID或者URL-Encoder编码的全路径
      - `sha` (string): 提交的SHA值
      - `content` (string): commit的评论内容


- `delete_branch` - [Code Management] Delete a branch from a Codeup repository
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `repositoryId` (string): Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)
      - `branchName` (string): Branch name (use URL-Encoder for encoding, example: feature%2Fdev)


- `delete_file` - [Code Management] Delete a file from a Codeup repository
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `repositoryId` (string): Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)
      - `filePath` (string): File path, needs to be URL encoded, for example: /src/main/java/com/aliyun/test.java
      - `commitMessage` (string): Commit message
      - `branch` (string): Branch name


- `get_branch` - [Code Management] Get information about a branch in a Codeup repository
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `repositoryId` (string): Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)
      - `branchName` (string): Branch name (if it contains special characters, use URL encoding), example: master or feature%2Fdev


- `get_file_blobs` - [Code Management] Get file content from a Codeup repository
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `repositoryId` (string): Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)
      - `filePath` (string): File path, needs to be URL encoded, for example: /src/main/java/com/aliyun/test.java
      - `ref` (string): Reference name, usually branch name, can be branch name, tag name or commit SHA. If not provided, the default branch of the repository will be used, such as master


- `get_repository` - [Code Management] Get information about a Codeup repository
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `repositoryId` (string): Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)


- `get_change_request` - [Code Management] Get detailed information about a specific change request (merge request) by its local ID.
    - **Required parameters**:
      - `organizationId` (string): 组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'
      - `repositoryId` (string): 代码库ID或者URL-Encoder编码的全路径。示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）
      - `localId` (string): 局部ID，表示代码库中第几个合并请求。示例：'1' 或 '42'


- `get_commit` - [Code Management] Get information about a commit
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `repositoryId` (string): 代码库ID或者URL-Encoder编码的全路径
      - `sha` (string): 提交ID，即Commit SHA值


- `list_branches` - [Code Management] List branches in a Codeup repository
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `repositoryId` (string): Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)
    - **Optional parameters**:
      - `page` (integer): Page number
      - `perPage` (integer): Items per page
      - `sort` (string): Sort order: name_asc - name ascending, name_desc - name descending, updated_asc - update time ascending, updated_desc - update time descending
      - `search` (['string', 'null']): Search query


- `list_files` - [Code Management] List file tree from a Codeup repository
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `repositoryId` (string): Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)
    - **Optional parameters**:
      - `path` (string): Specific path to query, for example to query files in the src/main directory
      - `ref` (string): Reference name, usually branch name, can be branch name, tag name or commit SHA. If not provided, the default branch of the repository will be used, such as master
      - `type` (string): File tree retrieval method: DIRECT - only get the current directory, default method; RECURSIVE - recursively find all files under the current path; FLATTEN - flat display (if it is a directory, recursively find until the subdirectory contains files or multiple directories)


- `list_repositories` - [Code Management] Get the CodeUp Repository List.

A Repository serves as a unit for managing source code and is distinct from a Project.

Use Case:

View my repositories
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
    - **Optional parameters**:
      - `page` (integer): Page number, default starts from 1, generally should not exceed 150 pages
      - `perPage` (integer): Items per page, default 20, value range [1, 100]
      - `orderBy` (string): Sort field, options include {created_at, name, path, last_activity_at}, default is created_at
      - `sort` (string): Sort order, options include {asc, desc}, default is desc
      - `search` (['string', 'null']): Search keyword, used to fuzzy match repository paths
      - `archived` (boolean): Whether archived


- `list_change_requests` - [Code Management] List change requests with multi-condition filtering, pagination and sorting. Supports filtering by repository, author, reviewer, state (opened/merged/closed), search keywords, and creation time range.
    - **Required parameters**:
      - `organizationId` (string): 组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'
    - **Optional parameters**:
      - `page` (integer): 页码，从1开始。示例：1
      - `perPage` (integer): 每页大小，默认20。示例：20
      - `projectIds` (['string', 'null']): 代码库ID或者路径列表，多个以逗号分隔。示例：'2813489,2813490' 或 '2813489,60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）
      - `authorIds` (['string', 'null']): 创建者用户ID列表，多个以逗号分隔。示例：'62c795xxxb468af8' 或 '62c795xxxb468af8,62c795xxxb468af9'
      - `reviewerIds` (['string', 'null']): 评审人用户ID列表，多个以逗号分隔。示例：'62c795xxxb468af8' 或 '62c795xxxb468af8,62c795xxxb468af9'
      - `state` (unknown): 合并请求筛选状态。opened - 已开启；merged - 已合并；closed - 已关闭。默认为null，即查询全部状态。示例：'opened'
      - `search` (['string', 'null']): 标题关键字搜索，用于在合并请求标题中搜索。示例：'mr title' 或 'bug fix'
      - `orderBy` (string): 排序字段。created_at - 按创建时间排序；updated_at - 按更新时间排序（默认）。示例：'updated_at'
      - `sort` (string): 排序方式。asc - 升序；desc - 降序（默认）。示例：'desc'
      - `createdBefore` (['string', 'null']): 起始创建时间，时间格式为ISO 8601。查询创建时间不早于此时间的合并请求。示例：'2024-04-05T15:30:45Z'
      - `createdAfter` (['string', 'null']): 截止创建时间，时间格式为ISO 8601。查询创建时间不晚于此时间的合并请求。示例：'2024-04-05T15:30:45Z'


- `list_change_request_comments` - [Code Management] List comments on a change request. Supports filtering by comment type (GLOBAL_COMMENT or INLINE_COMMENT), state (OPENED or DRAFT), resolved status, and file path (for inline comments).
    - **Required parameters**:
      - `organizationId` (string): 组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'
      - `repositoryId` (string): 代码库ID或者URL-Encoder编码的全路径。示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）
      - `localId` (string): 合并请求局部ID，表示代码库中第几个合并请求。示例：'1' 或 '42'
    - **Optional parameters**:
      - `patchSetBizIds` (array): 关联版本ID列表，每个评论都关联一个版本，表示该评论是在哪个版本上发布的。对于全局评论，关联的是最新合并源版本。示例：['bf117304dfe44d5d9b1132f348edf92e', '537367017a9841738ac4269fbf6aacbe']
      - `commentType` (string): 评论类型。GLOBAL_COMMENT - 全局评论；INLINE_COMMENT - 行内评论
      - `state` (string): 评论状态。OPENED - 已发布的评论；DRAFT - 草稿评论
      - `resolved` (boolean): 是否已解决。true - 只查询已解决的评论；false - 只查询未解决的评论（默认值）
      - `filePath` (string): 文件路径过滤，仅用于行内评论。可以过滤特定文件的评论。示例：'/src/main/java/com/example/MyClass.java' 或 'src/utils/helper.ts'


- `list_change_request_patch_sets` - [Code Management] List patch sets (versions) for a change request. Patch sets represent different versions of the merge request as it evolves.
    - **Required parameters**:
      - `organizationId` (string): 组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'
      - `repositoryId` (string): 代码库ID或者URL-Encoder编码的全路径。示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）
      - `localId` (string): 局部ID，表示代码库中第几个合并请求。示例：'1' 或 '42'


- `list_commits` - [Code Management] List commits in a Codeup repository
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `repositoryId` (string): 代码库ID或者URL-Encoder编码的全路径
      - `refName` (string): 分支名称、标签名称或提交版本，默认为代码库默认分支
    - **Optional parameters**:
      - `since` (string): 提交起始时间，格式：YYYY-MM-DDTHH:MM:SSZ
      - `until` (string): 提交截止时间，格式：YYYY-MM-DDTHH:MM:SSZ
      - `page` (integer): 页码
      - `perPage` (integer): 每页大小
      - `path` (string): 文件路径
      - `search` (string): 搜索关键字
      - `showSignature` (boolean): 是否展示签名
      - `committerIds` (string): 提交人ID列表（多个ID以逗号隔开）


- `compare` - [Code Management] Query code to compare content
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `repositoryId` (string): Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)
      - `from` (string): Can be CommitSHA, branch name or tag name
      - `to` (string): Can be CommitSHA, branch name or tag name
    - **Optional parameters**:
      - `sourceType` (['string', 'null']): Options: branch, tag; if it's a commit comparison, you can omit this; if it's a branch comparison, you need to provide: branch, or you can omit it but ensure there are no branch or tag name conflicts; if it's a tag comparison, you need to provide: tag; if there are branches and tags with the same name, you need to strictly provide branch or tag
      - `targetType` (['string', 'null']): Options: branch, tag; if it's a commit comparison, you can omit this; if it's a branch comparison, you need to provide: branch, or you can omit it but ensure there are no branch or tag name conflicts; if it's a tag comparison, you need to provide: tag; if there are branches and tags with the same name, you need to strictly provide branch or tag
      - `straight` (unknown): Whether to use Merge-Base: straight=false means using Merge-Base; straight=true means not using Merge-Base; default is false, meaning using Merge-Base

### Pass

- `update_file` - [Code Management] Update an existing file in a Codeup repository
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `repositoryId` (string): Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)
      - `filePath` (string): File path, needs to be URL encoded, for example: /src/main/java/com/aliyun/test.java
      - `content` (string): File content
      - `commitMessage` (string): Commit message, not empty, no more than 102400 characters
      - `branch` (string): Branch name
    - **Optional parameters**:
      - `encoding` (string): Encoding rule, options {text, base64}, default is text


- `update_change_request_comment` - [Code Management] Update a comment on a change request. Can update the comment content and/or resolved status.
    - **Required parameters**:
      - `organizationId` (string): 组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'
      - `repositoryId` (string): 代码库ID或者URL-Encoder编码的全路径。示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）
      - `localId` (string): 合并请求局部ID，表示代码库中第几个合并请求。示例：'1' 或 '42'
      - `commentBizId` (string): 评论 bizId，具有唯一性，用于标识要更新的评论。示例：'bf117304dfe44d5d9b1132f348edf92e'
    - **Optional parameters**:
      - `content` (string): 评论内容，更新后的评论内容（可选）。如果提供，将更新评论的文本内容。示例：'your new comment' 或 '更新后的评论内容：这里需要优化性能，建议使用缓存机制'
      - `resolved` (boolean): 是否已解决（可选）。true - 标记为已解决；false - 标记为未解决。示例：false。如果不提供此参数，将保持原有的解决状态不变
