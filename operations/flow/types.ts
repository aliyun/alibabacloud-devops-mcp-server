import { z } from "zod";

// Flow Pipeline related schemas
export const PipelineConfigSourceSchema = z.object({
  data: z.object({
    branch: z.string().nullable().optional().describe("Default branch"),
    cloneDepth: z.number().int().nullable().optional().describe("Clone depth"),
    credentialId: z.number().int().nullable().optional().describe("Credential ID"),
    credentialLabel: z.string().nullable().optional().describe("Credential label"),
    credentialType: z.string().nullable().optional().describe("Credential type"),
    events: z.array(z.string()).nullable().optional().describe("Trigger events"),
    isBranchMode: z.boolean().nullable().optional().describe("Whether branch mode is enabled"),
    isCloneDepth: z.boolean().nullable().optional().describe("Whether clone depth is enabled"),
    isSubmodule: z.boolean().nullable().optional().describe("Whether submodule is enabled"),
    isTrigger: z.boolean().nullable().optional().describe("Whether commit trigger is enabled"),
    label: z.string().nullable().optional().describe("Display name"),
    namespace: z.string().nullable().optional().describe("Namespace"),
    repo: z.string().nullable().optional().describe("Repository URL"),
    serviceConnectionId: z.number().int().nullable().optional().describe("Service connection ID"),
    triggerFilter: z.string().nullable().optional().describe("Trigger filter condition"),
    webhook: z.string().nullable().optional().describe("Webhook URL"),
  }),
  sign: z.string().nullable().optional().describe("Code source identifier"),
  type: z.string().nullable().optional().describe("Code source type"),
});

export const PipelineTagSchema = z.object({
  id: z.number().int().nullable().optional().describe("Tag ID"),
  name: z.string().nullable().optional().describe("Tag name"),
});

export const PipelineConfigSchema = z.object({
  flow: z.string().nullable().optional().describe("Flow configuration"),
  settings: z.string().nullable().optional().describe("Pipeline settings"),
  sources: z.array(PipelineConfigSourceSchema).nullable().optional().describe("Code source configurations"),
});

// Flow Pipeline detail schema
export const PipelineDetailSchema = z.object({
  createTime: z.number().int().nullable().optional().describe("Creation time in milliseconds"),
  creatorAccountId: z.string().nullable().optional().describe("Creator account ID"),
  envId: z.number().int().nullable().optional().describe("Environment ID: 0-Daily 1-Pre-release 2-Production"),
  envName: z.string().nullable().optional().describe("Environment name"),
  groupId: z.number().int().nullable().optional().describe("Pipeline group ID"),
  modifierAccountId: z.string().nullable().optional().describe("Last modifier account ID"),
  name: z.string().nullable().optional().describe("Pipeline name"),
  pipelineConfig: PipelineConfigSchema.nullable().optional().describe("Pipeline configuration"),
  tagList: z.array(PipelineTagSchema).nullable().optional().describe("Tag list"),
  updateTime: z.number().int().nullable().optional().describe("Update time"),
});

// Flow Get pipeline schema
export const GetPipelineSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID"),
});

// Flow Create pipeline schema
export const CreatePipelineSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  name: z.string().max(60).describe("Pipeline name, maximum 60 characters"),
  content: z.string().describe("Pipeline YAML description, refer to YAML pipeline documentation for writing. This should be a complete YAML configuration including sources, stages, jobs, and steps."),
});

