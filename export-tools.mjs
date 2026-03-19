#!/usr/bin/env node
/**
 * 导出所有 MCP Tools 为 JSON 文件
 * 用法: node export-tools.mjs [输出文件路径]
 */

import { defaultToolsetManager } from './dist/common/toolsetManager.js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// 获取所有 tools
const tools = defaultToolsetManager.getAllTools();

// 构建输出数据
const output = {
  total: tools.length,
  generatedAt: new Date().toISOString(),
  tools: tools.map(tool => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema
  }))
};

// 确定输出路径
const outputPath = process.argv[2] || 'tools.json';
const fullPath = resolve(outputPath);

// 写入文件
writeFileSync(fullPath, JSON.stringify(output, null, 2), 'utf-8');

console.log(`✅ 成功导出 ${tools.length} 个 tools 到: ${fullPath}`);
console.log(`\n工具分类统计:`);

// 按前缀分组统计
const groups = {};
tools.forEach(tool => {
  const prefix = tool.name.split('_')[0];
  groups[prefix] = (groups[prefix] || 0) + 1;
});

Object.entries(groups)
  .sort((a, b) => b[1] - a[1])
  .forEach(([prefix, count]) => {
    console.log(`  ${prefix}: ${count} 个`);
  });
