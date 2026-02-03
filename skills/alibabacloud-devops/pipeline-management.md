# Pipeline Management (pipeline-management)

Tools in this toolset: **26**

## Tools

- `create_pipeline_from_description` - [Pipeline Management] Create a pipeline using structured parameters extracted from user descriptions and environment context.

**🔧 Built-in Capabilities:**
- ✅ Automatically retrieves default service connection IDs when not specified
- ✅ Handles repository and service connection logic internally
- ✅ Auto-extracts project name from repository URL (git@host:org/repo.git → repo)
- ✅ Supports both IDE detection and explicit parameter specification

**📖 Recommended Workflow:**
1. 🎯 PARSE user description for explicit parameters
2. 🔍 DETECT missing info from IDE environment FIRST:
   - Run `git config --get remote.origin.url` → repoUrl
   - Run `git branch --show-current` → branch
   - Auto-extract serviceName from repoUrl
   - Check project files for tech stack:
     * pom.xml → buildLanguage='java', buildTool='maven'
     * build.gradle → buildLanguage='java', buildTool='gradle'
     * package.json + package-lock.json → buildLanguage='nodejs', buildTool='npm'
     * package.json + yarn.lock → buildLanguage='nodejs', buildTool='yarn'
     * requirements.txt → buildLanguage='python', buildTool='pip'
     * go.mod → buildLanguage='go', buildTool='go'
     * *.csproj → buildLanguage='dotnet', buildTool='dotnet'
3. 🚀 CALL this tool with collected parameters

**⚠️ Important Guidelines:**
- DO NOT call list_repositories unless user explicitly asks to choose from available repositories
- DO NOT call list_service_connections unless user explicitly asks to choose from available connections
- ALWAYS try IDE detection first before making any API calls
- If IDE detection fails, THEN consider API calls as fallback

**🎯 Parameter Priority:**
1. 👤 USER EXPLICIT (highest) - buildLanguage, buildTool, versions, deployTarget
2. 🔍 IDE DETECTION (preferred) - repoUrl, branch, serviceName, tech stack
3. 🤖 TOOL DEFAULTS (automatic) - serviceConnectionId, organizationId

**🔍 IDE Detection Rules (MUST TRY FIRST):**
- 📂 Repository: `git config --get remote.origin.url` → repoUrl
- 🌿 Branch: `git branch --show-current` → branch
- 🏷️ Service Name: Auto-extracted from repoUrl (git@host:org/repo.git → repo)
- ☕ Java Maven: pom.xml exists → buildLanguage='java', buildTool='maven'
- 🏗️ Java Gradle: build.gradle exists → buildLanguage='java', buildTool='gradle'
- 🟢 Node npm: package.json + package-lock.json → buildLanguage='nodejs', buildTool='npm'
- 🧶 Node yarn: package.json + yarn.lock → buildLanguage='nodejs', buildTool='yarn'
- 🐍 Python: requirements.txt → buildLanguage='python', buildTool='pip'
- 🐹 Go: go.mod → buildLanguage='go', buildTool='go'
- 💙 .NET: *.csproj → buildLanguage='dotnet', buildTool='dotnet'

**📝 Version Detection (from project files):**
- ☕ JDK: Read pom.xml <maven.compiler.source> → jdkVersion
- 🟢 Node: Read package.json engines.node → nodeVersion
- 🐍 Python: Read .python-version, pyproject.toml → pythonVersion
- 🐹 Go: Read go.mod go directive → goVersion

**🎯 Deployment Parsing:**
- '部署到主机/VM/虚拟机' → deployTarget='vm'
- '部署到Kubernetes/K8s' → deployTarget='k8s'
- '只构建/构建制品' → deployTarget='none'

**🔗 Service Connection Strategy (3 scenarios):**
1. **User specifies ID explicitly** (e.g., '使用服务连接ID abc123')
   → ✅ Pass serviceConnectionId=abc123 directly, NO list_service_connections call needed
2. **User doesn't specify any ID** (most common case)
   → ✅ Pass serviceConnectionId=null, tool will auto-retrieve default ID internally
3. **User wants to choose from available options** (e.g., '显示可用的服务连接让我选择')
   → 🔍 Call list_service_connections first, then let user choose, then create pipeline

**🤔 When to Use Other Tools:**
- User asks to "select from available repositories" → use list_repositories first
- User wants to "choose from service connections" → use list_service_connections first
- User wants to see options before deciding → gather info first, then create
- For quick creation with current repo → directly use IDE detection