// Flow Create pipeline with structured options schema
export const CreatePipelineWithStructuredOptionsSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  name: z.string().max(60).describe("Pipeline name (required). LLM should generate a meaningful name based on user's request"),
  
  // 技术栈参数（必需，由大模型从IDE上下文和用户描述中提取）
  buildLanguage: z.enum(['java', 'nodejs', 'python', 'go', 'dotnet']).describe("Programming language (REQUIRED). LLM should detect from project files: pom.xml→java, package.json→nodejs, requirements.txt→python, go.mod→go, *.csproj→dotnet"),
  buildTool: z.enum(['maven', 'gradle', 'npm', 'yarn', 'pip', 'go', 'dotnet']).describe("Build tool (REQUIRED). LLM should infer from buildLanguage and project files: java+pom.xml→maven, java+build.gradle→gradle, nodejs+package-lock.json→npm, nodejs+yarn.lock→yarn, python→pip, go→go, dotnet→dotnet"),
  deployTarget: z.enum(['vm', 'k8s', 'none']).optional().describe("Deployment target from user description. vm: Virtual Machine/Host deployment, k8s: Kubernetes deployment, none: Build only without deployment. Default: none"),
  
  // 代码源相关参数（由大模型从IDE上下文中获取）
  repoUrl: z.string().optional().describe("Repository URL (LLM should get from 'git config --get remote.origin.url')"),
  branch: z.string().optional().describe("Git branch (LLM should get from 'git branch --show-current')"),
  serviceName: z.string().optional().describe("Service name (LLM can derive from repository name or project directory name)"),
  serviceConnectionId: z.string().optional().describe("Service connection UUID for repository access"),

  // 版本相关参数（大模型应该从项目文件中提取）
  jdkVersion: z.string().optional().describe("JDK version for Java projects (LLM should read from pom.xml or gradle.properties). Options: 1.6, 1.7, 1.8, 11, 17, 21. Default: 1.8"),
  mavenVersion: z.string().optional().describe("Maven version for Java projects. Options: 3.6.1, 3.6.3, 3.8.4, 3.9.3. Default: 3.6.3"),
  nodeVersion: z.string().optional().describe("Node.js version for Node projects (LLM should read from package.json engines.node or .nvmrc). Options: 16.8, 18.12, 20. Default: 18.12"),
  pythonVersion: z.string().optional().describe("Python version for Python projects (LLM should read from .python-version or pyproject.toml). Options: 3.9, 3.12. Default: 3.12"),
  goVersion: z.string().optional().describe("Go version for Go projects (LLM should read from go.mod). Options: 1.19.x, 1.20.x, 1.21.x. Default: 1.21.x"),
  kubectlVersion: z.string().optional().describe("Kubectl version for Kubernetes apply. Options: 1.25.16, 1.26.12, 1.27.9. Default: 1.27.9"),
  
  // 构建配置
  buildCommand: z.string().optional().describe("Custom build command to override default"),
  testCommand: z.string().optional().describe("Custom test command to override default"),
  
  // 构建物上传相关参数
  uploadType: z.enum(['flowPublic', 'packages']).optional().describe("Artifact upload type. flowPublic: Yunxiao public storage space, packages: Organization private generic package repository. Default: packages"),
  artifactName: z.string().optional().describe("Custom artifact name. Default: 'Artifacts_${PIPELINE_ID}'"),
  artifactVersion: z.string().optional().describe("Artifact version number, required when uploadType is packages. Default: '1.0'"),
  packagesServiceConnection: z.string().optional().describe("Packages service connection UUID, required when uploadType is packages"),
  packagesRepoId: z.string().optional().describe("Packages generic repository ID, required when uploadType is packages. Default: 'flow_generic_repo'"),
  includePathInArtifact: z.boolean().optional().describe("Whether to include full path in artifact. Default: false"),
  
  // VM部署相关参数（当deployTarget为'vm'时）
  machineGroupId: z.string().optional().describe("Machine group UUID for VM deployment (required when deployTarget=vm)"),
  executeUser: z.string().optional().describe("User for executing deployment scripts (root, admin). Default: root"),
  artifactDownloadPath: z.string().optional().describe("Path to download artifacts on target machine for VM deployment. Default: /home/admin/app/package.tgz"),
  deployCommand: z.string().optional().describe("Custom deploy command for VM deployment"),
  pauseStrategy: z.enum(['firstBatchPause', 'noPause', 'eachBatchPause']).optional().describe("Pause strategy for VM deployment. firstBatchPause: The first batch is paused. noPause: No pause. eachBatchPause: Pause each batch. Default: firstBatchPause"),
  batchNumber: z.number().int().optional().describe("Number of batches for VM deployment. Default: 2"),

  // Kubernetes部署相关参数（当deployTarget为'k8s'时）
  kubernetesClusterId: z.string().optional().describe("Kubernetes cluster ID for K8s deployment (required when deployTarget=k8s)"),
  namespace: z.string().optional().describe("Kubernetes namespace for K8s deployment"),
  dockerImage: z.string().optional().describe("Docker image name for container deployment"),
  yamlPath: z.string().optional().describe("Path to Kubernetes YAML file for K8s deployment"),
});

// 兼容性：保留原有的schema名称，但指向新的schema
export const CreatePipelineFromDescriptionSchema = CreatePipelineWithStructuredOptionsSchema;

// Flow List pipelines schema
export const ListPipelinesSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  createStartTime: z.number().int().optional().describe("Creation start time in milliseconds timestamp format (e.g., 1729178040000). For filtering pipelines created after this time."),
  createEndTime: z.number().int().optional().describe("Creation end time in milliseconds timestamp format (e.g., 1729178040000). For filtering pipelines created before this time."),
  executeStartTime: z.number().int().optional().describe("Execution start time in milliseconds timestamp format (e.g., 1729178040000). For filtering pipelines executed after this time."),
  executeEndTime: z.number().int().optional().describe("Execution end time in milliseconds timestamp format (e.g., 1729178040000). For filtering pipelines executed before this time."),
  pipelineName: z.string().optional().describe("Pipeline name for filtering"),
  statusList: z.string().optional().describe("Pipeline status list, comma separated (SUCCESS,RUNNING,FAIL,CANCELED,WAITING)"),
  perPage: z.number().int().min(1).max(30).default(10).optional().describe("Number of items per page, default 10, max 30"),
  page: z.number().int().min(1).default(1).optional().describe("Page number, default 1"),
});

