#!/usr/bin/env node
/**
 * 云效 DevOps CLI - 基于 MCP Server 的完整工具
 *
 * 用法:
 *   yunxiao --help                    显示帮助
 *   yunxiao list                      列出所有工具
 *   yunxiao list --category code      按类别筛选
 *   yunxiao search <keyword>          搜索工具
 *   yunxiao tool <tool_name>          查看工具详情
 *   yunxiao call <tool_name> [json]   调用工具
 *   yunxiao api <method> <endpoint>   直接调用 API
 */

import { getAllTools } from './dist/tool-registry/index.js';
import { handleToolRequest } from './dist/tool-handlers/index.js';
import { yunxiaoRequest, buildUrl } from './dist/common/utils.js';

// 类别映射
const CATEGORIES = {
  base: '基础工具',
  code: '代码管理',
  org: '组织管理',
  project: '项目管理',
  pipeline: '流水线',
  packages: '制品仓库',
  appstack: '应用交付',
  test: '测试管理'
};

// 根据工具名和描述判断类别
function getCategory(name, desc) {
  const d = (desc || '').toLowerCase();
  const n = name.toLowerCase();

  if (d.includes('[code management]') || /branch|file|repository|change_request|commit/.test(n)) return 'code';
  if (d.includes('[pipeline') || /pipeline|service_connection|vm_deploy/.test(n)) return 'pipeline';
  if (d.includes('[project') || /workitem|sprint|effort/.test(n)) return 'project';
  if (/organization|member|department/.test(n)) return 'org';
  if (/package|artifact/.test(n)) return 'packages';
  if (/appstack|application|change_order|orchestration|variable_group|release/.test(n)) return 'appstack';
  if (/test/.test(n)) return 'test';
  return 'base';
}

// 格式化参数信息
function formatParams(schema) {
  const props = schema?.properties || {};
  const required = schema?.required || [];
  const lines = [];

  for (const [name, prop] of Object.entries(props)) {
    const req = required.includes(name) ? '*' : ' ';
    const type = prop.type || 'any';
    const enumVals = prop.enum ? ` [${prop.enum.join('|')}]` : '';
    let desc = (prop.description || '').substring(0, 55);
    if ((prop.description || '').length > 55) desc += '...';
    lines.push(`  ${req} ${name.padEnd(28)} (${type.padEnd(8)})${enumVals} ${desc}`);
  }

  return lines;
}

// 命令: list
function cmdList(args) {
  const tools = getAllTools();
  const categoryFilter = args[0]?.replace('--category=', '').replace('-c=', '');

  const grouped = {};
  for (const tool of tools) {
    const cat = getCategory(tool.name, tool.description);
    if (categoryFilter && cat !== categoryFilter) continue;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(tool);
  }

  let total = 0;
  for (const cat of ['base', 'code', 'org', 'project', 'pipeline', 'packages', 'appstack', 'test']) {
    if (!grouped[cat]) continue;
    const catTools = grouped[cat];
    total += catTools.length;
    console.log(`\n=== ${CATEGORIES[cat] || cat} (${catTools.length}) ===`);
    for (const t of catTools) {
      let desc = (t.description || '').substring(0, 55);
      if ((t.description || '').length > 55) desc += '...';
      console.log(`  ${t.name.padEnd(42)} ${desc}`);
    }
  }
  console.log(`\n共 ${total} 个工具`);
}

// 命令: search
function cmdSearch(keyword) {
  if (!keyword) {
    console.log('用法: yunxiao search <关键词>');
    return;
  }

  const tools = getAllTools();
  const kw = keyword.toLowerCase();
  const results = tools.filter(t =>
    t.name.toLowerCase().includes(kw) ||
    (t.description || '').toLowerCase().includes(kw)
  );

  if (results.length === 0) {
    console.log(`未找到匹配 '${keyword}' 的工具`);
    return;
  }

  console.log(`找到 ${results.length} 个匹配的工具:\n`);
  for (const t of results) {
    const cat = getCategory(t.name, t.description);
    console.log(`  [${CATEGORIES[cat] || cat}] ${t.name}`);
    let desc = (t.description || '').substring(0, 75);
    if ((t.description || '').length > 75) desc += '...';
    console.log(`    ${desc}\n`);
  }
}

