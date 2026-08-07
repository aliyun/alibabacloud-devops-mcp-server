import { z } from 'zod';
import { toInputSchema } from '../common/inputSchema.js';
import * as types from '../common/types.js';

export const getPipelineTools = () => [
  {
    name: "get_pipeline",
    description: "[Pipeline Management] Get details of a specific pipeline in an organization",
    inputSchema: toInputSchema(types.GetPipelineSchema),
  },
  {
    name: "list_pipelines",
    description: "[Pipeline Management] Get a list of pipelines in an organization with filtering options",
    inputSchema: toInputSchema(types.ListPipelinesSchema),
  },
  {
    name: "generate_pipeline_yaml",
    description: "[Pipeline Management] Generate the pipeline YAML without creating the pipeline — a dry run of " +
      "create_pipeline_from_description, for previewing the config or debugging a generation problem. " +
      "Takes the same parameters and follows the same guidelines.",
    inputSchema: toInputSchema(types.CreatePipelineFromDescriptionSchema),
  },
  {
    name: "create_pipeline_from_description",
    description: "[Pipeline Management] Create a pipeline from structured parameters.\n\n" +
      "Workflow: take the parameters the user stated explicitly, fill the rest by inspecting the local project " +
      "(each parameter's description says which file or git command to read), then call this tool.\n\n" +
      "Guidelines:\n" +
      "- Prefer local detection over API calls. Do NOT call list_repositories / list_service_connections first; " +
      "only do so when the user explicitly wants to pick from the available options.\n" +
      "- Omit serviceConnectionId to have the default resolved internally. " +
      "serviceName is derived from repoUrl (git@host:org/repo.git → repo) when omitted.",
    inputSchema: toInputSchema(types.CreatePipelineFromDescriptionSchema),
  },
  {
    name: "smart_list_pipelines",
    description: "[Pipeline Management] Intelligently search pipelines with natural language time references (e.g., 'today', 'this week')",
    inputSchema: toInputSchema(
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
    description: "[Pipeline Management] Run a pipeline.\n\n" +
      "Use the simplified parameters (branch, tag, branches, repositories, environmentVariables). " +
      "Do NOT hand-craft the 'params' JSON — it is only for a raw JSON string the user supplies verbatim, " +
      "and it overrides everything else.\n\n" +
      "Behavior: passing branch or tag alone resolves the repository URLs from the pipeline config automatically; " +
      "passing branches enables branch mode.",
    inputSchema: toInputSchema(types.CreatePipelineRunSchema),
  },
  {
    name: "get_latest_pipeline_run",
    description: "[Pipeline Management] Get information about the latest pipeline run",
    inputSchema: toInputSchema(types.GetLatestPipelineRunSchema),
  },
  {
    name: "get_pipeline_run",
    description: "[Pipeline Management] Get details of a specific pipeline run instance",
    inputSchema: toInputSchema(types.GetPipelineRunSchema),
  },
  {
    name: "list_pipeline_runs",
    description: "[Pipeline Management] Get a list of pipeline run instances with filtering options",
    inputSchema: toInputSchema(types.ListPipelineRunsSchema),
  },
  {
    name: "list_pipeline_jobs_by_category",
    description: "[Pipeline Management] Get pipeline execution tasks by category. Currently only supports DEPLOY category.",
    inputSchema: toInputSchema(types.ListPipelineJobsByCategorySchema),
  },
  {
    name: "list_pipeline_job_historys",
    description: "[Pipeline Management] Get the execution history of a pipeline task. Retrieve all execution records for a specific task in a pipeline.",
    inputSchema: toInputSchema(types.ListPipelineJobHistorysSchema),
  },
  {
    name: "execute_pipeline_job_run",
    description: "[Pipeline Management] Manually run a pipeline task. Start a specific job in a pipeline run instance.",
    inputSchema: toInputSchema(types.ExecutePipelineJobRunSchema),
  },
  {
    name: "get_pipeline_job_run_log",
    description: "[Pipeline Management] Get the execution logs of a pipeline job. Retrieve the log content for a specific job in a pipeline run.",
    inputSchema: toInputSchema(types.GetPipelineJobRunLogSchema),
  },
  {
    name: "stop_pipeline_job_run",
    description: "[Pipeline Management] Stop/terminate a running pipeline job.",
    inputSchema: toInputSchema(types.StopPipelineJobRunSchema),
  },
  {
    name: "retry_pipeline_job_run",
    description: "[Pipeline Management] Retry a failed pipeline job run.",
    inputSchema: toInputSchema(types.RetryPipelineJobRunSchema),
  },
  {
    name: "rerun_pipeline_job_run",
    description: "[Pipeline Management] Rerun a pipeline job. Only deploy-type jobs are supported. You can set a job as deploy type in its configuration.",
    inputSchema: toInputSchema(types.RerunPipelineJobRunSchema),
  },
  {
    name: "skip_pipeline_job_run",
    description: "[Pipeline Management] Skip a pipeline job run.",
    inputSchema: toInputSchema(types.SkipPipelineJobRunSchema),
  },
  {
    name: "pass_pipeline_validate",
    description: "[Pipeline Management] Approve/pass a manual checkpoint (human validation gate) in a pipeline run.",
    inputSchema: toInputSchema(types.PassPipelineValidateSchema),
  },
  {
    name: "refuse_pipeline_validate",
    description: "[Pipeline Management] Refuse/reject a manual checkpoint (human validation gate) in a pipeline run.",
    inputSchema: toInputSchema(types.RefusePipelineValidateSchema),
  },
  {
    name: "execute_pipeline_job_action",
    description: "[Pipeline Management] Execute a subsequent action of a pipeline job.",
    inputSchema: toInputSchema(types.ExecutePipelineJobActionSchema),
  },
  {
    name: "get_pipeline_job_steps",
    description: "[Pipeline Management] Get the list of steps for a pipeline job. Returns step details including stepIndex and buildId needed for log retrieval.",
    inputSchema: toInputSchema(types.GetPipelineJobStepsSchema),
  },
  {
    name: "get_pipeline_job_step_log",
    description: "[Pipeline Management] Get the log content for a specific step of a pipeline job. Use GetPipelineJobSteps first to get stepIndex and buildId.",
    inputSchema: toInputSchema(types.GetPipelineJobStepLogSchema),
  },
  {
    name: "get_pipeline_job_step_log_url",
    description: "[Pipeline Management] Get the download URL for a pipeline job step log. Use GetPipelineJobSteps first to get stepIndex and buildId.",
    inputSchema: toInputSchema(types.GetPipelineJobStepLogUrlSchema),
  },
  {
    name: "update_pipeline",
    description: "[Pipeline Management] Update an existing pipeline in Yunxiao by pipelineId. Use this to update pipeline YAML, stages, jobs, etc.",
    inputSchema: toInputSchema(types.UpdatePipelineSchema),
  },
];