// Flow Pipeline list item schema
export const PipelineListItemSchema = z.object({
  pipelineName: z.string().nullable().optional().describe("Pipeline name"),
  pipelineId: z.number().int().nullable().optional().describe("Pipeline ID"),
  createAccountId: z.string().nullable().optional().describe("Creator account ID"),
  createTime: z.number().int().nullable().optional().describe("Creation time in milliseconds"),
});

// Flow Create pipeline run schema
export const CreatePipelineRunSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID to run"),
  
  // ========== 高级参数（兼容原有方式）==========
  params: z.string().optional().describe("[Advanced] Raw pipeline run parameters in JSON string format. If provided, this will override other parameters. Example: {\"branchModeBranchs\":[\"main\"],\"envs\":{\"key\":\"value\"},\"runningBranchs\":{\"https://codeup.aliyun.com/org/repo.git\":\"dev\"}}"),
  
  // ========== 简化参数（推荐使用）==========
  // 分支/标签相关
  branch: z.string().optional().describe("[Simple] Branch name to run the pipeline with. When user says 'run pipeline with XX branch', use this parameter. This is the most common use case."),
  tag: z.string().optional().describe("[Simple] Tag name to run the pipeline with. When user says 'run pipeline with XX tag', use this parameter. Will automatically fetch repo URLs from pipeline config."),
  branches: z.array(z.string()).optional().describe("[Simple] Multiple branches for branch mode. Use when user wants to run pipeline in branch mode with specific branches."),
  branchMode: z.boolean().optional().describe("[Simple] Enable branch mode to run pipeline with multiple branches simultaneously"),
  
  // 仓库特定配置
  repositories: z.array(z.object({
    url: z.string().describe("Repository URL, e.g., https://codeup.aliyun.com/org/repo.git"),
    branch: z.string().optional().describe("Branch name for this specific repository"),
    tag: z.string().optional().describe("Tag name for this specific repository")
  })).optional().describe("[Simple] Specific branch or tag configurations for different repositories in the pipeline"),
  
  // 环境变量
  environmentVariables: z.record(z.string()).optional().describe("[Simple] Environment variables to pass to the pipeline, e.g., {\"ENV\":\"production\",\"VERSION\":\"1.0.0\"}"),
  
  // 制品相关
  pipelineArtifacts: z.record(z.string()).optional().describe("[Simple] Pipeline artifacts to use, key is artifact ID, value is version"),
  acrArtifacts: z.record(z.string()).optional().describe("[Simple] ACR (Alibaba Cloud Container Registry) artifacts to use, key is image address, value is image tag"),
  packagesArtifacts: z.record(z.string()).optional().describe("[Simple] Package repository artifacts to use, key is artifact path, value is version"),
  
  // Release分支相关
  releaseBranch: z.string().optional().describe("[Simple] Specific release branch name"),
  createReleaseBranch: z.boolean().optional().describe("[Simple] Whether to create a new release branch"),
  
  // 备注
  comment: z.string().optional().describe("[Simple] Comment or note for this pipeline run"),
  
  // 自然语言描述（辅助参数）
  description: z.string().optional().describe("[Optional] Natural language description of how to run the pipeline, the system will try to parse it automatically")
});

// Flow Pipeline run related schemas
export const PipelineRunActionSchema = z.object({
  data: z.string().nullable().optional().describe("Action data"),
  disable: z.boolean().nullable().optional().describe("Whether the action is disabled"),
  displayType: z.string().nullable().optional().describe("Display type of the action"),
  name: z.string().nullable().optional().describe("Action name"),
  order: z.number().int().nullable().optional().describe("Order of the action"),
  params: z.record(z.any()).nullable().optional().describe("Action parameters"),
  title: z.string().nullable().optional().describe("Action title"),
  type: z.string().nullable().optional().describe("Action type")
});

export const PipelineRunJobSchema = z.object({
  id: z.number().int().nullable().optional().describe("Job ID"),
  name: z.string().nullable().optional().describe("Job name"),
  startTime: z.number().int().nullable().optional().describe("Start time of the job in milliseconds"),
  endTime: z.number().int().nullable().optional().describe("End time of the job in milliseconds"),
  status: z.string().nullable().optional().describe("Job status: FAIL, SUCCESS, RUNNING"),
  params: z.string().nullable().optional().describe("Job parameters in JSON string format"),
  jobSign: z.string().nullable().optional().describe("Job unique identifier"),
  result: z.string().nullable().optional().describe("Job result data in JSON string format"),
  actions: z.array(PipelineRunActionSchema).nullable().optional().describe("Available actions for the job"),
});

