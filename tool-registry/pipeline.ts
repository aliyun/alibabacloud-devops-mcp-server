import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import * as types from '../common/types.js';

export const getPipelineTools = () => [
  {
    name: "get_pipeline",
    description: "[Pipeline Management] Get details of a specific pipeline in an organization",
    inputSchema: zodToJsonSchema(types.GetPipelineSchema),
  },
  {
    name: "list_pipelines",
    description: "[Pipeline Management] Get a list of pipelines in an organization with filtering options",
    inputSchema: zodToJsonSchema(types.ListPipelinesSchema),
  },
  {
    name: "generate_pipeline_yaml",
    description: "[Pipeline Management] Generate only the YAML configuration for a pipeline without creating it.\n\n" +
      "**📋 Use Cases:**\n" +
      "- Preview YAML before creating pipeline\n" +
      "- Generate YAML for manual deployment\n" +
      "- Debug pipeline configuration\n\n" +
      "**📖 Recommended Workflow:**\n" +
      "1. 🎯 Parse user description for explicit parameters\n" +
      "2. 🔍 If missing context, prefer IDE detection (terminal + file reading) over API calls\n" +
      "3. 🚀 Call this tool with collected parameters\n\n" +
      "**💡 Parameter Collection Strategy:**\n" +
      "- For QUICK pipeline creation: Use IDE detection (git config, file reading)\n" +
      "- For PRECISE parameter selection: Consider list_repositories, list_service_connections when needed\n" +
      "- Balance efficiency vs. accuracy based on user intent\n\n" +
      "**⚡ Built-in capabilities:** Handles default service connections internally, auto-extracts project name from repo URL",
    inputSchema: zodToJsonSchema(types.CreatePipelineFromDescriptionSchema),
  },
  {
    name: "create_pipeline_from_description",
    description: "[Pipeline Management] Create a pipeline using structured parameters extracted from user descriptions and environment context.\n\n" +
      "**🔧 Built-in Capabilities:**\n" +
      "- ✅ Automatically retrieves default service connection IDs when not specified\n" +
      "- ✅ Handles repository and service connection logic internally\n" +
      "- ✅ Auto-extracts project name from repository URL (git@host:org/repo.git → repo)\n" +
      "- ✅ Supports both IDE detection and explicit parameter specification\n\n" +
      "**📖 Recommended Workflow:**\n" +
      "1. 🎯 PARSE user description for explicit parameters\n" +
      "2. 🔍 DETECT missing info from IDE environment FIRST:\n" +
      "   - Run `git config --get remote.origin.url` → repoUrl\n" +
      "   - Run `git branch --show-current` → branch\n" +
      "   - Auto-extract serviceName from repoUrl\n" +
      "   - Check project files for tech stack:\n" +
      "     * pom.xml → buildLanguage='java', buildTool='maven'\n" +
      "     * build.gradle → buildLanguage='java', buildTool='gradle'\n" +
      "     * package.json + package-lock.json → buildLanguage='nodejs', buildTool='npm'\n" +
      "     * package.json + yarn.lock → buildLanguage='nodejs', buildTool='yarn'\n" +
      "     * requirements.txt → buildLanguage='python', buildTool='pip'\n" +
      "     * go.mod → buildLanguage='go', buildTool='go'\n" +
      "     * *.csproj → buildLanguage='dotnet', buildTool='dotnet'\n" +
      "3. 🚀 CALL this tool with collected parameters\n\n" +
      "**⚠️ Important Guidelines:**\n" +
      "- DO NOT call list_repositories unless user explicitly asks to choose from available repositories\n" +
      "- DO NOT call list_service_connections unless user explicitly asks to choose from available connections\n" +
      "- ALWAYS try IDE detection first before making any API calls\n" +
      "- If IDE detection fails, THEN consider API calls as fallback\n\n" +
      "**🎯 Parameter Priority:**\n" +
      "1. 👤 USER EXPLICIT (highest) - buildLanguage, buildTool, versions, deployTarget\n" +
      "2. 🔍 IDE DETECTION (preferred) - repoUrl, branch, serviceName, tech stack\n" +
      "3. 🤖 TOOL DEFAULTS (automatic) - serviceConnectionId, organizationId\n\n" +
      "**🔍 IDE Detection Rules (MUST TRY FIRST):**\n" +
      "- 📂 Repository: `git config --get remote.origin.url` → repoUrl\n" +
      "- 🌿 Branch: `git branch --show-current` → branch\n" +
      "- 🏷️ Service Name: Auto-extracted from repoUrl (git@host:org/repo.git → repo)\n" +
      "- ☕ Java Maven: pom.xml exists → buildLanguage='java', buildTool='maven'\n" +
      "- 🏗️ Java Gradle: build.gradle exists → buildLanguage='java', buildTool='gradle'\n" +
      "- 🟢 Node npm: package.json + package-lock.json → buildLanguage='nodejs', buildTool='npm'\n" +
      "- 🧶 Node yarn: package.json + yarn.lock → buildLanguage='nodejs', buildTool='yarn'\n" +
      "- 🐍 Python: requirements.txt → buildLanguage='python', buildTool='pip'\n" +
      "- 🐹 Go: go.mod → buildLanguage='go', buildTool='go'\n" +
      "- 💙 .NET: *.csproj → buildLanguage='dotnet', buildTool='dotnet'\n\n" +
      "**📝 Version Detection (from project files):**\n" +
      "- ☕ JDK: Read pom.xml <maven.compiler.source> → jdkVersion\n" +
      "- 🟢 Node: Read package.json engines.node → nodeVersion\n" +
      "- 🐍 Python: Read .python-version, pyproject.toml → pythonVersion\n" +
      "- 🐹 Go: Read go.mod go directive → goVersion\n\n" +
      "**🎯 Deployment Parsing:**\n" +
      "- '部署到主机/VM/虚拟机' → deployTarget='vm'\n" +
      "- '部署到Kubernetes/K8s' → deployTarget='k8s'\n" +
      "- '只构建/构建制品' → deployTarget='none'\n\n" +
      "**🔗 Service Connection Strategy (3 scenarios):**\n" +
      "1. **User specifies ID explicitly** (e.g., '使用服务连接ID abc123')\n" +
      "   → ✅ Pass serviceConnectionId=abc123 directly, NO list_service_connections call needed\n" +
      "2. **User doesn't specify any ID** (most common case)\n" +
      "   → ✅ Pass serviceConnectionId=null, tool will auto-retrieve default ID internally\n" +
      "3. **User wants to choose from available options** (e.g., '显示可用的服务连接让我选择')\n" +
      "   → 🔍 Call list_service_connections first, then let user choose, then create pipeline\n\n" +
      "**🤔 When to Use Other Tools:**\n" +
      "- User asks to \"select from available repositories\" → use list_repositories first\n" +
      "- User wants to \"choose from service connections\" → use list_service_connections first\n" +
      "- User wants to see options before deciding → gather info first, then create\n" +
      "- For quick creation with current repo → directly use IDE detection\n\n" +
      "**✅ Required:** organizationId, name, buildLanguage, buildTool",
    inputSchema: zodToJsonSchema(types.CreatePipelineFromDescriptionSchema),
  },
  {
    name: "smart_list_pipelines",
    description: "[Pipeline Management] Intelligently search pipelines with natural language time references (e.g., 'today', 'this week')",
    inputSchema: zodToJsonSchema(
      z.object({
        organizationId: z.string().describe("Organization ID"),
        timeReference: z.string().optional().describe("Natural language time reference such as 'today', 'yesterday', 'this week', 'last month', etc."),
        pipelineName: z.string().optional().describe("Pipeline name filter"),
        statusList: z.string().optional().describe("Pipeline status list, comma separated (SUCCESS,RUNNING,FAIL,CANCELED,WAITING)"),
        perPage: z.number().int().min(1).max(30).default(10).optional().describe("Number of items per page"),
        page: z.number().int().min(1).default(1).optional().describe("Page number")
      })
    ),
  },
  {
    name: "create_pipeline_run",
    description: "[Pipeline Management] Run a pipeline with flexible parameters.\n\n" +
      "**⚠️ IMPORTANT: DO NOT provide 'params' parameter unless user explicitly provides a JSON string. Use simplified parameters instead!**\n\n" +
      "**🎯 Most Common Use Cases:**\n" +
      "1. 🌿 Run with specific branch: Use 'branch' parameter\n" +
      "   - User: 'Run pipeline with dev branch' → { branch: 'dev' }\n" +
      "   - User: '用master分支运行流水线' → { branch: 'master' }\n" +
      "   - System will automatically fetch repository URLs from pipeline config\n\n" +
      "2. 🏷️ Run with specific tag: Use 'tag' parameter\n" +
      "   - User: 'Run pipeline with v1.0 tag' → { tag: 'v1.0' }\n" +
      "   - User: '用v2.0标签运行流水线' → { tag: 'v2.0' }\n" +
      "   - System will automatically fetch repository URLs from pipeline config\n\n" +
      "3. 🔄 Run with multiple branches: Use 'branches' parameter\n" +
      "   - User: 'Run pipeline with main and dev branches' → { branches: ['main', 'dev'] }\n\n" +
      "4. 🏛️ Run with specific repo branch/tag: Use 'repositories' parameter\n" +
      "   - { repositories: [{ url: 'https://codeup.aliyun.com/org/repo.git', branch: 'feature-x' }] }\n" +
      "   - { repositories: [{ url: 'https://codeup.aliyun.com/org/repo.git', tag: 'v1.0' }] }\n\n" +
      "5. 📦 Run with environment variables: Use 'environmentVariables' parameter\n" +
      "   - { environmentVariables: { 'ENV': 'production', 'VERSION': '1.0.0' } }\n\n" +
      "**📝 Parameter Guide:**\n" +
      "- 🌿 branch: Single branch name (most common)\n" +
      "- 🏷️ tag: Single tag name (for release versions)\n" +
      "- 🔄 branches: Multiple branches for branch mode\n" +
      "- 🏛️ repositories: Specific branch/tag per repository\n" +
      "- 📦 environmentVariables: Key-value pairs for pipeline variables\n" +
      "- 📝 comment: Add a note for this run\n" +
      "- 🔧 params: [Advanced] ONLY use if user provides raw JSON string\n\n" +
      "**⚡ Smart Behavior:**\n" +
      "- If only 'branch' or 'tag' is provided → automatically fetches repo URLs from pipeline and generates runningBranchs/runningTags\n" +
      "- If 'branches' is provided → automatically enables branch mode\n" +
      "- If 'params' is provided → all other parameters are ignored\n\n" +
      "**❌ DO NOT:**\n" +
      "- Generate 'params' parameter yourself\n" +
      "- Convert simplified parameters to 'params' JSON\n" +
      "- The system will handle param generation automatically",
    inputSchema: zodToJsonSchema(types.CreatePipelineRunSchema),
  },
  {
    name: "get_latest_pipeline_run",
    description: "[Pipeline Management] Get information about the latest pipeline run",
    inputSchema: zodToJsonSchema(types.GetLatestPipelineRunSchema),
  },
  {
    name: "get_pipeline_run",
    description: "[Pipeline Management] Get details of a specific pipeline run instance",
    inputSchema: zodToJsonSchema(types.GetPipelineRunSchema),
  },
  {
    name: "list_pipeline_runs",
    description: "[Pipeline Management] Get a list of pipeline run instances with filtering options",
    inputSchema: zodToJsonSchema(types.ListPipelineRunsSchema),
  },
  {
    name: "list_pipeline_jobs_by_category",
    description: "[Pipeline Management] Get pipeline execution tasks by category. Currently only supports DEPLOY category.",
    inputSchema: zodToJsonSchema(types.ListPipelineJobsByCategorySchema),
  },
  {
    name: "list_pipeline_job_historys",
    description: "[Pipeline Management] Get the execution history of a pipeline task. Retrieve all execution records for a specific task in a pipeline.",
    inputSchema: zodToJsonSchema(types.ListPipelineJobHistorysSchema),
  },
  {
    name: "execute_pipeline_job_run",
    description: "[Pipeline Management] Manually run a pipeline task. Start a specific job in a pipeline run instance.",
    inputSchema: zodToJsonSchema(types.ExecutePipelineJobRunSchema),
  },
  {
    name: "get_pipeline_job_run_log",
    description: "[Pipeline Management] Get the execution logs of a pipeline job. Retrieve the log content for a specific job in a pipeline run.",
    inputSchema: zodToJsonSchema(types.GetPipelineJobRunLogSchema),
  },
  {
    name: "update_pipeline",
    description: "[Pipeline Management] Update an existing pipeline in Yunxiao by pipelineId. Use this to update pipeline YAML, stages, jobs, etc.",
    inputSchema: zodToJsonSchema(types.UpdatePipelineSchema),
  },
];