**✅ Required:** organizationId, name, buildLanguage, buildTool
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `name` (string): Pipeline name (required). LLM should generate a meaningful name based on user's request
      - `buildLanguage` (string): Programming language (REQUIRED). LLM should detect from project files: pom.xml→java, package.json→nodejs, requirements.txt→python, go.mod→go, *.csproj→dotnet
      - `buildTool` (string): Build tool (REQUIRED). LLM should infer from buildLanguage and project files: java+pom.xml→maven, java+build.gradle→gradle, nodejs+package-lock.json→npm, nodejs+yarn.lock→yarn, python→pip, go→go, dotnet→dotnet
    - **Optional parameters**:
      - `deployTarget` (string): Deployment target from user description. vm: Virtual Machine/Host deployment, k8s: Kubernetes deployment, none: Build only without deployment. Default: none
      - `repoUrl` (string): Repository URL (LLM should get from 'git config --get remote.origin.url')
      - `branch` (string): Git branch (LLM should get from 'git branch --show-current')
      - `serviceName` (string): Service name (LLM can derive from repository name or project directory name)
      - `serviceConnectionId` (string): Service connection UUID for repository access
      - `jdkVersion` (string): JDK version for Java projects (LLM should read from pom.xml or gradle.properties). Options: 1.6, 1.7, 1.8, 11, 17, 21. Default: 1.8
      - `mavenVersion` (string): Maven version for Java projects. Options: 3.6.1, 3.6.3, 3.8.4, 3.9.3. Default: 3.6.3
      - `nodeVersion` (string): Node.js version for Node projects (LLM should read from package.json engines.node or .nvmrc). Options: 16.8, 18.12, 20. Default: 18.12
      - `pythonVersion` (string): Python version for Python projects (LLM should read from .python-version or pyproject.toml). Options: 3.9, 3.12. Default: 3.12
      - `goVersion` (string): Go version for Go projects (LLM should read from go.mod). Options: 1.19.x, 1.20.x, 1.21.x. Default: 1.21.x
      - `kubectlVersion` (string): Kubectl version for Kubernetes apply. Options: 1.25.16, 1.26.12, 1.27.9. Default: 1.27.9
      - `buildCommand` (string): Custom build command to override default
      - `testCommand` (string): Custom test command to override default
      - `uploadType` (string): Artifact upload type. flowPublic: Yunxiao public storage space, packages: Organization private generic package repository. Default: packages
      - `artifactName` (string): Custom artifact name. Default: 'Artifacts_${PIPELINE_ID}'
      - `artifactVersion` (string): Artifact version number, required when uploadType is packages. Default: '1.0'
      - `packagesServiceConnection` (string): Packages service connection UUID, required when uploadType is packages
      - `packagesRepoId` (string): Packages generic repository ID, required when uploadType is packages. Default: 'flow_generic_repo'
      - `includePathInArtifact` (boolean): Whether to include full path in artifact. Default: false
      - `machineGroupId` (string): Machine group UUID for VM deployment (required when deployTarget=vm)
      - `executeUser` (string): User for executing deployment scripts (root, admin). Default: root
      - `artifactDownloadPath` (string): Path to download artifacts on target machine for VM deployment. Default: /home/admin/app/package.tgz
      - `deployCommand` (string): Custom deploy command for VM deployment
      - `pauseStrategy` (string): Pause strategy for VM deployment. firstBatchPause: The first batch is paused. noPause: No pause. eachBatchPause: Pause each batch. Default: firstBatchPause
      - `batchNumber` (integer): Number of batches for VM deployment. Default: 2
      - `kubernetesClusterId` (string): Kubernetes cluster ID for K8s deployment (required when deployTarget=k8s)
      - `namespace` (string): Kubernetes namespace for K8s deployment
      - `dockerImage` (string): Docker image name for container deployment
      - `yamlPath` (string): Path to Kubernetes YAML file for K8s deployment


- `create_pipeline_run` - [Pipeline Management] Run a pipeline with optional parameters
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `pipelineId` (string): Pipeline ID to run
    - **Optional parameters**:
      - `params` (string): Pipeline run parameters in JSON string format. Can include: branchModeBranchs(array), envs(object), runningBranchs(object), runningTags(object), runningPipelineArtifacts(object), runningAcrArtifacts(object), runningPackagesArtifacts(object), comment(string), needCreateBranch(boolean), releaseBranch(string)
      - `description` (string): Natural language description of how to run the pipeline, e.g. 'Run pipeline using branch mode with branches main and develop'
      - `branches` (array): Branches to use in branch mode or specific branches for repositories
      - `branchMode` (boolean): Whether to run in branch mode
      - `releaseBranch` (string): Specific release branch to use
      - `createReleaseBranch` (boolean): Whether to create a release branch
      - `environmentVariables` (object): Environment variables for the pipeline run
      - `repositories` (array): Specific repository configurations