export const PipelineStageInfoSchema = z.object({
  startTime: z.number().int().nullable().optional().describe("Start time of the stage in milliseconds"),
  endTime: z.number().int().nullable().optional().describe("End time of the stage in milliseconds"),
  name: z.string().nullable().optional().describe("Stage name"),
  status: z.string().nullable().optional().describe("Stage status: FAIL, SUCCESS, RUNNING"),
  id: z.number().int().nullable().optional().describe("Stage ID"),
  jobs: z.array(PipelineRunJobSchema).nullable().optional().describe("Jobs in this stage"),
});

export const PipelineStageSchema = z.object({
  index: z.string().nullable().optional().describe("Stage index"),
  name: z.string().nullable().optional().describe("Stage name"),
  stageInfo: PipelineStageInfoSchema.nullable().optional().describe("Stage detailed information")
});

export const PipelineRunSourceSchema = z.object({
  data: z.record(z.any()).optional().describe("Source configuration data"),
  name: z.string().nullable().optional().describe("Source name"),
  sign: z.string().nullable().optional().describe("Source identifier"),
  type: z.string().nullable().optional().describe("Source type"),
  label: z.string().nullable().optional().describe("Source label"),
});

export const PipelineRunGlobalParamSchema = z.object({
  key: z.string().nullable().optional().describe("Parameter key"),
  value: z.string().nullable().optional().describe("Parameter value"),
  masked: z.boolean().nullable().optional().describe("Whether the parameter is masked"),
  runningConfig: z.boolean().nullable().optional().describe("Whether the parameter is running configuration"),
  encrypted: z.boolean().nullable().optional().describe("Whether the parameter is encrypted"),
  metaData: z.string().nullable().optional().describe("Parameter metadata"),
  type: z.string().nullable().optional().describe("Parameter type"),
  description: z.string().nullable().optional().describe("Parameter description"),
  optionType: z.string().nullable().optional().describe("Parameter option type"),
});

export const PipelineRunGroupSchema = z.object({
  id: z.number().int().nullable().optional().describe("Group ID"),
  name: z.string().nullable().optional().describe("Group name")
});

export const PipelineRunSchema = z.object({
  updateTime: z.number().int().nullable().optional().describe("Last update time in milliseconds"),
  pipelineConfigId: z.number().int().nullable().optional().describe("Pipeline configuration ID"),
  createTime: z.number().int().nullable().optional().describe("Creation time of the run in milliseconds"),
  pipelineId: z.number().int().nullable().optional().describe("Pipeline ID"),
  pipelineRunId: z.number().int().nullable().optional().describe("Pipeline run ID"),
  status: z.string().optional().nullable().describe("Pipeline run status: FAIL, SUCCESS, RUNNING"),
  triggerMode: z.number().int().nullable().optional().describe("Trigger mode: 1-Manual, 2-Scheduled, 3-Code commit, 5-Pipeline, 6-Webhook"),
  stageGroup: z.array(z.array(z.string())).nullable().optional().describe("Stage groups"),
  groups: z.array(PipelineRunGroupSchema).nullable().optional().describe("Pipeline groups"),
  pipelineType: z.string().nullable().optional().describe("Pipeline type"),
  creatorAccountId: z.string().nullable().optional().describe("Creator account ID"),
  modifierAccountId: z.string().optional().describe("Last modifier account ID"),
  stages: z.array(PipelineStageSchema).nullable().optional().describe("Pipeline stages"),
  sources: z.array(PipelineRunSourceSchema).nullable().optional().describe("Code sources used in this run"),
  creator: z.string().nullable().optional().describe("Creator"),
  modifier: z.string().nullable().optional().describe("Last modifier"),
  globalParams: z.array(PipelineRunGlobalParamSchema).nullable().optional().describe("Global parameters"),
});

// Flow Get latest pipeline run schema
export const GetLatestPipelineRunSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID to get the latest run information"),
});

// Flow Get pipeline run schema
export const GetPipelineRunSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID"),
  pipelineRunId: z.string().describe("Pipeline run ID to retrieve details for"),
});

// Flow Pipeline run list item schema
export const PipelineRunListItemSchema = z.object({
  status: z.string().nullable().optional().describe("Pipeline run status: FAIL, SUCCESS, RUNNING"),
  startTime: z.number().int().nullable().optional().describe("Start time of the run in milliseconds"),
  triggerMode: z.number().int().nullable().optional().describe("Trigger mode: 1-Manual, 2-Scheduled, 3-Code commit, 5-Pipeline, 6-Webhook"),
  pipelineRunId: z.number().int().nullable().optional().describe("Pipeline run ID"),
  pipelineId: z.number().int().nullable().optional().describe("Pipeline ID"),
  endTime: z.number().int().nullable().optional().describe("End time of the run in milliseconds"),
  creator: z.string().nullable().optional().describe("Creator"),
  creatorAccountId: z.string().nullable().optional().describe("Creator account ID"),
});

