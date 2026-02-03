#!/usr/bin/env node
/**
 * Split SKILL.md by TOOLSET dimension. Reads SKILL.md, assigns each tool to a toolset,
 * writes one .md file per toolset, then rewrites SKILL.md with an index and links.
 *
 * Toolset mapping matches common/toolsetManager.ts (Toolset enum + ALL_TOOLSET_CONFIGS).
 */

const fs = require('fs');
const path = require('path');

const SKILL_PATH = path.join(__dirname, 'SKILL.md');
const TOOLSET_ORDER = [
  'base',
  'code-management',
  'organization-management',
  'project-management',
  'pipeline-management',
  'packages-management',
  'application-delivery',
  'test-management',
];

// Tool name -> toolset (must match toolsetManager.ts)
const TOOL_TO_TOOLSET = {
  // BASE
  get_current_organization_info: 'base',
  get_user_organizations: 'base',
  get_current_user: 'base',
  // CODE_MANAGEMENT (code-management + commit)
  create_branch: 'code-management',
  get_branch: 'code-management',
  delete_branch: 'code-management',
  list_branches: 'code-management',
  get_file_blobs: 'code-management',
  create_file: 'code-management',
  update_file: 'code-management',
  delete_file: 'code-management',
  list_files: 'code-management',
  compare: 'code-management',
  get_repository: 'code-management',
  list_repositories: 'code-management',
  get_change_request: 'code-management',
  list_change_requests: 'code-management',
  create_change_request: 'code-management',
  create_change_request_comment: 'code-management',
  list_change_request_comments: 'code-management',
  update_change_request_comment: 'code-management',
  list_change_request_patch_sets: 'code-management',
  list_commits: 'code-management',
  get_commit: 'code-management',
  create_commit_comment: 'code-management',
  // ORGANIZATION_MANAGEMENT (exclude base 3)
  list_organization_departments: 'organization-management',
  get_organization_department_info: 'organization-management',
  get_organization_department_ancestors: 'organization-management',
  list_organization_members: 'organization-management',
  get_organization_member_info: 'organization-management',
  get_organization_member_info_by_user_id: 'organization-management',
  search_organization_members: 'organization-management',
  list_organization_roles: 'organization-management',
  get_organization_role: 'organization-management',
  // PROJECT_MANAGEMENT (project-management + effort)
  get_project: 'project-management',
  search_projects: 'project-management',
  get_sprint: 'project-management',
  list_sprints: 'project-management',
  create_sprint: 'project-management',
  update_sprint: 'project-management',
  get_work_item: 'project-management',
  create_work_item: 'project-management',
  search_workitems: 'project-management',
  get_work_item_types: 'project-management',
  update_work_item: 'project-management',
  list_all_work_item_types: 'project-management',
  list_work_item_types: 'project-management',
  get_work_item_type: 'project-management',
  list_work_item_relation_work_item_types: 'project-management',
  get_work_item_type_field_config: 'project-management',
  get_work_item_workflow: 'project-management',
  list_work_item_comments: 'project-management',
  create_work_item_comment: 'project-management',
  list_current_user_effort_records: 'project-management',
  list_effort_records: 'project-management',
  create_effort_record: 'project-management',
  list_estimated_efforts: 'project-management',
  create_estimated_effort: 'project-management',
  update_effort_record: 'project-management',
  update_estimated_effort: 'project-management',
  // PIPELINE_MANAGEMENT (pipeline + service-connections + resourceMember + vmDeployOrder)
  get_pipeline: 'pipeline-management',
  list_pipelines: 'pipeline-management',
  generate_pipeline_yaml: 'pipeline-management',
  create_pipeline_from_description: 'pipeline-management',
  smart_list_pipelines: 'pipeline-management',
  create_pipeline_run: 'pipeline-management',
  get_latest_pipeline_run: 'pipeline-management',
  get_pipeline_run: 'pipeline-management',
  list_pipeline_runs: 'pipeline-management',
  list_pipeline_jobs_by_category: 'pipeline-management',
  list_pipeline_job_historys: 'pipeline-management',
  execute_pipeline_job_run: 'pipeline-management',
  get_pipeline_job_run_log: 'pipeline-management',
  update_pipeline: 'pipeline-management',
  list_service_connections: 'pipeline-management',
  delete_resource_member: 'pipeline-management',
  list_resource_members: 'pipeline-management',
  update_resource_member: 'pipeline-management',
  create_resource_member: 'pipeline-management',
  update_resource_owner: 'pipeline-management',
  stop_vm_deploy_order: 'pipeline-management',
  skip_vm_deploy_machine: 'pipeline-management',
  retry_vm_deploy_machine: 'pipeline-management',
  resume_vm_deploy_order: 'pipeline-management',
  get_vm_deploy_order: 'pipeline-management',
  get_vm_deploy_machine_log: 'pipeline-management',
  // PACKAGES_MANAGEMENT
  list_package_repositories: 'packages-management',
  list_artifacts: 'packages-management',
  get_artifact: 'packages-management',
  // APPLICATION_DELIVERY (all appstack*)
  list_applications: 'application-delivery',
  get_application: 'application-delivery',
  create_application: 'application-delivery',
  update_application: 'application-delivery',
  create_app_tag: 'application-delivery',
  update_app_tag: 'application-delivery',
  search_app_tags: 'application-delivery',
  update_app_tag_bind: 'application-delivery',
  create_global_var: 'application-delivery',
  get_global_var: 'application-delivery',
  update_global_var: 'application-delivery',
  list_global_vars: 'application-delivery',
  get_env_variable_groups: 'application-delivery',
  create_variable_group: 'application-delivery',
  delete_variable_group: 'application-delivery',
  get_variable_group: 'application-delivery',
  update_variable_group: 'application-delivery',
  get_app_variable_groups: 'application-delivery',
  get_app_variable_groups_revision: 'application-delivery',
  search_app_templates: 'application-delivery',
  get_latest_orchestration: 'application-delivery',
  list_app_orchestration: 'application-delivery',
  create_app_orchestration: 'application-delivery',
  delete_app_orchestration: 'application-delivery',
  get_app_orchestration: 'application-delivery',
  update_app_orchestration: 'application-delivery',
  create_appstack_change_request: 'application-delivery',
  get_appstack_change_request_audit_items: 'application-delivery',
  list_appstack_change_request_executions: 'application-delivery',
  list_appstack_change_request_work_items: 'application-delivery',
  cancel_appstack_change_request: 'application-delivery',
  close_appstack_change_request: 'application-delivery',
  get_machine_deploy_log: 'application-delivery',
  add_host_list_to_host_group: 'application-delivery',
  add_host_list_to_deploy_group: 'application-delivery',
  create_change_order: 'application-delivery',
  list_change_order_versions: 'application-delivery',
  get_change_order: 'application-delivery',
  list_change_order_job_logs: 'application-delivery',
  find_task_operation_log: 'application-delivery',
  execute_job_action: 'application-delivery',
  list_change_orders_by_origin: 'application-delivery',
  list_app_release_workflows: 'application-delivery',
  list_app_release_workflow_briefs: 'application-delivery',
  get_app_release_workflow_stage: 'application-delivery',
  list_app_release_stage_briefs: 'application-delivery',
  update_app_release_stage: 'application-delivery',
  list_app_release_stage_runs: 'application-delivery',
  execute_app_release_stage: 'application-delivery',
  cancel_app_release_stage_execution: 'application-delivery',
  retry_app_release_stage_pipeline: 'application-delivery',
  skip_app_release_stage_pipeline: 'application-delivery',
  list_app_release_stage_execution_integrated_metadata: 'application-delivery',
  get_app_release_stage_pipeline_run: 'application-delivery',
  pass_app_release_stage_pipeline_validate: 'application-delivery',
  get_app_release_stage_execution_pipeline_job_log: 'application-delivery',
  refuse_app_release_stage_pipeline_validate: 'application-delivery',
  list_system_release_workflows: 'application-delivery',
  create_system_release_workflow: 'application-delivery',
  update_system_release_stage: 'application-delivery',
  execute_system_release_stage: 'application-delivery',
  // TEST_MANAGEMENT
  list_testcase_directories: 'test-management',
  create_testcase_directory: 'test-management',
  get_testcase_field_config: 'test-management',
  create_testcase: 'test-management',
  search_testcases: 'test-management',
  get_testcase: 'test-management',
  delete_testcase: 'test-management',
  list_test_plans: 'test-management',
  get_test_result_list: 'test-management',
  update_test_result: 'test-management',
};