- `create_resource_member` - [Resource Member Management] Create a resource member
    - **Required parameters**:
      - `organizationId` (string): 企业Id
      - `resourceType` (string): 资源类型 pipeline 流水线 hostGroup 主机组
      - `resourceId` (string): 资源Id
      - `roleName` (string): 角色部署组 hostGroup: user(成员，使用权限) admin(管理员，使用编辑权限) owner(拥有者，所有权限)  流水线 pipeline: owner(拥有者，所有权限) admin(管理员，查看、运行、编辑权限) member(运行权限) viewer(查看权限)
      - `userId` (string): 用户id


- `delete_resource_member` - [Resource Member Management] Delete a resource member
    - **Required parameters**:
      - `organizationId` (string): 企业Id
      - `resourceType` (string): 资源类型 pipeline 流水线 hostGroup 主机组
      - `resourceId` (string): 资源Id
      - `userId` (string): 用户Id


- `execute_pipeline_job_run` - [Pipeline Management] Manually run a pipeline task. Start a specific job in a pipeline run instance.
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `pipelineId` (string): Pipeline ID
      - `pipelineRunId` (string): Pipeline run instance ID
      - `jobId` (string): Job ID for the pipeline run task


- `generate_pipeline_yaml` - [Pipeline Management] Generate only the YAML configuration for a pipeline without creating it.

**📋 Use Cases:**
- Preview YAML before creating pipeline
- Generate YAML for manual deployment
- Debug pipeline configuration

**📖 Recommended Workflow:**
1. 🎯 Parse user description for explicit parameters
2. 🔍 If missing context, prefer IDE detection (terminal + file reading) over API calls
3. 🚀 Call this tool with collected parameters

**💡 Parameter Collection Strategy:**
- For QUICK pipeline creation: Use IDE detection (git config, file reading)
- For PRECISE parameter selection: Consider list_repositories, list_service_connections when needed
- Balance efficiency vs. accuracy based on user intent

**⚡ Built-in capabilities:** Handles default service connections internally, auto-extracts project name from repo URL
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `name` (string): Pipeline name (required). LLM should generate a meaningful name based on user's request
      - `buildLanguage` (string): Programming language (REQUIRED). LLM should detect from project files: pom.xml→java, package.json→nodejs, requirements.txt→python, go.mod→go, *.csproj→dotnet
      - `buildTool` (string): Build tool (REQUIRED). LLM should infer from buildLanguage and project files: java+pom.xml→maven, java+build.gradle→gradle, nodejs+package-lock.json→npm, nodejs+yarn.lock→yarn, python→pip, go→go, dotnet→dotnet
    - **Optional parameters**:
      - `deployTarget` (string): Deployment target from user description. vm: Virtual Machine/Host deployment, k8s: Kubernetes deployment, none: Build only without deployment. Default: none
      - `repoUrl` (string): Repository URL (LLM should get from 'git config --get remote.origin.url')
      - `branch` (string): Git branch (LLM should get from 'git branch --show-current')
      - `serviceName` (string): Service name (LLM can derive from repository name or project directory name)
      - `serviceConnectionId` (string): Service connection UUID for repository access
      - `jdkVersion` (string): JDK version for Java projects (LLM should read from pom.xml or gradle.properties). Options: 1.6, 1.7, 1.8, 11, 17, 21. Default: 1.8
      - `mavenVersion` (string): Maven version for Java projects. Options: 3.6.1, 3.6.3, 3.8.4, 3.9.3. Default: 3.6.3
      - `nodeVersion` (string): Node.js version for Node projects (LLM should read from package.json engines.node or .nvmrc). Options: 16.8, 18.12, 20. Default: 18.12
      - `pythonVersion` (string): Python version for Python projects (LLM should read from .python-version or pyproject.toml). Options: 3.9, 3.12. Default: 3.12
      - `goVersion` (string): Go version for Go projects (LLM should read from go.mod). Options: 1.19.x, 1.20.x, 1.21.x. Default: 1.21.x
      - `kubectlVersion` (string): Kubectl version for Kubernetes apply. Options: 1.25.16, 1.26.12, 1.27.9. Default: 1.27.9
      - `buildCommand` (string): Custom build command to override default
      - `testCommand` (string): Custom test command to override default
      - `uploadType` (string): Artifact upload type. flowPublic: Yunxiao public storage space, packages: Organization private generic package repository. Default: packages
      - `artifactName` (string): Custom artifact name. Default: 'Artifacts_${PIPELINE_ID}'
      - `artifactVersion` (string): Artifact version number, required when uploadType is packages. Default: '1.0'
      - `packagesServiceConnection` (string): Packages service connection UUID, required when uploadType is packages
      - `packagesRepoId` (string): Packages generic repository ID, required when uploadType is packages. Default: 'flow_generic_repo'
      - `includePathInArtifact` (boolean): Whether to include full path in artifact. Default: false
      - `machineGroupId` (string): Machine group UUID for VM deployment (required when deployTarget=vm)
      - `executeUser` (string): User for executing deployment scripts (root, admin). Default: root
      - `artifactDownloadPath` (string): Path to download artifacts on target machine for VM deployment. Default: /home/admin/app/package.tgz
      - `deployCommand` (string): Custom deploy command for VM deployment
      - `pauseStrategy` (string): Pause strategy for VM deployment. firstBatchPause: The first batch is paused. noPause: No pause. eachBatchPause: Pause each batch. Default: firstBatchPause
      - `batchNumber` (integer): Number of batches for VM deployment. Default: 2
      - `kubernetesClusterId` (string): Kubernetes cluster ID for K8s deployment (required when deployTarget=k8s)
      - `namespace` (string): Kubernetes namespace for K8s deployment
      - `dockerImage` (string): Docker image name for container deployment
      - `yamlPath` (string): Path to Kubernetes YAML file for K8s deployment