// Flow List pipeline runs schema
export const ListPipelineRunsSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID to list runs for"),
  perPage: z.number().int().min(1).max(30).default(10).optional().describe("Number of items per page, default 10, max 30"),
  page: z.number().int().min(1).default(1).optional().describe("Page number, default 1"),
  startTime: z.number().int().optional().describe("Execution start time filter in milliseconds timestamp format"),
  endTime: z.number().int().optional().describe("Execution end time filter in milliseconds timestamp format"),
  status: z.string().optional().describe("Run status filter: FAIL, SUCCESS, or RUNNING"),
  triggerMode: z.number().int().optional().describe("Trigger mode filter: 1-Manual, 2-Scheduled, 3-Code commit, 5-Pipeline, 6-Webhook")
});

// Flow Pipeline job related schemas
export const ListPipelineJobsByCategorySchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID"),
  category: z.string().describe("Task category, currently only supports DEPLOY")
});

export const PipelineJobItemSchema = z.object({
  identifier: z.string().nullable().optional().describe("Task identifier"),
  jobName: z.string().nullable().optional().describe("Task name"),
  lastJobId: z.number().int().nullable().optional().describe("ID of the last executed task"),
  lastJobParams: z.string().nullable().optional().describe("Parameters of the last executed task in JSON format")
});

// Flow Pipeline job history related schemas
export const ListPipelineJobHistorysSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID"),
  category: z.string().describe("Task category, currently only supports DEPLOY"),
  identifier: z.string().describe("Task identifier"),
  perPage: z.number().int().min(1).max(30).default(10).optional().describe("Number of items per page, default 10, max 30"),
  page: z.number().int().min(1).default(1).optional().describe("Page number, default 1")
});

export const PipelineJobHistoryItemSchema = z.object({
  executeNumber: z.number().int().nullable().optional().describe("Task execution number"),
  identifier: z.string().nullable().optional().describe("Task identifier"),
  jobId: z.number().int().nullable().optional().describe("Job ID"),
  jobName: z.string().nullable().optional().describe("Job name"),
  operatorAccountId: z.string().nullable().optional().describe("Operator account ID"),
  pipelineId: z.number().int().nullable().optional().describe("Pipeline ID"),
  pipelineRunId: z.number().int().nullable().optional().describe("Pipeline run instance ID"),
  sources: z.string().nullable().optional().describe("Code source information for the job run, in JSON format"),
  status: z.string().nullable().optional().describe("Job execution status")
});

// Flow Execute pipeline job run schema
export const ExecutePipelineJobRunSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID"),
  pipelineRunId: z.string().describe("Pipeline run instance ID"),
  jobId: z.string().describe("Job ID for the pipeline run task")
});

// Flow Get pipeline job run log schema
export const GetPipelineJobRunLogSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID"),
  pipelineRunId: z.string().describe("Pipeline run instance ID"),
  jobId: z.string().describe("Job ID of the pipeline run task")
});

export const PipelineJobRunLogSchema = z.object({
  content: z.string().nullable().optional().describe("Log content"),
  last: z.number().int().nullable().optional().describe("Last log line number"),
  more: z.boolean().nullable().optional().describe("Whether there are more logs available")
});

// Resource member schemas
export const ResourceMemberSchema = z.object({
  username: z.string().nullable().optional().describe("用户名"),
  userId: z.string().nullable().optional().describe("用户id"),
  role: z.string().nullable().optional().describe("用户角色"),
});

export const ResourceMemberBaseSchema = z.object({
  organizationId: z.string().describe("企业Id"),
  resourceType: z.string().describe("资源类型 pipeline 流水线 hostGroup 主机组"),
  resourceId: z.string().describe("资源Id"),
});

export const DeleteResourceMemberSchema = ResourceMemberBaseSchema.extend({
  userId: z.string().describe("用户Id"),
});

export const UpdateResourceMemberSchema = ResourceMemberBaseSchema.extend({
  roleName: z.string().describe("角色部署组 hostGroup: user(成员，使用权限) admin(管理员，使用编辑权限) 流水线 pipeline: admin(管理员，查看、运行、编辑权限) member(运行权限) viewer(查看权限)"),
  userId: z.string().describe("用户id"),
});

export const CreateResourceMemberSchema = ResourceMemberBaseSchema.extend({
  roleName: z.string().describe("角色部署组 hostGroup: user(成员，使用权限) admin(管理员，使用编辑权限) owner(拥有者，所有权限)  流水线 pipeline: owner(拥有者，所有权限) admin(管理员，查看、运行、编辑权限) member(运行权限) viewer(查看权限)"),
  userId: z.string().describe("用户id"),
});

export const UpdateResourceOwnerSchema = ResourceMemberBaseSchema.extend({
  newOwnerId: z.string().describe("新拥有者用户Id"),
});

// Flow Update pipeline schema
export const UpdatePipelineSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  pipelineId: z.string().describe("Pipeline ID"),
  content: z.string().describe("Pipeline YAML content"),
  name: z.string().max(60).describe("Pipeline name, max 60 chars")
});