// 命令: tool
function cmdTool(toolName) {
  if (!toolName) {
    console.log('用法: yunxiao tool <工具名>');
    return;
  }

  const tools = getAllTools();
  const tool = tools.find(t => t.name === toolName);

  if (!tool) {
    console.log(`未找到工具: ${toolName}`);
    const similar = tools.filter(t => t.name.toLowerCase().includes(toolName.toLowerCase()));
    if (similar.length > 0) {
      console.log(`你是否在找: ${similar.slice(0, 5).map(t => t.name).join(', ')}`);
    }
    return;
  }

  const cat = getCategory(tool.name, tool.description);
  console.log(`工具: ${tool.name}`);
  console.log(`类别: ${CATEGORIES[cat] || cat}`);
  console.log(`\n描述:`);
  console.log(`  ${tool.description || '无'}`);

  const paramLines = formatParams(tool.inputSchema);
  if (paramLines.length > 0) {
    console.log(`\n参数:`);
    for (const line of paramLines) {
      console.log(line);
    }
    console.log(`\n  * 表示必填参数`);
  }
}

// 命令: call
async function cmdCall(toolName, argsJson) {
  if (!toolName) {
    console.log('用法: yunxiao call <工具名> [参数JSON]');
    return;
  }

  const tools = getAllTools();
  const tool = tools.find(t => t.name === toolName);

  if (!tool) {
    console.log(`未找到工具: ${toolName}`);
    return;
  }

  let args = {};
  if (argsJson) {
    try {
      args = JSON.parse(argsJson);
    } catch (e) {
      console.error(`JSON 解析错误: ${e.message}`);
      return;
    }
  }

  try {
    const request = {
      params: {
        name: toolName,
        arguments: args
      }
    };
    const result = await handleToolRequest(request);
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(`调用失败: ${e.message}`);
  }
}

// 命令: api
async function cmdApi(method, endpoint, options) {
  if (!method || !endpoint) {
    console.log('用法: yunxiao api <GET|POST|PUT|DELETE> <端点> [--data JSON]');
    return;
  }

  let data = null;
  const dataIdx = options.indexOf('--data');
  if (dataIdx !== -1 && options[dataIdx + 1]) {
    try {
      data = JSON.parse(options[dataIdx + 1]);
    } catch (e) {
      console.error(`JSON 解析错误: ${e.message}`);
      return;
    }
  }

  try {
    const result = await yunxiaoRequest(endpoint, {
      method: method.toUpperCase(),
      body: data
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(`API 调用失败: ${e.message}`);
  }
}

// 显示帮助
function showHelp() {
  console.log(`
云效 DevOps CLI - 基于 MCP Server 的完整工具

用法:
  yunxiao <命令> [选项]

命令:
  list [--category=<cat>]     列出工具 (类别: base,code,org,project,pipeline,packages,appstack,test)
  search <关键词>             搜索工具
  tool <工具名>               查看工具详情和参数
  call <工具名> [JSON]        调用工具 (使用完整的 MCP 业务逻辑)
  api <方法> <端点> [选项]    直接调用 API

示例:
  yunxiao list                          列出所有工具
  yunxiao list --category=pipeline      列出流水线工具
  yunxiao search branch                 搜索包含 branch 的工具
  yunxiao tool create_branch            查看 create_branch 详情
  yunxiao call get_current_organization_info
  yunxiao api GET /oapi/v1/organization/current

环境变量:
  YUNXIAO_ACCESS_TOKEN        云效个人访问令牌 (必需)
  YUNXIAO_API_BASE_URL        API 基础 URL (可选)
`);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === '--help' || cmd === '-h') {
    showHelp();
    return;
  }

  switch (cmd) {
    case 'list':
      cmdList(args.slice(1));
      break;
    case 'search':
      cmdSearch(args[1]);
      break;
    case 'tool':
      cmdTool(args[1]);
      break;
    case 'call':
      await cmdCall(args[1], args[2]);
      break;
    case 'api':
      await cmdApi(args[1], args[2], args.slice(3));
      break;
    default:
      console.log(`未知命令: ${cmd}`);
      showHelp();
  }
}

main().catch(e => {
  console.error(`错误: ${e.message}`);
  process.exit(1);
});