### Query Operations

- `get_pipeline` - [Pipeline Management] Get details of a specific pipeline in an organization
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `pipelineId` (string): Pipeline ID


- `get_latest_pipeline_run` - [Pipeline Management] Get information about the latest pipeline run
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `pipelineId` (string): Pipeline ID to get the latest run information


- `get_pipeline_run` - [Pipeline Management] Get details of a specific pipeline run instance
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `pipelineId` (string): Pipeline ID
      - `pipelineRunId` (string): Pipeline run ID to retrieve details for


- `get_pipeline_job_run_log` - [Pipeline Management] Get the execution logs of a pipeline job. Retrieve the log content for a specific job in a pipeline run.
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `pipelineId` (string): Pipeline ID
      - `pipelineRunId` (string): Pipeline run instance ID
      - `jobId` (string): Job ID of the pipeline run task


- `get_vm_deploy_order` - [VM Deploy Order Management] Get VM deploy order details
    - **Required parameters**:
      - `organizationId` (string): 企业Id
      - `pipelineId` (string): 流水线Id
      - `deployOrderId` (string): 部署单Id


- `get_vm_deploy_machine_log` - [VM Deploy Order Management] Get VM deploy machine log
    - **Required parameters**:
      - `organizationId` (string): 企业Id
      - `pipelineId` (string): 流水线Id
      - `deployOrderId` (string): 部署单Id
      - `machineSn` (string): 机器sn


- `list_pipelines` - [Pipeline Management] Get a list of pipelines in an organization with filtering options
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
    - **Optional parameters**:
      - `createStartTime` (integer): Creation start time in milliseconds timestamp format (e.g., 1729178040000). For filtering pipelines created after this time.
      - `createEndTime` (integer): Creation end time in milliseconds timestamp format (e.g., 1729178040000). For filtering pipelines created before this time.
      - `executeStartTime` (integer): Execution start time in milliseconds timestamp format (e.g., 1729178040000). For filtering pipelines executed after this time.
      - `executeEndTime` (integer): Execution end time in milliseconds timestamp format (e.g., 1729178040000). For filtering pipelines executed before this time.
      - `pipelineName` (string): Pipeline name for filtering
      - `statusList` (string): Pipeline status list, comma separated (SUCCESS,RUNNING,FAIL,CANCELED,WAITING)
      - `perPage` (integer): Number of items per page, default 10, max 30
      - `page` (integer): Page number, default 1


- `list_pipeline_runs` - [Pipeline Management] Get a list of pipeline run instances with filtering options
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `pipelineId` (string): Pipeline ID to list runs for
    - **Optional parameters**:
      - `perPage` (integer): Number of items per page, default 10, max 30
      - `page` (integer): Page number, default 1
      - `startTime` (integer): Execution start time filter in milliseconds timestamp format
      - `endTime` (integer): Execution end time filter in milliseconds timestamp format
      - `status` (string): Run status filter: FAIL, SUCCESS, or RUNNING
      - `triggerMode` (integer): Trigger mode filter: 1-Manual, 2-Scheduled, 3-Code commit, 5-Pipeline, 6-Webhook