// Service Connection related types
export const ServiceConnectionSchema = z.object({
  createTime: z.number().int().nullable().optional().describe("创建时间 (毫秒时间戳)"),
  id: z.number().int().nullable().optional().describe("服务连接ID"),
  name: z.string().nullable().optional().describe("服务连接名称"),
  ownerAccountId: z.union([z.string(), z.number().int()]).nullable().optional().describe("拥有者阿里云账号ID"),
  type: z.string().nullable().optional().describe("服务连接类型"),
  uuid: z.string().nullable().optional().describe("UUID"),
});

export const ListServiceConnectionsSchema = z.object({
  organizationId: z.string().describe("组织ID，可在组织管理后台的基本信息页面获取"),
  serviceConnectionType: z.enum([
    "aliyun_code", 
    "codeup", 
    "gitee", 
    "github", 
    "ack", 
    "docker_register_aliyun", 
    "ecs", 
    "edas", 
    "emas", 
    "fc", 
    "kubernetes", 
    "oss", 
    "packages", 
    "ros", 
    "sae"
  ]).describe("服务连接类型: aliyun_code-阿里云代码, codeup-Codeup, gitee-码云, github-Github, ack-容器服务Kubernetes（ACK）, docker_register_aliyun-容器镜像服务（ACR）, ecs-ECS主机, edas-企业级分布式应用（EDAS）, emas-移动研发平台（EMAS）, fc-阿里云函数计算（FC）, kubernetes-自建k8s集群, oss-对象存储（OSS）, packages-制品仓库, ros-资源编排服务（ROS）, sae-Serverless应用引擎（SAE）"),
});

export type ServiceConnection = z.infer<typeof ServiceConnectionSchema>;

// Host Group related types
export const HostInfoSchema = z.object({
  aliyunRegion: z.string().nullable().optional().describe("阿里云区域"),
  createTime: z.number().int().nullable().optional().describe("创建时间 (毫秒时间戳)"),
  creatorAccountId: z.string().nullable().optional().describe("创建者阿里云账号"),
  instanceName: z.string().nullable().optional().describe("主机名"),
  ip: z.string().nullable().optional().describe("机器IP"),
  machineSn: z.string().nullable().optional().describe("机器SN"),
  modiferAccountId: z.string().nullable().optional().describe("修改者阿里云账号"),
  objectType: z.string().nullable().optional().describe("对象类型，固定为MachineInfo"),
  updateTime: z.number().int().nullable().optional().describe("更新时间"),
});

export const HostGroupSchema = z.object({
  aliyunRegion: z.string().nullable().optional().describe("阿里云区域"),
  createTime: z.number().int().nullable().optional().describe("创建时间 (毫秒时间戳)"),
  creatorAccountId: z.string().nullable().optional().describe("创建人"),
  description: z.string().nullable().optional().describe("主机组描述"),
  ecsLabelKey: z.string().nullable().optional().describe("ECS标签Key"),
  ecsLabelValue: z.string().nullable().optional().describe("ECS标签Value"),
  ecsType: z.string().nullable().optional().describe("ECS类型，暂只支持ECS_ALIYUN"),
  hostInfos: z.array(HostInfoSchema).nullable().optional().describe("主机信息列表"),
  hostNum: z.number().int().nullable().optional().describe("主机数"),
  id: z.number().int().nullable().optional().describe("主机组ID"),
  uuid: z.string().nullable().optional().describe("主机组UUID"),
  modiferAccountId: z.string().nullable().optional().describe("更新人"),
  name: z.string().nullable().optional().describe("主机组名称"),
  serviceConnectionId: z.number().int().nullable().optional().describe("服务连接ID"),
  type: z.string().nullable().optional().describe("主机组类型"),
  updateTime: z.number().int().nullable().optional().describe("更新时间 (毫秒时间戳)"),
});

export const ListHostGroupsSchema = z.object({
  organizationId: z.string().describe("组织ID，可在组织管理后台的基本信息页面获取"),
  ids: z.string().optional().describe("主机组ID，多个逗号分割"),
  name: z.string().optional().describe("主机组名称"),
  createStartTime: z.number().int().optional().describe("主机组创建开始时间"),
  createEndTime: z.number().int().optional().describe("主机组创建结束时间"),
  creatorAccountIds: z.string().optional().describe("创建阿里云账号ID，多个逗号分割"),
  perPage: z.number().int().min(1).max(30).default(10).optional().describe("每页数据条数，默认10，最大支持30"),
  page: z.number().int().min(1).default(1).optional().describe("当前页，默认1"),
  pageSort: z.string().optional().describe("排序条件ID"),
  pageOrder: z.enum(["DESC", "ASC"]).default("DESC").optional().describe("排序顺序 DESC 降序 ASC 升序"),
});

export type HostGroup = z.infer<typeof HostGroupSchema>;