function parseSkillMd(content) {
  const toolBlockRe = /^- `([^`]+)` - (.+)$/gm;
  const blocks = [];
  let match;
  while ((match = toolBlockRe.exec(content)) !== null) {
    const toolName = match[1];
    const startLine = content.substring(0, match.index).split('\n').length;
    const blockStart = match.index;
    blocks.push({ toolName, lineStart: startLine, blockStart, firstLine: match[0] });
  }
  // Each block: from blockStart to (next block's blockStart or "### Standard Call Flow" / "### Error" / "### Examples" or end)
  const footerStart = content.indexOf('### Standard Call Flow');
  const mainContent = footerStart >= 0 ? content.slice(0, footerStart) : content;
  const footer = footerStart >= 0 ? content.slice(footerStart) : '';

  const toolsetToBlocks = {};
  TOOLSET_ORDER.forEach(t => { toolsetToBlocks[t] = []; });

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const next = blocks[i + 1];
    const end = next ? next.blockStart : mainContent.length;
    let blockText = content.slice(b.blockStart, end);
    if (blockText.endsWith('\n\n')) blockText = blockText.trimEnd();
    const toolset = TOOL_TO_TOOLSET[b.toolName] || 'application-delivery';
    if (!toolsetToBlocks[toolset]) toolsetToBlocks[toolset] = [];
    toolsetToBlocks[toolset].push(blockText);
  }

  return { toolsetToBlocks, footer, header: content.slice(0, blocks[0] ? blocks[0].blockStart : 0) };
}

function main() {
  const content = fs.readFileSync(SKILL_PATH, 'utf8');
  const { toolsetToBlocks, footer, header } = parseSkillMd(content);

  const titleByToolset = {
    'base': 'Base',
    'code-management': 'Code Management',
    'organization-management': 'Organization Management',
    'project-management': 'Project Management',
    'pipeline-management': 'Pipeline Management',
    'packages-management': 'Packages Management',
    'application-delivery': 'Application Delivery',
    'test-management': 'Test Management',
  };

  const outDir = __dirname;
  const toolsetFiles = [];

  for (const toolset of TOOLSET_ORDER) {
    const blocks = toolsetToBlocks[toolset] || [];
    if (blocks.length === 0) continue;
    const fileName = `${toolset}.md`;
    const title = titleByToolset[toolset];
    const body = [
      `# ${title} (${toolset})`,
      '',
      `Tools in this toolset: **${blocks.length}**`,
      '',
      '## Tools',
      '',
      blocks.join('\n\n'),
    ].join('\n');
    fs.writeFileSync(path.join(outDir, fileName), body, 'utf8');
    toolsetFiles.push({ toolset, fileName, title, count: blocks.length });
  }

  const indexLines = [
    '---',
    'name: alibabacloud-devops-mcp-server',
    'description: alibabacloud-devops-mcp-server provides 156 tools. Use cases: get current organization info, get user organizations, get current user. Keywords: current, organization, info, branch, organizations.',
    '---',
    '',
    '# alibabacloud-devops-mcp-server',
    '',
    'MCP server providing 156 tools, grouped by **Tool Set** (TOOLSET).',
    '',
    '## Tool Sets',
    '',
  ];
  for (const { fileName, title, count } of toolsetFiles) {
    indexLines.push(`- [**${title}**](${fileName}) — ${count} tools`);
  }
  indexLines.push('');
  indexLines.push(footer);

  fs.writeFileSync(SKILL_PATH, indexLines.join('\n'), 'utf8');
  console.log('Split SKILL.md by toolset. Created:', toolsetFiles.map(f => f.fileName).join(', '));
}

main();