- `list_pipeline_jobs_by_category` - [Pipeline Management] Get pipeline execution tasks by category. Currently only supports DEPLOY category.
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `pipelineId` (string): Pipeline ID
      - `category` (string): Task category, currently only supports DEPLOY


- `list_pipeline_job_historys` - [Pipeline Management] Get the execution history of a pipeline task. Retrieve all execution records for a specific task in a pipeline.
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `pipelineId` (string): Pipeline ID
      - `category` (string): Task category, currently only supports DEPLOY
      - `identifier` (string): Task identifier
    - **Optional parameters**:
      - `perPage` (integer): Number of items per page, default 10, max 30
      - `page` (integer): Page number, default 1


- `list_service_connections` - [Service Connection Management] List service connections in an organization with filtering options
    - **Required parameters**:
      - `organizationId` (string): 组织ID，可在组织管理后台的基本信息页面获取
      - `serviceConnectionType` (string): 服务连接类型: aliyun_code-阿里云代码, codeup-Codeup, gitee-码云, github-Github, ack-容器服务Kubernetes（ACK）, docker_register_aliyun-容器镜像服务（ACR）, ecs-ECS主机, edas-企业级分布式应用（EDAS）, emas-移动研发平台（EMAS）, fc-阿里云函数计算（FC）, kubernetes-自建k8s集群, oss-对象存储（OSS）, packages-制品仓库, ros-资源编排服务（ROS）, sae-Serverless应用引擎（SAE）


- `list_resource_members` - [Resource Member Management] Get a list of resource members
    - **Required parameters**:
      - `organizationId` (string): 企业Id
      - `resourceType` (string): 资源类型 pipeline 流水线 hostGroup 主机组
      - `resourceId` (string): 资源Id


- `resume_vm_deploy_order` - [VM Deploy Order Management] Resume VM deploy order
    - **Required parameters**:
      - `organizationId` (string): 企业Id
      - `pipelineId` (string): 流水线Id
      - `deployOrderId` (string): 部署单Id

### Retry

- `retry_vm_deploy_machine` - [VM Deploy Order Management] Retry VM deploy machine
    - **Required parameters**:
      - `organizationId` (string): 企业Id
      - `pipelineId` (string): 流水线Id
      - `deployOrderId` (string): 部署单Id
      - `machineSn` (string): 机器sn


- `skip_vm_deploy_machine` - [VM Deploy Order Management] Skip VM deploy machine
    - **Required parameters**:
      - `organizationId` (string): 企业Id
      - `pipelineId` (string): 流水线Id
      - `deployOrderId` (string): 部署单Id
      - `machineSn` (string): 机器sn


- `smart_list_pipelines` - [Pipeline Management] Intelligently search pipelines with natural language time references (e.g., 'today', 'this week')
    - **Required parameters**:
      - `organizationId` (string): Organization ID
    - **Optional parameters**:
      - `timeReference` (string): Natural language time reference such as 'today', 'yesterday', 'this week', 'last month', etc.
      - `pipelineName` (string): Pipeline name filter
      - `statusList` (string): Pipeline status list, comma separated (SUCCESS,RUNNING,FAIL,CANCELED,WAITING)
      - `perPage` (integer): Number of items per page
      - `page` (integer): Page number

### Stop

- `stop_vm_deploy_order` - [VM Deploy Order Management] Stop VM deploy order
    - **Required parameters**:
      - `organizationId` (string): 企业Id
      - `pipelineId` (string): 流水线Id
      - `deployOrderId` (string): 部署单Id

### Update Operations

- `update_pipeline` - [Pipeline Management] Update an existing pipeline in Yunxiao by pipelineId. Use this to update pipeline YAML, stages, jobs, etc.
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `pipelineId` (string): Pipeline ID
      - `content` (string): Pipeline YAML content
      - `name` (string): Pipeline name, max 60 chars


- `update_resource_member` - [Resource Member Management] Update a resource member
    - **Required parameters**:
      - `organizationId` (string): 企业Id
      - `resourceType` (string): 资源类型 pipeline 流水线 hostGroup 主机组
      - `resourceId` (string): 资源Id
      - `roleName` (string): 角色部署组 hostGroup: user(成员，使用权限) admin(管理员，使用编辑权限) 流水线 pipeline: admin(管理员，查看、运行、编辑权限) member(运行权限) viewer(查看权限)
      - `userId` (string): 用户id


- `update_resource_owner` - [Resource Member Management] Transfer resource owner
    - **Required parameters**:
      - `organizationId` (string): 企业Id
      - `resourceType` (string): 资源类型 pipeline 流水线 hostGroup 主机组
      - `resourceId` (string): 资源Id
      - `newOwnerId` (string): 新拥有者用户Id