// Resource member type exports
export type ResourceMember = z.infer<typeof ResourceMemberSchema>;
export type DeleteResourceMemberParams = z.infer<typeof DeleteResourceMemberSchema>;
export type UpdateResourceMemberParams = z.infer<typeof UpdateResourceMemberSchema>;
export type CreateResourceMemberParams = z.infer<typeof CreateResourceMemberSchema>;
export type UpdateResourceOwnerParams = z.infer<typeof UpdateResourceOwnerSchema>;

// Tag schemas
export const TagGroupSchema = z.object({
  id: z.number().int().nullable().optional().describe("标签分类 id"),
  name: z.string().nullable().optional().describe("标签分类名称"),
  creatorAccountId: z.string().nullable().optional().describe("创建人"),
  modifierAccountId: z.string().nullable().optional().describe("更新人"),
});

export const TagSchema = z.object({
  id: z.number().int().nullable().optional().describe("标签 id"),
  name: z.string().nullable().optional().describe("标签名称"),
  color: z.string().nullable().optional().describe("标签颜色"),
  creatorAccountId: z.string().nullable().optional().describe("创建人"),
  modifierAccountId: z.string().nullable().optional().describe("更新人"),
});

export const TagGroupWithTagsSchema = TagGroupSchema.extend({
  flowTagList: z.array(TagSchema).nullable().optional().describe("标签列表"),
});

// Define base schema for common parameters
export const BaseTagSchema = z.object({
  organizationId: z.string().describe("企业Id"),
});

export const CreateTagSchema = BaseTagSchema.extend({
  name: z.string().describe("标签名称"),
  color: z.string().describe("#1F9AEF 蓝色; #E63A3A 红色; #FA8C15 黄色; #15AD31 绿色; #7978E5 紫色; #8C8C8C 灰色"),
  flowTagGroupId: z.number().int().describe("标签分类 id"),
});

export const CreateTagGroupSchema = BaseTagSchema.extend({
  name: z.string().describe("标签分类名称"),
});

export const DeleteTagGroupSchema = BaseTagSchema.extend({
  id: z.number().int().describe("标签分类 id"),
});

export const UpdateTagGroupSchema = DeleteTagGroupSchema.extend({
  name: z.string().describe("标签分类名称"),
});

export const DeleteTagSchema = BaseTagSchema.extend({
  id: z.number().int().describe("标签 id"),
});

export const UpdateTagSchema = DeleteTagSchema.extend({
  name: z.string().describe("标签名称"),
  color: z.string().describe("#1F9AEF 蓝色; #E63A3A 红色; #FA8C15 黄色; #15AD31 绿色; #7978E5 紫色; #8C8C8C 灰色"),
  flowTagGroupId: z.number().int().describe("标签分类 id"),
});

export const GetTagGroupSchema = DeleteTagGroupSchema;

// Tag type exports
export type TagGroup = z.infer<typeof TagGroupSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type TagGroupWithTags = z.infer<typeof TagGroupWithTagsSchema>;
export type CreateTagParams = z.infer<typeof CreateTagSchema>;
export type CreateTagGroupParams = z.infer<typeof CreateTagGroupSchema>;
export type DeleteTagGroupParams = z.infer<typeof DeleteTagGroupSchema>;
export type UpdateTagGroupParams = z.infer<typeof UpdateTagGroupSchema>;
export type DeleteTagParams = z.infer<typeof DeleteTagSchema>;
export type UpdateTagParams = z.infer<typeof UpdateTagSchema>;
export type GetTagGroupParams = z.infer<typeof GetTagGroupSchema>;

// VM Deploy Order schemas
export const DeployOrderMachineActionSchema = z.object({
  type: z.string().nullable().optional().describe("类型 RetryVMDeployMachine重试机器部署 SkipVMDeployMachine跳过机器部署 LogVMDeployMachine查看机器部署日志"),
  disable: z.boolean().nullable().optional().describe("当前用户是否有权限进行后续 action"),
  params: z.object({}).nullable().optional().describe("参数"),
});

export const DeployOrderMachineSchema = z.object({
  createTime: z.number().int().nullable().optional().describe("创建时间"),
  updateTime: z.number().int().nullable().optional().describe("更新时间"),
  status: z.string().nullable().optional().describe("状态 Success成功 Pending待部署 Running部署中 Cancelled取消 Queued部署等待中 Failed失败 Skipped已跳过"),
  machineSn: z.string().nullable().optional().describe("机器sn"),
  clientStatus: z.string().nullable().optional().describe("机器状态 ok(正常) error(连接失败)"),
  ip: z.string().nullable().optional().describe("机器ip"),
  batchNum: z.number().int().nullable().optional().describe("部署批次"),
  actions: z.array(DeployOrderMachineActionSchema).nullable().optional().describe("操作列表"),
});

export const DeployOrderDeployMachinesSchema = z.object({
  hostGroupId: z.number().int().nullable().optional().describe("主机组Id"),
  batchNum: z.number().int().nullable().optional().describe("发布批次"),
  deployMachines: z.array(DeployOrderMachineSchema).nullable().optional().describe("部署机器列表"),
});

