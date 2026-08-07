import { zodToJsonSchema } from "zod-to-json-schema";
import type { ZodTypeAny } from "zod";

/**
 * 把 Zod schema 转成 MCP 工具的 inputSchema。
 *
 * 所有 tool-registry 都必须走这里,不要直接调 zodToJsonSchema —— 工具列表会随
 * tools/list 整体进入模型 context(197 个工具约 52K token),任何全局瘦身都需要
 * 一个统一入口,否则得改 200+ 处调用点。
 *
 * 当前做的瘦身:
 * - 剥掉 $schema:zod-to-json-schema 在 target "jsonSchema7"(默认)下无条件注入
 *   `"$schema": "http://json-schema.org/draft-07/schema#"`,没有 option 可以关闭。
 *   MCP 客户端不需要它,但 197 个工具各带一份合计约 10.6K 字符。
 */
export function toInputSchema(schema: ZodTypeAny): Record<string, unknown> {
    const jsonSchema = zodToJsonSchema(schema) as Record<string, unknown>;
    delete jsonSchema.$schema;
    return jsonSchema;
}