export const DeployOrderActionSchema = z.object({
  type: z.string().nullable().optional().describe("类型 StopVMDeployOrder 取消部署单 ResumeVMDeployOrder 继续部署单运行"),
  disable: z.boolean().nullable().optional().describe("当前用户是否有权限进行后续 action"),
  params: z.object({}).nullable().optional().describe("参数"),
});

export const DeployOrderSchema = z.object({
  deployOrderId: z.number().int().nullable().optional().describe("部署单id"),
  createTime: z.number().int().nullable().optional().describe("创建时间"),
  updateTime: z.number().int().nullable().optional().describe("更新时间"),
  creator: z.string().nullable().optional().describe("创建人"),
  currentBatch: z.number().int().nullable().optional().describe("当前发布批次"),
  totalBatch: z.number().int().nullable().optional().describe("总发布批次"),
  status: z.string().nullable().optional().describe("发布状态 Waiting暂停 Running部署中 Cancelled已取消 Success成功"),
  exceptionCode: z.string().nullable().optional().describe("错误码"),
  actions: z.array(DeployOrderActionSchema).nullable().optional().describe("操作列表"),
  deployMachineInfo: DeployOrderDeployMachinesSchema.nullable().optional().describe("部署机器信息"),
});

export const DeployOrderLogSchema = z.object({
  deployLog: z.string().nullable().optional().describe("部署日志"),
  aliyunRegion: z.string().nullable().optional().describe("部署地域"),
  deployLogPath: z.string().nullable().optional().describe("部署日志路径"),
  deployBeginTime: z.string().nullable().optional().describe("部署开始时间"),
  deployEndTime: z.string().nullable().optional().describe("部署结束时间"),
});

// Define base schema for common parameters
export const BaseVMDeployOrderSchema = z.object({
  organizationId: z.string().describe("企业Id"),
  pipelineId: z.string().describe("流水线Id"),
  deployOrderId: z.string().describe("部署单Id"),
});

export const StopVMDeployOrderSchema = BaseVMDeployOrderSchema;

export const SkipVMDeployMachineSchema = BaseVMDeployOrderSchema.extend({
  machineSn: z.string().describe("机器sn"),
});

export const RetryVMDeployMachineSchema = BaseVMDeployOrderSchema.extend({
  machineSn: z.string().describe("机器sn"),
});

export const ResumeVMDeployOrderSchema = BaseVMDeployOrderSchema;

export const GetVMDeployOrderSchema = BaseVMDeployOrderSchema;

export const GetVMDeployMachineLogSchema = BaseVMDeployOrderSchema.extend({
  machineSn: z.string().describe("机器sn"),
});

// VM Deploy Order type exports
export type DeployOrderMachineAction = z.infer<typeof DeployOrderMachineActionSchema>;
export type DeployOrderMachine = z.infer<typeof DeployOrderMachineSchema>;
export type DeployOrderDeployMachines = z.infer<typeof DeployOrderDeployMachinesSchema>;
export type DeployOrderAction = z.infer<typeof DeployOrderActionSchema>;
export type DeployOrder = z.infer<typeof DeployOrderSchema>;
export type DeployOrderLog = z.infer<typeof DeployOrderLogSchema>;
export type StopVMDeployOrderParams = z.infer<typeof StopVMDeployOrderSchema>;
export type SkipVMDeployMachineParams = z.infer<typeof SkipVMDeployMachineSchema>;
export type RetryVMDeployMachineParams = z.infer<typeof RetryVMDeployMachineSchema>;
export type ResumeVMDeployOrderParams = z.infer<typeof ResumeVMDeployOrderSchema>;
export type GetVMDeployOrderParams = z.infer<typeof GetVMDeployOrderSchema>;
export type GetVMDeployMachineLogParams = z.infer<typeof GetVMDeployMachineLogSchema>;

// Flow type exports
export type PipelineDetail = z.infer<typeof PipelineDetailSchema>;
export type PipelineListItem = z.infer<typeof PipelineListItemSchema>;
export type ListPipelinesOptions = z.infer<typeof ListPipelinesSchema>;
export type CreatePipelineOptions = z.infer<typeof CreatePipelineSchema>;
export type CreatePipelineFromDescriptionOptions = z.infer<typeof CreatePipelineFromDescriptionSchema>;
export type CreatePipelineRunOptions = z.infer<typeof CreatePipelineRunSchema>;
export type PipelineRun = z.infer<typeof PipelineRunSchema>;
export type PipelineRunListItem = z.infer<typeof PipelineRunListItemSchema>;
export type ListPipelineRunsOptions = z.infer<typeof ListPipelineRunsSchema>;
export type PipelineJobItem = z.infer<typeof PipelineJobItemSchema>;
export type PipelineJobHistoryItem = z.infer<typeof PipelineJobHistoryItemSchema>;
export type PipelineJobRunLog = z.infer<typeof PipelineJobRunLogSchema>;